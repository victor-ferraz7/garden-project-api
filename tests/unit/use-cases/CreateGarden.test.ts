import { describe, it, expect, vi } from "vitest";

const CreateGarden = require("../../../dist/use-cases/gardens/CreateGarden.js");

describe("use-cases/CreateGarden", () => {
  it("injeta ownerId a partir de actorId e remove ownerId do body", async () => {
    const repo = {
      create: vi.fn().mockImplementation((g) => Promise.resolve(g)),
    };
    const uc = new CreateGarden(repo);
    await uc.execute({
      id: "g1",
      name: "N",
      actorId: "507f1f77bcf86cd799439011",
      ownerId: "should-be-stripped",
    });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "g1",
        name: "N",
        ownerId: "507f1f77bcf86cd799439011",
      })
    );
    expect(repo.create.mock.calls[0][0].ownerId).not.toBe("should-be-stripped");
  });
});
