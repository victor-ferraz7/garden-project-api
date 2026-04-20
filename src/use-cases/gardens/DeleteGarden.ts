const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover um jardim.
 */
class DeleteGarden {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ id: string, actorId: string }} input
   */
  async execute(input) {
    const deleted = await this.gardenRepository.delete(input.id, input.actorId);
    if (!deleted) throw new NotFoundError("Jardim não encontrado");
  }
}

module.exports = DeleteGarden;
