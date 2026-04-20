const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/auth.controller");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authLimiter);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;
