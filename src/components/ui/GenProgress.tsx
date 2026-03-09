"use client";

interface GenProgressProps {
  progress: number;
  stage: string;
  visible: boolean;
}

export function GenProgress({ progress, stage, visible }: GenProgressProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl px-6 py-4 min-w-[340px]">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" />
        <span className="text-sm text-[var(--text)]">{stage}</span>
        <span className="ml-auto text-sm text-[var(--gold)] font-medium">{progress}%</span>
      </div>
      <div className="h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--green) 0%, var(--gold) 100%)",
          }}
        />
      </div>
    </div>
  );
}
