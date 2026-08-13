"use client";

type IntroCanvasProps = {
  progress: number;
};

export function IntroCanvas({ progress }: IntroCanvasProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-stone-ink)] text-[color:var(--color-stone-cream)]">
      <p className="font-mono text-xs">progress: {progress.toFixed(2)}</p>
    </div>
  );
}
