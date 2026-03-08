const { NotFoundError } = require("../../domain/errors");

/**
 * Caso de uso: obter um item de estoque pelo id.
 */
class GetInventoryItemById {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ id: string }} input
   * @returns {Promise<import("../../../domain/inventoryItem").InventoryItem>}
   * @throws {NotFoundError}
   */
  async execute(input) {
    const item = await this.inventoryRepository.findById(input.id);
    if (!item) throw new NotFoundError("Item não encontrado");
    return item;
  }
}

module.exports = GetInventoryItemById;
