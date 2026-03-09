"use client";

import { cn } from "@/lib/utils";

interface FormGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({ label, required, hint, children, className }: FormGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-[var(--text)]">
        {label}
        {required && <span className="text-[var(--gold)] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
