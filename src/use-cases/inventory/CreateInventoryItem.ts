/**
 * Caso de uso: criar um novo item de estoque.
 */
class CreateInventoryItem {
  declare inventoryRepository: any;
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {object} input - campos do item + actorId
   */
  async execute(input) {
    const { actorId, ownerId: _o, ...rest } = input;
    return this.inventoryRepository.create({ ...rest, ownerId: actorId });
  }
}

module.exports = CreateInventoryItem;
