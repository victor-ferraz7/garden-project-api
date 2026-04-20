const GardenRepository = require("../../application/ports/gardenRepository");
const { Garden } = require("../../models");
const { toOwnerObjectId } = require("../mongoId");

/**
 * Implementação concreta de GardenRepository usando Mongoose.
 */
class GardenRepositoryMongo extends GardenRepository {
  async findAll(filter: Record<string, unknown> = {}, ownerId: string) {
    const oid = toOwnerObjectId(ownerId);
    const { phase, environment, limit, skip } = filter as {
      phase?: string;
      environment?: string;
      limit?: number;
      skip?: number;
    };
    const queryFilter: Record<string, unknown> = { ownerId: oid };
    if (phase) queryFilter.phase = phase;
    if (environment) queryFilter.environment = environment;

    let query = Garden.find(queryFilter).sort({ startDate: -1 });
    if (Number.isInteger(limit) && limit > 0) query = query.limit(limit);
    if (Number.isInteger(skip) && skip >= 0) query = query.skip(skip);

    const docs = await query.lean();
    return docs;
  }

  async findById(id, ownerId) {
    const oid = toOwnerObjectId(ownerId);
    const doc = await Garden.findOne({ id, ownerId: oid }).lean();
    return doc || null;
  }

  async create(garden) {
    const doc = await Garden.create(garden);
    return doc.toObject ? doc.toObject() : doc;
  }

  async update(id, update, ownerId) {
    const oid = toOwnerObjectId(ownerId);
    const doc = await Garden.findOneAndUpdate(
      { id, ownerId: oid },
      { $set: update },
      { returnDocument: "after", runValidators: true }
    ).lean();
    return doc || null;
  }

  async delete(id, ownerId) {
    const oid = toOwnerObjectId(ownerId);
    const doc = await Garden.findOneAndDelete({ id, ownerId: oid });
    return !!doc;
  }

  async addPlant(gardenId, plant, ownerId) {
    const oid = toOwnerObjectId(ownerId);
    const garden = await Garden.findOne({ id: gardenId, ownerId: oid });
    if (!garden) return null;
    garden.plants.push(plant);
    garden.plantsCount = garden.plants.length;
    await garden.save();
    const added = garden.plants[garden.plants.length - 1];
    return added.toObject ? added.toObject() : added;
  }

  async updatePlant(gardenId, plantId, update, ownerId) {
    const oid = toOwnerObjectId(ownerId);
    const garden = await Garden.findOne({ id: gardenId, ownerId: oid });
    if (!garden) return null;
    const idx = garden.plants.findIndex((p) => p.id === plantId);
    if (idx === -1) return null;
    garden.plants[idx] = { ...garden.plants[idx].toObject(), ...update };
    await garden.save();
    const updated = garden.plants[idx];
    return updated.toObject ? updated.toObject() : updated;
  }

  async deletePlant(gardenId, plantId, ownerId) {
    const oid = toOwnerObjectId(ownerId);
    const garden = await Garden.findOne({ id: gardenId, ownerId: oid });
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
