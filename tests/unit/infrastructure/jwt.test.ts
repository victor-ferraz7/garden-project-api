import { describe, it, expect } from "vitest";

const {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  newJti,
} = require("../../../dist/infrastructure/jwt.js");

describe("infrastructure/jwt", () => {
  it("access: assina e verifica sub + typ access", async () => {
    const sub = new (require("mongoose").Types.ObjectId)().toString();
    const token = await signAccessToken(sub);
    const payload = await verifyAccessToken(token);
    expect(payload.sub).toBe(sub);
    expect(payload.typ).toBe("access");
  });

  it("refresh: assina e verifica sub, typ refresh e jti", async () => {
    const sub = new (require("mongoose").Types.ObjectId)().toString();
    const jti = newJti();
    const token = await signRefreshToken(sub, jti);
    const payload = await verifyRefreshToken(token);
    expect(payload.sub).toBe(sub);
    expect(payload.typ).toBe("refresh");
    expect(payload.jti).toBe(jti);
  });

  it("access token inválido lança UnauthorizedError", async () => {
    await expect(verifyAccessToken("not.a.jwt")).rejects.toMatchObject({
      name: "UnauthorizedError",
    });
  });
});
