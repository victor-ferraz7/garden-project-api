const container = require("../infrastructure/container");

async function list(req, res, next) {
  try {
    const input = {
      gardenId: req.query.gardenId,
      type: req.query.type,
      fromDate: req.query.fromDate,
      toDate: req.query.toDate,
      limit: req.query.limit,
      skip: req.query.skip,
    };
    const logs = await container.listLogs.execute(input);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

async function listByGardenId(req, res, next) {
  try {
    const input = {
      gardenId: req.params.id,
      limit: req.query.limit,
      skip: req.query.skip,
    };
    const logs = await container.listLogs.execute(input);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const doc = await container.createLog.execute(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const log = await container.getLogById.execute({ id: req.params.id });
    res.json(log);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const log = await container.updateLog.execute({
      id: req.params.id,
      update: req.body,
    });
    res.json(log);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await container.deleteLog.execute({ id: req.params.id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  listByGardenId,
  create,
  getById,
  update,
  remove,
};
