const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: atualizar um item de estoque.
 */
class UpdateInventoryItem {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ id: string, update: Partial<import("../../../domain/inventoryItem").InventoryItem> }} input
   * @returns {Promise<import("../../../domain/inventoryItem").InventoryItem>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const item = await this.inventoryRepository.update(input.id, input.update);
    if (!item) throw new NotFoundError("Item não encontrado");
    return item;
  }
}

module.exports = UpdateInventoryItem;
