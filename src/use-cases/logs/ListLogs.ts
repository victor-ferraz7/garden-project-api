const { capPaginationLimit } = require("../../config/pagination");

/**
 * Caso de uso: listar logs com filtros e paginação.
 */
class ListLogs {
  declare logRepository: any;
  constructor(logRepository) {
    this.logRepository = logRepository;
  }

  /**
   * @param {{ gardenId?: string, type?: string, fromDate?: string|Date, toDate?: string|Date, limit?: number, skip?: number, actorId: string }} input
   */
  async execute(input: Record<string, unknown>) {
    const limitRaw = input.limit != null ? parseInt(String(input.limit), 10) : undefined;
    const skip = input.skip != null ? parseInt(String(input.skip), 10) : undefined;
    const filter = {
      gardenId: input.gardenId,
      type: input.type,
      fromDate: input.fromDate
        ? input.fromDate instanceof Date
          ? input.fromDate
          : new Date(String(input.fromDate))
        : undefined,
      toDate: input.toDate
        ? input.toDate instanceof Date
          ? input.toDate
          : new Date(String(input.toDate))
        : undefined,
      limit: capPaginationLimit(limitRaw),
      skip: Number.isInteger(skip) && skip >= 0 ? skip : undefined,
    };
    return this.logRepository.findAll(filter, input.actorId);
  }
}

module.exports = ListLogs;
