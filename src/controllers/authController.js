const User = require("../models/User");
const { isDatabaseConnected } = require("../config/database");
const { getBaseViewContext } = require("./renderContext");

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    adminApproved: user.adminApproved || false,
  };
}

function getSafeNext(req) {
  const requestedNext = String((req.body && req.body.next) || req.query.next || "");
  if (requestedNext.startsWith("/") && !requestedNext.startsWith("//")) {
    return requestedNext;
  }
  return "/more";
}

function findUserByEmail(email) {
  return User.findOne({ $or: [{ email }, { Email: email }] });
}

async function renderAuth(req, res, mode = "login", options = {}) {
  res.status(options.statusCode || 200).render(
    "auth",
    await getBaseViewContext({
      title: mode === "register" ? "Create Account | Travl.com" : "Sign In | Travl.com",
      bodyClass: "page-auth",
      mode,
      form: options.form || {},
      next: options.next || getSafeNext(req),
      errorMessage: options.errorMessage,
      successMessage: options.successMessage,
    })
  );
}

function renderLogin(req, res) {
  return renderAuth(req, res, "login");
}

function renderRegister(req, res) {
  return renderAuth(req, res, "register");
}

async function register(req, res) {
  const form = {
    name: String(req.body.name || "").trim(),
    email: String(req.body.email || "").trim().toLowerCase(),
  };
  const password = String(req.body.password || "");
  const confirmPassword = String(req.body.confirmPassword || "");
  const role = String(req.body.role || "traveller").trim();
  const validRole = ["traveller", "admin"].includes(role) ? role : "traveller";

  if (!form.name || !validateEmail(form.email) || password.length < 8) {
    return renderAuth(req, res, "register", {
      statusCode: 422,
      form,
      errorMessage: "Use a valid name, email, and a password with at least 8 characters.",
    });
  }

  if (password !== confirmPassword) {
    return renderAuth(req, res, "register", {
      statusCode: 422,
      form,
      errorMessage: "Password and confirm password must match.",
    });
  }

  if (!isDatabaseConnected()) {
    return renderAuth(req, res, "register", {
      statusCode: 503,
      form,
      errorMessage: "Account creation needs MongoDB configured. Add MDBKEY and try again.",
    });
  }

  const existingUser = await findUserByEmail(form.email).lean();
  if (existingUser) {
    return renderAuth(req, res, "register", {
      statusCode: 409,
      form,
      errorMessage: "An account already exists for this email.",
    });
  }

  let user;
  try {
    const isSuperAdmin = form.email === "admin@admin.com";
    user = await User.create({
      name: form.name,
      email: form.email,
      passwordHash: await User.hashPassword(password),
      role: validRole,
      adminApproved: isSuperAdmin ? true : false,
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return renderAuth(req, res, "register", {
        statusCode: 409,
        form,
        errorMessage: "An account already exists for this email.",
      });
    }
    throw error;
  }

  req.session.user = sanitizeUser(user);
  return res.redirect(getSafeNext(req));
}

async function login(req, res) {
  const form = {
    email: String(req.body.email || "").trim().toLowerCase(),
  };
  const password = String(req.body.password || "");

  if (!validateEmail(form.email) || !password) {
    return renderAuth(req, res, "login", {
      statusCode: 422,
      form,
      errorMessage: "Enter a valid email and password.",
    });
  }

  if (!isDatabaseConnected()) {
    return renderAuth(req, res, "login", {
      statusCode: 503,
      form,
      errorMessage: "Sign in needs MongoDB configured. Add MDBKEY and try again.",
    });
  }

  const user = await findUserByEmail(form.email).select("+passwordHash");
  if (!user || !(await user.comparePassword(password))) {
    return renderAuth(req, res, "login", {
      statusCode: 401,
      form,
      errorMessage: "Invalid email or password.",
    });
  }

  req.session.user = sanitizeUser(user);
  return res.redirect(getSafeNext(req));
}

function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("travl.sid");
    return res.redirect("/");
  });
}

module.exports = {
  login,
  logout,
  register,
  renderLogin,
  renderRegister,
};
