import { describe, it, expect, vi } from "vitest";

const CreateLog = require("../../../dist/use-cases/logs/CreateLog.js");
const { NotFoundError } = require("../../../dist/domain/errors.js");

describe("use-cases/CreateLog", () => {
  it("exige jardim do actorId", async () => {
    const gardenRepo = { findById: vi.fn().mockResolvedValue(null) };
    const logRepo = { create: vi.fn() };
    const uc = new CreateLog(logRepo, gardenRepo);
    await expect(
      uc.execute({
        gardenId: "g1",
        type: "water",
        date: new Date(),
        actorId: "507f1f77bcf86cd799439011",
      })
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(logRepo.create).not.toHaveBeenCalled();
  });

  it("persiste log com ownerId = actorId", async () => {
    const gardenRepo = { findById: vi.fn().mockResolvedValue({ id: "g1" }) };
    const logRepo = { create: vi.fn().mockResolvedValue({ _id: "log1" }) };
    const uc = new CreateLog(logRepo, gardenRepo);
    const actorId = "507f1f77bcf86cd799439011";
    await uc.execute({
      gardenId: "g1",
      type: "note",
      date: new Date(),
      actorId,
    });
    expect(logRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: actorId, gardenId: "g1" })
    );
  });
});
