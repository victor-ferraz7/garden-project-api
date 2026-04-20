const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover item de estoque.
 */
class DeleteInventoryItem {
  declare inventoryRepository: any;
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ id: string, actorId: string }} input
   */
  async execute(input) {
    const deleted = await this.inventoryRepository.delete(input.id, input.actorId);
    if (!deleted) throw new NotFoundError("Item não encontrado");
  }
}

module.exports = DeleteInventoryItem;
