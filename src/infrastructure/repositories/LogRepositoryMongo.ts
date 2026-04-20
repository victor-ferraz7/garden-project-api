const LogRepository = require("../../application/ports/logRepository");
const { Log } = require("../../models");
const { toOwnerObjectId } = require("../mongoId");

function buildMongoFilter(filter: Record<string, unknown> = {}, ownerId: string) {
  const mongoFilter: Record<string, unknown> = { ownerId: toOwnerObjectId(ownerId) };
  if (filter.gardenId) mongoFilter.gardenId = filter.gardenId;
  if (filter.type) mongoFilter.type = filter.type;
  if (filter.fromDate || filter.toDate) {
    const dateRange: Record<string, Date> = {};
    if (filter.fromDate) {
      dateRange.$gte =
        filter.fromDate instanceof Date ? filter.fromDate : new Date(String(filter.fromDate));
    }
    if (filter.toDate) {
      dateRange.$lte =
        filter.toDate instanceof Date ? filter.toDate : new Date(String(filter.toDate));
    }
    mongoFilter.date = dateRange;
  }
  return mongoFilter;
}

/**
 * Implementação concreta de LogRepository usando Mongoose.
 */
class LogRepositoryMongo extends LogRepository {
  async findAll(filter: Record<string, unknown> = {}, ownerId: string) {
    const mongoFilter = buildMongoFilter(filter, ownerId);
    const limit = typeof filter.limit === "number" ? filter.limit : undefined;
    const skip = typeof filter.skip === "number" ? filter.skip : undefined;

    let query = Log.find(mongoFilter).sort({ date: -1 });
    if (Number.isInteger(limit) && limit > 0) query = query.limit(limit);
    if (Number.isInteger(skip) && skip >= 0) query = query.skip(skip);

    const docs = await query.lean();
    return docs;
  }

  async findByMongoId(idMongo, ownerId) {
    try {
      const oid = toOwnerObjectId(ownerId);
      const doc = await Log.findOne({ _id: idMongo, ownerId: oid }).lean();
      return doc || null;
    } catch {
      return null;
    }
  }

  async create(log) {
    const doc = await Log.create(log);
    return doc.toObject ? doc.toObject() : doc;
  }

  async update(idMongo, update, ownerId) {
    try {
      const oid = toOwnerObjectId(ownerId);
      const doc = await Log.findOneAndUpdate(
        { _id: idMongo, ownerId: oid },
        { $set: update },
        { new: true, runValidators: true }
      ).lean();
      return doc || null;
    } catch {
      return null;
    }
  }

  async delete(idMongo, ownerId) {
    try {
      const oid = toOwnerObjectId(ownerId);
      const doc = await Log.findOneAndDelete({ _id: idMongo, ownerId: oid });
      return !!doc;
    } catch {
      return false;
    }
  }
}

module.exports = LogRepositoryMongo;
