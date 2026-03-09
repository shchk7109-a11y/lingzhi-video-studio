"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "选择类型" },
  { n: 2, label: "填写参数" },
  { n: 3, label: "生成脚本" },
  { n: 4, label: "场景分镜" },
  { n: 5, label: "生成视频" },
  { n: 6, label: "审核发布" },
];

interface StepBarProps {
  current: number;
  onStepClick?: (n: number) => void;
}

export function StepBar({ current, onStepClick }: StepBarProps) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = step.n < current;
        const active = step.n === current;
        const clickable = done && onStepClick;

        return (
          <div key={step.n} className="flex items-center">
            <button
              onClick={() => clickable && onStepClick(step.n)}
              disabled={!clickable && !active}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                active  && "text-[var(--gold)]",
                done    && "text-[var(--green-light)] cursor-pointer hover:bg-[var(--bg-hover)]",
                !active && !done && "text-[var(--text-dim)]",
                "disabled:cursor-default"
              )}
            >
              <span className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium flex-shrink-0",
                active && "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]",
                done   && "border-[var(--green)] bg-[var(--green)]/20 text-[var(--green-light)]",
                !active && !done && "border-[var(--border)] text-[var(--text-dim)]"
              )}>
                {done ? <Check size={12} /> : step.n}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                "w-6 h-px mx-1",
                step.n < current ? "bg-[var(--green)]" : "bg-[var(--border)]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
