import { cn } from "@/lib/cn";

export function Container({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={cn("mx-auto w-full max-w-[var(--container-content)] px-[var(--space-page)]", className)}>{children}</div>;
}
