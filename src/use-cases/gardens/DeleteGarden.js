const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover um jardim.
 */
class DeleteGarden {
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ id: string }} input
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const deleted = await this.gardenRepository.delete(input.id);
    if (!deleted) throw new NotFoundError("Jardim não encontrado");
  }
}

module.exports = DeleteGarden;
