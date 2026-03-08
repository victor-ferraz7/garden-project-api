const router = require("express").Router();
const gardensController = require("../controllers/gardens.controller");
const logsController = require("../controllers/logs.controller");

router.get("/", gardensController.list);
router.get("/:id/logs", logsController.listByGardenId);
router.get("/:id/plants", gardensController.getPlants);
router.get("/:id/plants/:plantId", gardensController.getPlantById);
router.get("/:id", gardensController.getById);

router.post("/", gardensController.create);
router.put("/:id", gardensController.update);
router.delete("/:id", gardensController.remove);

router.post("/:id/plants", gardensController.addPlant);
router.patch("/:id/plants/:plantId", gardensController.updatePlant);

module.exports = router;
