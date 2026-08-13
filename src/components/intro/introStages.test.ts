import { describe, it, expect } from "vitest";
import { STAGES, getActiveStage, getStageProgress, getProductStageSlice } from "./introStages";

describe("STAGES", () => {
  it("covers 0 to 1 with no gaps, in order", () => {
    expect(STAGES[0].start).toBe(0);
    expect(STAGES[STAGES.length - 1].end).toBe(1);
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].start).toBe(STAGES[i - 1].end);
    }
  });

  it("gives every stage a strictly positive span", () => {
    for (const stage of STAGES) {
      expect(stage.start).toBeLessThan(stage.end);
    }
  });
});

describe("getActiveStage", () => {
  it("returns mountain at progress 0", () => {
    expect(getActiveStage(0).id).toBe("mountain");
  });

  it("returns approach at progress 0.2", () => {
    expect(getActiveStage(0.2).id).toBe("approach");
  });

  it("returns company at progress 0.35", () => {
    expect(getActiveStage(0.35).id).toBe("company");
  });

  it("returns products at progress 0.6", () => {
    expect(getActiveStage(0.6).id).toBe("products");
  });

  it("returns contact at progress 0.9 and at progress 1", () => {
    expect(getActiveStage(0.9).id).toBe("contact");
    expect(getActiveStage(1).id).toBe("contact");
  });

  it("clamps out-of-range progress", () => {
    expect(getActiveStage(-0.5).id).toBe("mountain");
    expect(getActiveStage(1.5).id).toBe("contact");
  });

  // Half-open boundaries: a stage matches when start <= p < end, so each interior
  // boundary value belongs to the LATER stage and anything just below it to the earlier one.
  it("assigns the 0.15 boundary to approach and just below it to mountain", () => {
    expect(getActiveStage(0.15).id).toBe("approach");
    expect(getActiveStage(0.1499).id).toBe("mountain");
  });

  it("assigns the 0.3 boundary to company and just below it to approach", () => {
    expect(getActiveStage(0.3).id).toBe("company");
    expect(getActiveStage(0.2999).id).toBe("approach");
  });

  it("assigns the 0.45 boundary to products and just below it to company", () => {
    expect(getActiveStage(0.45).id).toBe("products");
    expect(getActiveStage(0.4499).id).toBe("company");
  });

  it("assigns the 0.85 boundary to contact and just below it to products", () => {
    expect(getActiveStage(0.85).id).toBe("contact");
    expect(getActiveStage(0.8499).id).toBe("products");
  });
});

describe("getStageProgress", () => {
  it("returns 0 at the stage's start and ~1 at its end", () => {
    const stage = getActiveStage(0.2);
    expect(getStageProgress(stage.start, stage)).toBe(0);
    expect(getStageProgress(stage.end, stage)).toBe(1);
  });

  it("returns 0.5 at the stage's midpoint", () => {
    const stage = getActiveStage(0.2);
    const mid = (stage.start + stage.end) / 2;
    expect(getStageProgress(mid, stage)).toBeCloseTo(0.5);
  });
});

describe("getProductStageSlice", () => {
  it("divides the products stage evenly across 4 products", () => {
    const productsStage = STAGES.find((s) => s.id === "products")!;
    const quarter = productsStage.start + (productsStage.end - productsStage.start) * 0.125;
    const { index, localProgress } = getProductStageSlice(quarter, 4);
    expect(index).toBe(0);
    expect(localProgress).toBeCloseTo(0.5, 1);
  });

  it("returns the last index at the very end of the products stage", () => {
    const productsStage = STAGES.find((s) => s.id === "products")!;
    const { index } = getProductStageSlice(productsStage.end - 0.001, 4);
    expect(index).toBe(3);
  });

  it("returns index -1 when there are no products", () => {
    const productsStage = STAGES.find((s) => s.id === "products")!;
    const { index } = getProductStageSlice(productsStage.start, 0);
    expect(index).toBe(-1);
  });

  // Out-of-stage progress is clamped, not rejected: -1 signals "no products" only.
  it("clamps to the first slice for progress before the products stage", () => {
    expect(getProductStageSlice(0.1, 4)).toEqual({ index: 0, localProgress: 0 });
    expect(getProductStageSlice(0, 4)).toEqual({ index: 0, localProgress: 0 });
  });

  it("clamps to the last slice for progress past the products stage", () => {
    expect(getProductStageSlice(0.95, 4)).toEqual({ index: 3, localProgress: 1 });
    expect(getProductStageSlice(1, 4)).toEqual({ index: 3, localProgress: 1 });
  });

  it("returns index -1 even when progress is outside the products stage", () => {
    expect(getProductStageSlice(0.1, 0).index).toBe(-1);
    expect(getProductStageSlice(0.95, 0).index).toBe(-1);
  });
});
