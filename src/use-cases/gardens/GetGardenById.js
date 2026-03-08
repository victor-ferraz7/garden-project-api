const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter um jardim pelo id de negócio.
 */
class GetGardenById {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ id: string }} input
   * @returns {Promise<import("../../../domain/garden").Garden>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const garden = await this.gardenRepository.findById(input.id);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    return garden;
  }
}

module.exports = GetGardenById;
