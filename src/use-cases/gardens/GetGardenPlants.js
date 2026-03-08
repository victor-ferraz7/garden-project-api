const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: listar plantas de um jardim.
 */
class GetGardenPlants {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ gardenId: string }} input
   * @returns {Promise<import("../../../domain/garden").Plant[]>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const garden = await this.gardenRepository.findById(input.gardenId);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    return garden.plants || [];
  }
}

module.exports = GetGardenPlants;
