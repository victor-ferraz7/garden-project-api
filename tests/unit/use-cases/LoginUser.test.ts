import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";

const bcrypt = require("bcryptjs");

const LoginUser = require("../../../dist/use-cases/auth/LoginUser.js");
const { UnauthorizedError } = require("../../../dist/domain/errors.js");

describe("use-cases/LoginUser", () => {
  const ownerId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
  });

  it("emite tokens e persiste sessão de refresh", async () => {
    const user = {
      _id: ownerId,
      passwordHash: "hash",
      email: "u@test.co",
    };
    const userRepo = { findByEmail: vi.fn().mockResolvedValue(user) };
    const refreshRepo = { create: vi.fn().mockResolvedValue(undefined) };
    const uc = new LoginUser(userRepo, refreshRepo);
    const out = await uc.execute({ email: "u@test.co", password: "ok" });
    expect(out.tokenType).toBe("Bearer");
    expect(out.accessToken).toBeTruthy();
    expect(out.refreshToken).toBeTruthy();
    expect(refreshRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        jti: expect.any(String),
        hashedToken: expect.any(String),
        userId: ownerId,
      })
    );
  });

  it("credenciais inválidas → UnauthorizedError", async () => {
    vi.spyOn(bcrypt, "compare").mockResolvedValue(false as never);
    const uc = new LoginUser(
      { findByEmail: vi.fn().mockResolvedValue({ _id: ownerId, passwordHash: "h" }) },
      { create: vi.fn() }
    );
    await expect(uc.execute({ email: "u@test.co", password: "bad" })).rejects.toBeInstanceOf(
      UnauthorizedError
    );
  });
});
