const router = require("express").Router();
const logsController = require("../controllers/logs.controller");

router.get("/", logsController.list);
router.get("/:id", logsController.getById);
router.post("/", logsController.create);
router.put("/:id", logsController.update);
router.delete("/:id", logsController.remove);

module.exports = router;
