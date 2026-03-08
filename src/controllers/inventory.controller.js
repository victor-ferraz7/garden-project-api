const container = require("../infrastructure/container");

async function list(req, res, next) {
  try {
    const input = {
      category: req.query.category,
      limit: req.query.limit,
      skip: req.query.skip,
    };
    const items = await container.listInventoryItems.execute(input);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const item = await container.getInventoryItemById.execute({
      id: req.params.id,
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const doc = await container.createInventoryItem.execute(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const item = await container.updateInventoryItem.execute({
      id: req.params.id,
      update: req.body,
    });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await container.deleteInventoryItem.execute({ id: req.params.id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function lowStock(req, res, next) {
  try {
    const items = await container.listLowStockItems.execute();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  lowStock,
};
