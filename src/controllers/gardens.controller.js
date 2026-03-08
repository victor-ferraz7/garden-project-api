const container = require("../infrastructure/container");

async function list(req, res, next) {
  try {
    const input = {
      phase: req.query.phase,
      environment: req.query.environment,
      limit: req.query.limit,
      skip: req.query.skip,
    };
    const gardens = await container.listGardens.execute(input);
    res.json(gardens);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const garden = await container.getGardenById.execute({ id: req.params.id });
    res.json(garden);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const doc = await container.createGarden.execute(req.body);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const garden = await container.updateGarden.execute({
      id: req.params.id,
      update: req.body,
    });
    res.json(garden);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await container.deleteGarden.execute({ id: req.params.id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getPlants(req, res, next) {
  try {
    const plants = await container.getGardenPlants.execute({
      gardenId: req.params.id,
    });
    res.json(plants);
  } catch (err) {
    next(err);
  }
}

async function getPlantById(req, res, next) {
  try {
    const plant = await container.getGardenPlantById.execute({
      gardenId: req.params.id,
      plantId: req.params.plantId,
    });
    res.json(plant);
  } catch (err) {
    next(err);
  }
}

async function addPlant(req, res, next) {
  try {
    const added = await container.addPlantToGarden.execute({
      gardenId: req.params.id,
      plant: req.body,
    });
    res.status(201).json(added);
  } catch (err) {
    next(err);
  }
}

async function updatePlant(req, res, next) {
  try {
    const plant = await container.updateGardenPlant.execute({
      gardenId: req.params.id,
      plantId: req.params.plantId,
      update: req.body,
    });
    res.json(plant);
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
  getPlants,
  getPlantById,
  addPlant,
  updatePlant,
};
