import { describe, it, expect } from "vitest";

const { createGarden } = require("../../../dist/domain/garden.js");
const { createLog } = require("../../../dist/domain/log.js");
const { createInventoryItem } = require("../../../dist/domain/inventoryItem.js");

describe("domain — fábricas puras", () => {
  it("createGarden aplica defaults de plants e stats e sobrescreve props", () => {
    const g = createGarden({
      id: "g1",
      name: "A",
      phase: "veg",
      environment: "indoor",
      day: 1,
      plantsCount: 0,
      startDate: new Date(),
      plants: [{ id: "p1", name: "P" }],
    });
    expect(g.plants).toHaveLength(1);
    expect(g.stats).toEqual({});
  });

  it("createLog aplica default de note", () => {
    const l = createLog({
      gardenId: "g1",
      type: "water",
      date: new Date(),
    });
    expect(l.note).toBe("");
  });

  it("createInventoryItem aplica default de notes", () => {
    const i = createInventoryItem({
      id: "i1",
      name: "N",
      category: "c",
      quantity: 1,
      unit: "g",
      minStock: 0,
      lastUpdated: new Date(),
    });
    expect(i.notes).toBe("");
  });
});
