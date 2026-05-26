function attachViewLocals(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  next();
}

module.exports = {
  attachViewLocals,
};
