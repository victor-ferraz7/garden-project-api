/**
 * Container de dependências (composition root).
 */
const {
  GardenRepositoryMongo,
  LogRepositoryMongo,
  InventoryRepositoryMongo,
  UserRepositoryMongo,
  RefreshTokenRepositoryMongo,
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

const {
  RegisterUser,
  LoginUser,
  RefreshSession,
  LogoutUser,
} = require("../use-cases/auth");

const gardenRepository = new GardenRepositoryMongo();
const logRepository = new LogRepositoryMongo();
const inventoryRepository = new InventoryRepositoryMongo();
const userRepository = new UserRepositoryMongo();
const refreshTokenRepository = new RefreshTokenRepositoryMongo();

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

const listLogs = new ListLogs(logRepository);
const getLogById = new GetLogById(logRepository);
const createLog = new CreateLog(logRepository, gardenRepository);
const updateLog = new UpdateLog(logRepository);
const deleteLog = new DeleteLog(logRepository);

const listInventoryItems = new ListInventoryItems(inventoryRepository);
const getInventoryItemById = new GetInventoryItemById(inventoryRepository);
const createInventoryItem = new CreateInventoryItem(inventoryRepository);
const updateInventoryItem = new UpdateInventoryItem(inventoryRepository);
const deleteInventoryItem = new DeleteInventoryItem(inventoryRepository);
const listLowStockItems = new ListLowStockItems(inventoryRepository);

const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository, refreshTokenRepository);
const refreshSession = new RefreshSession(refreshTokenRepository);
const logoutUser = new LogoutUser(refreshTokenRepository);

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
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
};
