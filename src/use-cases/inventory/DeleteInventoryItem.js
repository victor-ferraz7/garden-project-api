const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: remover um item de estoque.
 */
class DeleteInventoryItem {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ id: string }} input
   * @returns {Promise<void>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const deleted = await this.inventoryRepository.delete(input.id);
    if (!deleted) throw new NotFoundError("Item não encontrado");
  }
}

module.exports = DeleteInventoryItem;
