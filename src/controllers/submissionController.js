const submissionService = require("../services/submissionService");

function clean(value, max = 2000) {
  return String(value || "").trim().slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

async function submitContact(req, res) {
  const redirectUrl = String(req.body.redirect || "/").trim();
  const safeRedirect = (redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) ? redirectUrl : "/";

  const payload = {
    type: "contact",
    name: clean(req.body.name, 120),
    email: clean(req.body.email, 160).toLowerCase(),
    subject: clean(req.body.subject, 160),
    message: clean(req.body.message, 2000),
  };

  if (!payload.name || !isEmail(payload.email) || !payload.message) {
    const separator = safeRedirect.includes("?") ? "&" : "?";
    return res.redirect(`${safeRedirect}${separator}error=contact#contact`);
  }

  await submissionService.saveSubmission(payload);
  const separator = safeRedirect.includes("?") ? "&" : "?";
  return res.redirect(`${safeRedirect}${separator}status=contact#contact`);
}

async function submitFeedback(req, res) {
  const payload = {
    type: "feedback",
    name: clean(req.body.name, 120),
    email: clean(req.body.email, 160).toLowerCase(),
    subject: "Feedback",
    message: clean(req.body.message, 2000),
  };

  if (!payload.name || !isEmail(payload.email) || !payload.message) {
    return res.redirect("/#feedback");
  }

  await submissionService.saveSubmission(payload);
  return res.redirect("/?status=feedback#feedback");
}

module.exports = {
  submitContact,
  submitFeedback,
};
