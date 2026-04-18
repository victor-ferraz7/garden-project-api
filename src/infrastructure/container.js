/**
 * Container de dependências (composition root).
 * Instancia repositórios concretos e casos de uso para uso pelos controllers.
 */
const {
  GardenRepositoryMongo,
  LogRepositoryMongo,
  InventoryRepositoryMongo,
} = require("./repositories");

const {
  ListGardens,
  GetGardenById,
  CreateGarden,
  UpdateGarden,
  DeleteGarden,
  GetGardenPlants,
  GetGardenPlantById,
  AddPlantToGarden,
  UpdateGardenPlant,
  DeleteGardenPlant,
} = require("../use-cases/gardens");

const {
  ListLogs,
  GetLogById,
  CreateLog,
  UpdateLog,
  DeleteLog,
} = require("../use-cases/logs");

const {
  ListInventoryItems,
  GetInventoryItemById,
  CreateInventoryItem,
  UpdateInventoryItem,
  DeleteInventoryItem,
  ListLowStockItems,
} = require("../use-cases/inventory");

// Repositórios (singleton por processo)
const gardenRepository = new GardenRepositoryMongo();
const logRepository = new LogRepositoryMongo();
const inventoryRepository = new InventoryRepositoryMongo();

// Use cases - Gardens
const listGardens = new ListGardens(gardenRepository);
const getGardenById = new GetGardenById(gardenRepository);
const createGarden = new CreateGarden(gardenRepository);
const updateGarden = new UpdateGarden(gardenRepository);
const deleteGarden = new DeleteGarden(gardenRepository);
const getGardenPlants = new GetGardenPlants(gardenRepository);
const getGardenPlantById = new GetGardenPlantById(gardenRepository);
const addPlantToGarden = new AddPlantToGarden(gardenRepository);
const updateGardenPlant = new UpdateGardenPlant(gardenRepository);
const deleteGardenPlant = new DeleteGardenPlant(gardenRepository);

// Use cases - Logs
const listLogs = new ListLogs(logRepository);
const getLogById = new GetLogById(logRepository);
const createLog = new CreateLog(logRepository);
const updateLog = new UpdateLog(logRepository);
const deleteLog = new DeleteLog(logRepository);

// Use cases - Inventory
const listInventoryItems = new ListInventoryItems(inventoryRepository);
const getInventoryItemById = new GetInventoryItemById(inventoryRepository);
const createInventoryItem = new CreateInventoryItem(inventoryRepository);
const updateInventoryItem = new UpdateInventoryItem(inventoryRepository);
const deleteInventoryItem = new DeleteInventoryItem(inventoryRepository);
const listLowStockItems = new ListLowStockItems(inventoryRepository);

module.exports = {
  listGardens,
  getGardenById,
  createGarden,
  updateGarden,
  deleteGarden,
  getGardenPlants,
  getGardenPlantById,
  addPlantToGarden,
  updateGardenPlant,
  deleteGardenPlant,
  listLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog,
  listInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  listLowStockItems,
};
