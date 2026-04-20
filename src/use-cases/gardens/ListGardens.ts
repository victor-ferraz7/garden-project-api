const { capPaginationLimit } = require("../../config/pagination");

/**
 * Caso de uso: listar jardins com filtros e paginação.
 */
class ListGardens {
  declare gardenRepository: any;
  /**
   * @param {import("../../application/ports/gardenRepository")} gardenRepository
   */
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ phase?: string, environment?: string, limit?: number, skip?: number, actorId: string }} input
   */
  async execute(input: Record<string, unknown>) {
    const limitRaw = input.limit != null ? parseInt(String(input.limit), 10) : undefined;
    const skip = input.skip != null ? parseInt(String(input.skip), 10) : undefined;
    const filter = {
      phase: input.phase,
      environment: input.environment,
      limit: capPaginationLimit(limitRaw),
      skip: Number.isInteger(skip) && skip >= 0 ? skip : undefined,
    };
    return this.gardenRepository.findAll(filter, input.actorId);
  }
}

module.exports = ListGardens;
