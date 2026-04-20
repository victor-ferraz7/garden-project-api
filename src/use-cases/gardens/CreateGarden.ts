/**
 * Caso de uso: criar um novo jardim.
 */
class CreateGarden {
  declare gardenRepository: any;
  constructor(gardenRepository) {
    this.gardenRepository = gardenRepository;
  }

  /**
   * @param {object} input - campos do jardim + actorId (JWT sub)
   */
  async execute(input) {
    const { actorId, ownerId: _o, ...rest } = input;
    return this.gardenRepository.create({ ...rest, ownerId: actorId });
  }
}

module.exports = CreateGarden;
