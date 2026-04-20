const { capPaginationLimit } = require("../../config/pagination");

/**
 * Caso de uso: listar itens de estoque com filtros e paginação.
 */
class ListInventoryItems {
  declare inventoryRepository: any;
  constructor(inventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  /**
   * @param {{ category?: string, limit?: number, skip?: number, actorId: string }} input
   */
  async execute(input: Record<string, unknown>) {
    const limitRaw = input.limit != null ? parseInt(String(input.limit), 10) : undefined;
    const skip = input.skip != null ? parseInt(String(input.skip), 10) : undefined;
    const filter = {
      category: input.category,
      limit: capPaginationLimit(limitRaw),
      skip: Number.isInteger(skip) && skip >= 0 ? skip : undefined,
    };
    return this.inventoryRepository.findAll(filter, input.actorId);
  }
}

module.exports = ListInventoryItems;
