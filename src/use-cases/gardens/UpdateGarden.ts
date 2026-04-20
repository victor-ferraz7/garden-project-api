const { NotFoundError } = require("../../domain/errors");

function stripImmutable(update) {
  if (!update || typeof update !== "object") return update;
  const { ownerId: _o, id: _i, ...rest } = update;
  return rest;
}

/**
 * Caso de uso: atualizar um jardim existente.
 */
class UpdateGarden {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {{ id: string, update: object, actorId: string }} input
   */
  async execute(input) {
    const garden = await this.gardenRepository.update(
      input.id,
      stripImmutable(input.update),
      input.actorId
    );
    if (!garden) throw new NotFoundError("Jardim não encontrado");
    return garden;
  }
}

module.exports = UpdateGarden;
