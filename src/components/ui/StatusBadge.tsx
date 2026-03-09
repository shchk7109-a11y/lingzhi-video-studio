"use client";

import { cn } from "@/lib/utils";

type Status = "pending" | "generating" | "done" | "failed" | "draft" | "script_done" | "images_done" | "video_done" | "published";

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending:     { label: "待处理", className: "text-[var(--text-muted)] border-[var(--border)]" },
  generating:  { label: "生成中", className: "text-[var(--gold)] border-[var(--gold)] animate-pulse" },
  done:        { label: "完成", className: "text-[var(--green-light)] border-[var(--green)]" },
  failed:      { label: "失败", className: "text-[var(--red)] border-[var(--red)]" },
  draft:       { label: "草稿", className: "text-[var(--text-muted)] border-[var(--border)]" },
  script_done: { label: "脚本完成", className: "text-[var(--gold)] border-[var(--gold)]" },
  images_done: { label: "图片完成", className: "text-[var(--green-light)] border-[var(--green)]" },
  video_done:  { label: "视频完成", className: "text-blue-400 border-blue-600" },
  published:   { label: "已发布", className: "text-[var(--green-light)] border-[var(--green)] bg-[var(--green)]/10" },
};

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as Status] || { label: status, className: "text-[var(--text-muted)] border-[var(--border)]" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 text-xs border rounded-full", config.className, className)}>
      {config.label}
    </span>
  );
}
