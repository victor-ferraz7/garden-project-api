const InventoryRepository = require("../../application/ports/inventoryRepository");
const { InventoryItem } = require("../../models");

/**
 * Implementação concreta de InventoryRepository usando Mongoose.
 */
class InventoryRepositoryMongo extends InventoryRepository {
  async findAll(filter = {}) {
    const { category, limit, skip } = filter;
    const queryFilter = category ? { category } : {};

    let query = InventoryItem.find(queryFilter).sort({ name: 1 });
    if (Number.isInteger(limit) && limit > 0) query = query.limit(limit);
    if (Number.isInteger(skip) && skip >= 0) query = query.skip(skip);

    const docs = await query.lean();
    return docs;
  }

  async findById(id) {
    const doc = await InventoryItem.findOne({ id }).lean();
    return doc || null;
  }

  async create(item) {
    const doc = await InventoryItem.create(item);
    return doc.toObject ? doc.toObject() : doc;
  }

  async update(id, update) {
    const doc = await InventoryItem.findOneAndUpdate(
      { id },
      { $set: { ...update, lastUpdated: new Date() } },
      { new: true, runValidators: true }
    ).lean();
    return doc || null;
  }

  async delete(id) {
    const doc = await InventoryItem.findOneAndDelete({ id });
    return !!doc;
  }

  async findLowStock() {
    const docs = await InventoryItem.find({
      $expr: { $lte: ["$quantity", "$minStock"] },
    })
      .sort({ quantity: 1 })
      .lean();
    return docs;
  }
}

module.exports = InventoryRepositoryMongo;
