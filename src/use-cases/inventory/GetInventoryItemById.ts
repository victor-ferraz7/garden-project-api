const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter item de estoque por id de negócio.
 */
class GetInventoryItemById {
  declare inventoryRepository: any;
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ id: string, actorId: string }} input
   */
  async execute(input) {
    const item = await this.inventoryRepository.findById(input.id, input.actorId);
    if (!item) throw new NotFoundError("Item não encontrado");
    return item;
  }
}

module.exports = GetInventoryItemById;
