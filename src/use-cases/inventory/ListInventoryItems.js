/**
 * Caso de uso: listar itens de estoque com filtros e paginação.
 */
class ListInventoryItems {
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ category?: string, limit?: number, skip?: number }} input
   * @returns {Promise<import("../../../domain/inventoryItem").InventoryItem[]>}
   */
  async execute(input = {}) {
    const limit = input.limit != null ? parseInt(input.limit, 10) : undefined;
    const skip = input.skip != null ? parseInt(input.skip, 10) : undefined;
    const filter = {
      category: input.category,
      limit: Number.isInteger(limit) && limit > 0 ? limit : undefined,
      skip: Number.isInteger(skip) && skip >= 0 ? skip : undefined,
    };
    return this.inventoryRepository.findAll(filter);
  }
}

module.exports = ListInventoryItems;
