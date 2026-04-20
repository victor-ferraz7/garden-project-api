import { describe, it, expect } from "vitest";

const {
  NotFoundError,
  ValidationError,
  DomainError,
  UnauthorizedError,
} = require("../../../dist/domain/errors.js");

describe("domain/errors", () => {
  it("NotFoundError expõe statusCode 404", () => {
    const e = new NotFoundError("x");
    expect(e.statusCode).toBe(404);
    expect(e.name).toBe("NotFoundError");
  });

  it("ValidationError expõe statusCode 400 e details opcional", () => {
    const e = new ValidationError("bad", { field: "email" });
    expect(e.statusCode).toBe(400);
    expect(e.details).toEqual({ field: "email" });
  });

  it("DomainError permite statusCode customizado", () => {
    const e = new DomainError("conflito", 409);
    expect(e.statusCode).toBe(409);
  });

  it("UnauthorizedError expõe statusCode 401", () => {
    const e = new UnauthorizedError();
    expect(e.statusCode).toBe(401);
  });
});
