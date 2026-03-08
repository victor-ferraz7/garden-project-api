/**
 * Caso de uso: listar jardins com filtros e paginação.
 * Não conhece HTTP nem Mongoose.
 */
class ListGardens {
  /**
   * @param {import("../../application/ports/gardenRepository")} gardenRepository
   */
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ phase?: string, environment?: string, limit?: number, skip?: number }} input
   * @returns {Promise<import("../../../domain/garden").Garden[]>}
   */
  async execute(input = {}) {
    const limit = input.limit != null ? parseInt(input.limit, 10) : undefined;
    const skip = input.skip != null ? parseInt(input.skip, 10) : undefined;
    const filter = {
      phase: input.phase,
      environment: input.environment,
      limit: Number.isInteger(limit) && limit > 0 ? limit : undefined,
      skip: Number.isInteger(skip) && skip >= 0 ? skip : undefined,
    };
    return this.gardenRepository.findAll(filter);
  }
}

module.exports = ListGardens;
