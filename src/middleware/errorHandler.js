function notFound(req, res) {
  res.status(404).render("error", {
    title: "Page not found",
    message: "We could not find that travel path.",
    statusCode: 404,
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).render("error", {
    title: statusCode === 500 ? "Something went wrong" : "Request issue",
    message:
      statusCode === 500
        ? "Travl hit a server issue. Please try again in a moment."
        : error.message,
    statusCode,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
