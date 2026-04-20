import { describe, it, expect, vi } from "vitest";

const ListGardens = require("../../../dist/use-cases/gardens/ListGardens.js");

describe("use-cases/ListGardens", () => {
  it("repassa filtros normalizados e actorId ao repositório", async () => {
    const repo = { findAll: vi.fn().mockResolvedValue([]) };
    const uc = new ListGardens(repo);
    await uc.execute({
      phase: "veg",
      limit: "10",
      skip: "0",
      actorId: "507f1f77bcf86cd799439011",
    });
    expect(repo.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        phase: "veg",
        limit: 10,
        skip: 0,
      }),
      "507f1f77bcf86cd799439011"
    );
  });
});
