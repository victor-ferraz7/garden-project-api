/**
 * Caso de uso: listar logs com filtros e paginação.
 */
class ListLogs {
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ gardenId?: string, type?: string, fromDate?: string|Date, toDate?: string|Date, limit?: number, skip?: number }} input
   * @returns {Promise<import("../../../domain/log").Log[]>}
   */
  async execute(input = {}) {
    const limit = input.limit != null ? parseInt(input.limit, 10) : undefined;
    const skip = input.skip != null ? parseInt(input.skip, 10) : undefined;
    const filter = {
      gardenId: input.gardenId,
      type: input.type,
      fromDate: input.fromDate ? (input.fromDate instanceof Date ? input.fromDate : new Date(input.fromDate)) : undefined,
      toDate: input.toDate ? (input.toDate instanceof Date ? input.toDate : new Date(input.toDate)) : undefined,
      limit: Number.isInteger(limit) && limit > 0 ? limit : undefined,
      skip: Number.isInteger(skip) && skip >= 0 ? skip : undefined,
    };
    return this.logRepository.findAll(filter);
  }
}

module.exports = ListLogs;
