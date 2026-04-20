import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";

import { startMongoMemory, stopMongoMemory } from "../../helpers/mongoMemory";

const UserRepositoryMongo = require("../../../dist/infrastructure/repositories/UserRepositoryMongo.js");
const { User } = require("../../../dist/models/index.js");

describe("integration / UserRepositoryMongo", () => {
  const repo = new UserRepositoryMongo();

  beforeAll(async () => {
    await startMongoMemory();
  });

  afterAll(async () => {
    await stopMongoMemory();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("findByEmail normaliza case e create + findById", async () => {
    const created = await repo.create({ email: "USER@TEST.LOCAL", passwordHash: "h" });
    const found = await repo.findByEmail("user@test.local");
    expect(found?._id.toString()).toBe(created._id.toString());
    const byId = await repo.findById(created._id.toString());
    expect(byId?.email).toBe("user@test.local");
  });
});
