import { describe, it, expect, vi } from "vitest";

const errorMiddleware = require("../../../dist/infrastructure/errorMiddleware.js");
const {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} = require("../../../dist/domain/errors.js");

function mockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
}

describe("infrastructure/errorMiddleware", () => {
  it("NotFoundError → 404", () => {
    const res = mockRes();
    errorMiddleware(new NotFoundError("não acho"), {} as never, res as never, vi.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "não acho" }));
  });

  it("ValidationError → 400 e details quando existir", () => {
    const res = mockRes();
    errorMiddleware(
      new ValidationError("bad", { x: 1 }),
      {} as never,
      res as never,
      vi.fn()
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "bad", details: { x: 1 } })
    );
  });

  it("UnauthorizedError → 401", () => {
    const res = mockRes();
    errorMiddleware(new UnauthorizedError(), {} as never, res as never, vi.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("erro genérico → 500 e em produção mensagem genérica", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const res = mockRes();
    errorMiddleware(new Error("stack leak"), {} as never, res as never, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "Erro interno do servidor" })
    );
    process.env.NODE_ENV = prev;
  });
});
