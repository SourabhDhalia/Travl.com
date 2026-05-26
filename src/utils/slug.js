function normalizeSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = {
  normalizeSlug,
};
