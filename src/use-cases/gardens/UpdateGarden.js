const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: atualizar um jardim existente.
 */
class UpdateGarden {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ id: string, update: Partial<import("../../../domain/garden").Garden> }} input
   * @returns {Promise<import("../../../domain/garden").Garden>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const garden = await this.gardenRepository.update(input.id, input.update);
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    return garden;
  }
}

module.exports = UpdateGarden;
