const gardens = require("./gardens");
const logs = require("./logs");
const inventory = require("./inventory");
const auth = require("./auth");

module.exports = {
  ...gardens,
  ...logs,
  ...inventory,
  ...auth,
};
