import { describe, it, expect } from "vitest";
import mongoose from "mongoose";

const { toOwnerObjectId } = require("../../../dist/infrastructure/mongoId.js");
const { ValidationError } = require("../../../dist/domain/errors.js");

describe("infrastructure/mongoId", () => {
  it("converte sub válido em ObjectId", () => {
    const id = new mongoose.Types.ObjectId();
    const oid = toOwnerObjectId(id.toString());
    expect(oid.equals(id)).toBe(true);
  });

  it("rejeita string inválida com ValidationError", () => {
    expect(() => toOwnerObjectId("not-an-objectid")).toThrow(ValidationError);
  });

  it("rejeita vazio", () => {
    expect(() => toOwnerObjectId("")).toThrow(ValidationError);
  });
});
