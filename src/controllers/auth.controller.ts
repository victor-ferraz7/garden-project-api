const container = require("../infrastructure/container");

async function register(req, res, next) {
  try {
    const user = await container.registerUser.execute(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const tokens = await container.loginUser.execute({
      ...req.body,
      createdFromIp: req.ip,
      userAgent: req.get("user-agent") || null,
    });
    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const tokens = await container.refreshSession.execute({
      ...req.body,
      createdFromIp: req.ip,
      userAgent: req.get("user-agent") || null,
    });
    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await container.logoutUser.execute(req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};
