"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagProps {
  label: string;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tag({ label, onRemove, active, onClick, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border transition-colors",
        active
          ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold-dim)]"
          : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-light)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="hover:text-[var(--text)] transition-colors">
          <X size={10} />
        </button>
      )}
    </span>
  );
}
