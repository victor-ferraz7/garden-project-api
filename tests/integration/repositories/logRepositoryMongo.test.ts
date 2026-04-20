import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";

import { startMongoMemory, stopMongoMemory } from "../../helpers/mongoMemory";

const LogRepositoryMongo = require("../../../dist/infrastructure/repositories/LogRepositoryMongo.js");
const { Log } = require("../../../dist/models/index.js");

describe("integration / LogRepositoryMongo", () => {
  let ownerId: string;
  const repo = new LogRepositoryMongo();

  beforeAll(async () => {
    await startMongoMemory();
    ownerId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    await stopMongoMemory();
  });

  beforeEach(async () => {
    await Log.deleteMany({});
  });

  it("create e findAll filtram por ownerId", async () => {
    await repo.create({
      ownerId,
      gardenId: "gx",
      type: "water",
      date: new Date(),
    });
    const list = await repo.findAll({ gardenId: "gx" }, ownerId);
    expect(list).toHaveLength(1);
    const empty = await repo.findAll({ gardenId: "gx" }, new mongoose.Types.ObjectId().toString());
    expect(empty).toHaveLength(0);
  });
});
