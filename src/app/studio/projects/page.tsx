"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Plus, Loader2, Video, FileText } from "lucide-react";

interface Project {
  id: string;
  title: string;
  videoType: string;
  productName: string;
  status: string;
  createdAt: string;
  _count: { scenes: number };
  creator: { name: string };
}

const VIDEO_TYPE_LABELS: Record<string, string> = {
  kobo: "口播", fangtan: "访谈", xianchang: "现场", qingjing: "情景",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/studio/projects")
      .then(r => r.json())
      .then(data => setProjects(data.projects || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">项目列表</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">管理所有视频制作项目</p>
        </div>
        <Link href="/studio/create">
          <Button>
            <Plus size={14} />
            新建视频
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-[var(--gold)] animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Video size={40} className="text-[var(--text-dim)]" />
          <p className="text-[var(--text-muted)]">还没有项目，点击「新建视频」开始</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--border-light)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-hover)] flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-[var(--text-muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-[var(--text)]">{project.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-dim)]">
                    {VIDEO_TYPE_LABELS[project.videoType] || project.videoType}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span>{project.productName}</span>
                  <span>·</span>
                  <span>{project._count.scenes} 场景</span>
                  <span>·</span>
                  <span>{project.creator.name}</span>
                  <span>·</span>
                  <span>{new Date(project.createdAt).toLocaleDateString("zh-CN")}</span>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
