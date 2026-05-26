function json(value) {
  return JSON.stringify(value || []).replace(/</g, "\\u003c");
}

module.exports = {
  json,
};
