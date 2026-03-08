const LogRepository = require("../../application/ports/logRepository");
const { Log } = require("../../models");

function buildMongoFilter(filter = {}) {
  const mongoFilter = {};
  if (filter.gardenId) mongoFilter.gardenId = filter.gardenId;
  if (filter.type) mongoFilter.type = filter.type;
  if (filter.fromDate || filter.toDate) {
    mongoFilter.date = {};
    if (filter.fromDate) mongoFilter.date.$gte = filter.fromDate instanceof Date ? filter.fromDate : new Date(filter.fromDate);
    if (filter.toDate) mongoFilter.date.$lte = filter.toDate instanceof Date ? filter.toDate : new Date(filter.toDate);
  }
  return mongoFilter;
}

/**
 * Implementação concreta de LogRepository usando Mongoose.
 */
class LogRepositoryMongo extends LogRepository {
  async findAll(filter = {}) {
    const mongoFilter = buildMongoFilter(filter);
    const { limit, skip } = filter;

    let query = Log.find(mongoFilter).sort({ date: -1 });
    if (Number.isInteger(limit) && limit > 0) query = query.limit(limit);
    if (Number.isInteger(skip) && skip >= 0) query = query.skip(skip);

    const docs = await query.lean();
    return docs;
  }

  async findByMongoId(idMongo) {
    try {
      const doc = await Log.findById(idMongo).lean();
      return doc || null;
    } catch {
      return null;
    }
  }

  async create(log) {
    const doc = await Log.create(log);
    return doc.toObject ? doc.toObject() : doc;
  }

  async update(idMongo, update) {
    try {
      const doc = await Log.findByIdAndUpdate(
        idMongo,
        { $set: update },
        { new: true, runValidators: true }
      ).lean();
      return doc || null;
    } catch {
      return null;
    }
  }

  async delete(idMongo) {
    try {
      const doc = await Log.findByIdAndDelete(idMongo);
      return !!doc;
    } catch {
      return false;
    }
  }
}

module.exports = LogRepositoryMongo;
