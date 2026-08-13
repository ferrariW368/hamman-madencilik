export type StageId = "mountain" | "approach" | "company" | "products" | "contact";

export type Stage = {
  id: StageId;
  start: number;
  end: number;
};

export const STAGES: Stage[] = [
  { id: "mountain", start: 0, end: 0.15 },
  { id: "approach", start: 0.15, end: 0.3 },
  { id: "company", start: 0.3, end: 0.45 },
  { id: "products", start: 0.45, end: 0.85 },
  { id: "contact", start: 0.85, end: 1 },
];

export function getActiveStage(progress: number): Stage {
  const clamped = Math.min(1, Math.max(0, progress));
  const found = STAGES.find((s) => clamped >= s.start && clamped < s.end);
  return found ?? STAGES[STAGES.length - 1];
}

export function getStageProgress(progress: number, stage: Stage): number {
  const span = stage.end - stage.start;
  if (span <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(1, Math.max(0, (clamped - stage.start) / span));
}

// `index` is only meaningful once the caller has confirmed getActiveStage(progress).id === "products";
// outside that stage progress is clamped, and index -1 means "no products", not "not in the products stage".
export function getProductStageSlice(
  progress: number,
  productCount: number
): { index: number; localProgress: number } {
  const productsStage = STAGES.find((s) => s.id === "products")!;
  const within = getStageProgress(progress, productsStage);
  if (productCount <= 0) return { index: -1, localProgress: 0 };
  const slice = 1 / productCount;
  const index = Math.min(productCount - 1, Math.floor(within / slice));
  const localProgress = Math.min(1, Math.max(0, (within - index * slice) / slice));
  return { index, localProgress };
}
