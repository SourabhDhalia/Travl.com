function getLoginRedirect(req) {
  return `/login?next=${encodeURIComponent(req.originalUrl || req.url || "/more")}`;
}

function requireUser(req, res, next) {
  if (req.session.user) return next();
  return res.redirect(getLoginRedirect(req));
}

function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect(getLoginRedirect(req));

  const user = req.session.user;
  if (user.role !== "admin") {
    return res.status(403).render("error", {
      title: "Admin Access Required | Travl.com",
      bodyClass: "page-error",
      message: "Admin access is required to open this panel.",
    });
  }

  const isSuperAdmin = user.email === "admin@admin.com";
  if (!isSuperAdmin && !user.adminApproved) {
    return res.status(403).render("error", {
      title: "Pending Approval | Travl.com",
      bodyClass: "page-error",
      message: "Your admin account is pending approval from the main administrator (admin@admin.com).",
    });
  }

  return next();
}

module.exports = {
  requireAdmin,
  requireUser,
};
