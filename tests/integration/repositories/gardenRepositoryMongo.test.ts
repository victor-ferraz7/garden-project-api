import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";

import { startMongoMemory, stopMongoMemory } from "../../helpers/mongoMemory";

const GardenRepositoryMongo = require("../../../dist/infrastructure/repositories/GardenRepositoryMongo.js");
const { Garden } = require("../../../dist/models/index.js");

describe("integration / GardenRepositoryMongo", () => {
  let ownerId: string;
  const repo = new GardenRepositoryMongo();

  beforeAll(async () => {
    await startMongoMemory();
    ownerId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    await stopMongoMemory();
  });

  beforeEach(async () => {
    await Garden.deleteMany({});
  });

  it("create + findById escopados por ownerId", async () => {
    const payload = {
      ownerId,
      id: "g-int-1",
      name: "Test",
      phase: "veg",
      environment: "indoor",
      day: 0,
      plantsCount: 0,
      startDate: new Date(),
    };
    await repo.create(payload);
    const found = await repo.findById("g-int-1", ownerId);
    expect(found?.name).toBe("Test");
    const other = await repo.findById("g-int-1", new mongoose.Types.ObjectId().toString());
    expect(other).toBeNull();
  });

  it("update e delete respeitam ownerId", async () => {
    await repo.create({
      ownerId,
      id: "g2",
      name: "A",
      phase: "veg",
      environment: "indoor",
      day: 0,
      plantsCount: 0,
      startDate: new Date(),
    });
    const updated = await repo.update("g2", { name: "B" }, ownerId);
    expect(updated?.name).toBe("B");
    const wrongOwner = await repo.update("g2", { name: "C" }, new mongoose.Types.ObjectId().toString());
    expect(wrongOwner).toBeNull();
    expect(await repo.delete("g2", ownerId)).toBe(true);
  });
});
