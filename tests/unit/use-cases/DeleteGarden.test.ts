import { describe, it, expect, vi } from "vitest";

const DeleteGarden = require("../../../dist/use-cases/gardens/DeleteGarden.js");
const { NotFoundError } = require("../../../dist/domain/errors.js");

describe("use-cases/DeleteGarden", () => {
  it("NotFoundError quando repositório não removeu", async () => {
    const repo = { delete: vi.fn().mockResolvedValue(false) };
    const uc = new DeleteGarden(repo);
    await expect(
      uc.execute({ id: "g1", actorId: "507f1f77bcf86cd799439011" })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("sucesso quando delete retorna true", async () => {
    const repo = { delete: vi.fn().mockResolvedValue(true) };
    const uc = new DeleteGarden(repo);
    await uc.execute({ id: "g1", actorId: "507f1f77bcf86cd799439011" });
    expect(repo.delete).toHaveBeenCalledWith("g1", "507f1f77bcf86cd799439011");
  });
});
