import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";

import { startMongoMemory, stopMongoMemory } from "../../helpers/mongoMemory";

const RefreshTokenRepositoryMongo = require("../../../dist/infrastructure/repositories/RefreshTokenRepositoryMongo.js");
const { RefreshToken } = require("../../../dist/models/index.js");
const { hashRefreshToken } = require("../../../dist/infrastructure/refreshTokenHash.js");

describe("integration / RefreshTokenRepositoryMongo", () => {
  const repo = new RefreshTokenRepositoryMongo();

  beforeAll(async () => {
    await startMongoMemory();
  });

  afterAll(async () => {
    await stopMongoMemory();
  });

  beforeEach(async () => {
    await RefreshToken.deleteMany({});
  });

  it("findValidByJti exige hash correto; revoke invalida", async () => {
    const userId = new mongoose.Types.ObjectId();
    const jti = "jti-test-1";
    const plain = "plain-refresh-jwt-body";
    const expiresAt = new Date(Date.now() + 60_000);
    await repo.create({
      userId,
      jti,
      hashedToken: hashRefreshToken(plain),
      expiresAt,
    });
    const ok = await repo.findValidByJti(jti, plain);
    expect(ok?.userId.toString()).toBe(userId.toString());
    expect(await repo.findValidByJti(jti, plain + "x")).toBeNull();
    await repo.revoke(jti, null);
    expect(await repo.findValidByJti(jti, plain)).toBeNull();
  });

  it("revokeAllForUser marca sessões ativas", async () => {
    const uid = new mongoose.Types.ObjectId().toString();
    const oid = new mongoose.Types.ObjectId(uid);
    await repo.create({
      userId: oid,
      jti: "a",
      hashedToken: hashRefreshToken("t1"),
      expiresAt: new Date(Date.now() + 60_000),
    });
    await repo.create({
      userId: oid,
      jti: "b",
      hashedToken: hashRefreshToken("t2"),
      expiresAt: new Date(Date.now() + 60_000),
    });
    await repo.revokeAllForUser(uid);
    const active = await RefreshToken.countDocuments({ userId: oid, revokedAt: null });
    expect(active).toBe(0);
  });
});
