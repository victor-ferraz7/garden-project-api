import { describe, it, expect, vi } from "vitest";

const GetInventoryItemById = require("../../../dist/use-cases/inventory/GetInventoryItemById.js");
const { NotFoundError } = require("../../../dist/domain/errors.js");

describe("use-cases/GetInventoryItemById", () => {
  it("NotFoundError quando item não existe para o owner", async () => {
    const repo = { findById: vi.fn().mockResolvedValue(null) };
    const uc = new GetInventoryItemById(repo);
    await expect(
      uc.execute({ id: "i1", actorId: "507f1f77bcf86cd799439011" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
