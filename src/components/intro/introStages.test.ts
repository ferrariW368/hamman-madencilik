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
});
