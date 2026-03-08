const router = require("express").Router();
const inventoryController = require("../controllers/inventory.controller");

router.get("/", inventoryController.list);
router.get("/low-stock", inventoryController.lowStock);
router.get("/:id", inventoryController.getById);
router.post("/", inventoryController.create);
router.patch("/:id", inventoryController.update);
router.delete("/:id", inventoryController.remove);

module.exports = router;
