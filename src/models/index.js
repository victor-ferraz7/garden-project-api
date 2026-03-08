const Garden = require("./Garden");
const Log = require("./Log");
const InventoryItem = require("./InventoryItem");

module.exports = {
  Garden,
  Log,
  InventoryItem,
  PHASES: Garden.PHASES,
  ENVIRONMENTS: Garden.ENVIRONMENTS,
  PLANT_STATUSES: Garden.PLANT_STATUSES,
  LOG_TYPES: Log.LOG_TYPES,
};
