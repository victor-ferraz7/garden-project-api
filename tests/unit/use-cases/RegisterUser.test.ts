import { describe, it, expect, vi } from "vitest";

const RegisterUser = require("../../../dist/use-cases/auth/RegisterUser.js");
const { ValidationError } = require("../../../dist/domain/errors.js");

describe("use-cases/RegisterUser", () => {
  it("cria usuário quando email livre", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ _id: { toString: () => "id1" }, email: "a@b.co" }),
    };
    const uc = new RegisterUser(repo);
    const out = await uc.execute({ email: "A@B.CO", password: "Senha12345ab" });
    expect(out.id).toBe("id1");
    expect(out.email).toBe("a@b.co");
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: "a@b.co", passwordHash: expect.any(String) })
    );
  });

  it("rejeita senha curta", async () => {
    const uc = new RegisterUser({ findByEmail: vi.fn(), create: vi.fn() });
    await expect(uc.execute({ email: "a@b.co", password: "short" })).rejects.toBeInstanceOf(
      ValidationError
    );
  });

  it("rejeita email já cadastrado (mensagem neutra)", async () => {
    const repo = {
      findByEmail: vi.fn().mockResolvedValue({ _id: "x" }),
      create: vi.fn(),
    };
    const uc = new RegisterUser(repo);
    await expect(uc.execute({ email: "a@b.co", password: "Senha12345ab" })).rejects.toMatchObject({
      message: "Não foi possível cadastrar com estes dados.",
    });
  });

  it("rejeita email com formato inválido", async () => {
    const uc = new RegisterUser({ findByEmail: vi.fn(), create: vi.fn() });
    await expect(uc.execute({ email: "nao-email", password: "Senha12345ab" })).rejects.toMatchObject({
      message: "Email inválido",
    });
  });
});
