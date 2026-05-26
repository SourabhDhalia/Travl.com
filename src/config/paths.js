const path = require("path");

const root = path.join(__dirname, "../..");

module.exports = {
  root,
  public: path.join(root, "public"),
  templates: path.join(root, "templates"),
  views: path.join(root, "templates/views"),
  partials: path.join(root, "templates/partials"),
};
