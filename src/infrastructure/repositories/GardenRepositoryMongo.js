const GardenRepository = require("../../application/ports/gardenRepository");
const { Garden } = require("../../models");

/**
 * Implementação concreta de GardenRepository usando Mongoose.
 * Mapeia documentos Mongo para entidades de domínio (objetos plain).
 */
class GardenRepositoryMongo extends GardenRepository {
  async findAll(filter = {}) {
    const { phase, environment, limit, skip } = filter;
    const queryFilter = {};
    if (phase) queryFilter.phase = phase;
    if (environment) queryFilter.environment = environment;

    let query = Garden.find(queryFilter).sort({ startDate: -1 });
    if (Number.isInteger(limit) && limit > 0) query = query.limit(limit);
    if (Number.isInteger(skip) && skip >= 0) query = query.skip(skip);

    const docs = await query.lean();
    return docs;
  }

  async findById(id) {
    const doc = await Garden.findOne({ id }).lean();
    return doc || null;
  }

  async create(garden) {
    const doc = await Garden.create(garden);
    return doc.toObject ? doc.toObject() : doc;
  }

  async update(id, update) {
    const doc = await Garden.findOneAndUpdate(
      { id },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();
    return doc || null;
  }

  async delete(id) {
    const doc = await Garden.findOneAndDelete({ id });
    return !!doc;
  }

  async addPlant(gardenId, plant) {
    const garden = await Garden.findOne({ id: gardenId });
    if (!garden) return null;
    garden.plants.push(plant);
    garden.plantsCount = garden.plants.length;
    await garden.save();
    const added = garden.plants[garden.plants.length - 1];
    return added.toObject ? added.toObject() : added;
  }

  async updatePlant(gardenId, plantId, update) {
    const garden = await Garden.findOne({ id: gardenId });
    if (!garden) return null;
    const idx = garden.plants.findIndex((p) => p.id === plantId);
    if (idx === -1) return null;
    garden.plants[idx] = { ...garden.plants[idx].toObject(), ...update };
    await garden.save();
    const updated = garden.plants[idx];
    return updated.toObject ? updated.toObject() : updated;
  }

  async deletePlant(gardenId, plantId) {
    const garden = await Garden.findOne({ id: gardenId });
    if (!garden) return false;

    const initialLength = garden.plants.length;
    garden.plants = garden.plants.filter((p) => p.id !== plantId);

    if (garden.plants.length === initialLength) return false;

    garden.plantsCount = garden.plants.length;
    await garden.save();
    return true;
  }
}

module.exports = GardenRepositoryMongo;
