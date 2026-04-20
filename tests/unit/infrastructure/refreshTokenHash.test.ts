import { describe, it, expect } from "vitest";

const { hashRefreshToken, refreshTokenMatches } = require("../../../dist/infrastructure/refreshTokenHash.js");

describe("infrastructure/refreshTokenHash", () => {
  it("hash determinístico para o mesmo token", () => {
    const t = "header.payload.sig-extra-bytes-for-jwt";
    expect(hashRefreshToken(t)).toBe(hashRefreshToken(t));
  });

  it("tokens diferentes produzem hashes diferentes", () => {
    expect(hashRefreshToken("a")).not.toBe(hashRefreshToken("b"));
  });

  it("refreshTokenMatches aceita par correto e rejeita incorreto", () => {
    const token = "jwt.example.token";
    const h = hashRefreshToken(token);
    expect(refreshTokenMatches(token, h)).toBe(true);
    expect(refreshTokenMatches(token + "x", h)).toBe(false);
  });
});
