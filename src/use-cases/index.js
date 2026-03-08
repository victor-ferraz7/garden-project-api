const gardens = require("./gardens");
const logs = require("./logs");
const inventory = require("./inventory");

module.exports = {
  ...gardens,
  ...logs,
  ...inventory,
};
