import { describe, it, expect, vi } from "vitest";

const GetGardenById = require("../../../dist/use-cases/gardens/GetGardenById.js");
const { NotFoundError } = require("../../../dist/domain/errors.js");

describe("use-cases/GetGardenById", () => {
  it("retorna jardim quando repositório encontra", async () => {
    const doc = { id: "g1", name: "X" };
    const repo = { findById: vi.fn().mockResolvedValue(doc) };
    const uc = new GetGardenById(repo);
    const out = await uc.execute({ id: "g1", actorId: "507f1f77bcf86cd799439011" });
    expect(out).toEqual(doc);
    expect(repo.findById).toHaveBeenCalledWith("g1", "507f1f77bcf86cd799439011");
  });

  it("lança NotFoundError quando null", async () => {
    const repo = { findById: vi.fn().mockResolvedValue(null) };
    const uc = new GetGardenById(repo);
    await expect(uc.execute({ id: "x", actorId: "507f1f77bcf86cd799439011" })).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
