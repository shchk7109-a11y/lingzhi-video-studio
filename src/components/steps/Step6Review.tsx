"use client";

import { useState } from "react";
import { useVideoStore } from "@/store/videoStore";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CheckCircle, Send, RotateCcw } from "lucide-react";

export function Step6Review() {
  const { projectId, projectTitle, scenes, reset, setStep } = useVideoStore();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doneImages = scenes.filter(s => s.imageStatus === "done").length;
  const doneVideos = scenes.filter(s => s.videoStatus === "done").length;

  async function handlePublish() {
    if (!projectId) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "发布失败");
      }
      setPublished(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  }

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="w-20 h-20 rounded-full bg-[var(--green)]/20 flex items-center justify-center">
          <CheckCircle size={40} className="text-[var(--green-light)]" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            项目已发布
          </h2>
          <p className="text-sm text-[var(--text-muted)]">「{projectTitle}」已成功标记为已发布状态</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setStep(1)}>
            查看项目
          </Button>
          <Button onClick={reset}>
            <RotateCcw size={14} />
            新建视频
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)] mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          审核与发布
        </h2>
        <p className="text-sm text-[var(--text-muted)]">确认内容后标记项目为已发布</p>
      </div>

      {/* 项目摘要 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text)]">{projectTitle}</h3>
          <StatusBadge status="video_done" />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[var(--bg-hover)] rounded-lg">
            <div className="text-2xl font-semibold text-[var(--text)]">{scenes.length}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">总场景数</div>
          </div>
          <div className="p-3 bg-[var(--bg-hover)] rounded-lg">
            <div className="text-2xl font-semibold text-[var(--green-light)]">{doneImages}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">分镜图完成</div>
          </div>
          <div className="p-3 bg-[var(--bg-hover)] rounded-lg">
            <div className="text-2xl font-semibold text-[var(--gold)]">{doneVideos}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">视频片段完成</div>
          </div>
        </div>
      </div>

      {/* 场景列表预览 */}
      <div className="space-y-2">
        {scenes.map(scene => (
          <div key={scene.sceneNo} className="flex items-center gap-3 p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <span className="text-xs font-semibold text-[var(--text-muted)] w-8">S{scene.sceneNo}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text)] truncate">{scene.subtitle}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{scene.voiceover}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <StatusBadge status={scene.imageStatus} />
              <StatusBadge status={scene.videoStatus} />
            </div>
          </div>
        ))}
      </div>

      {/* 合规最终确认 */}
      <div className="p-4 bg-amber-950/20 border border-amber-700/30 rounded-xl">
        <p className="text-sm text-amber-300/80">
          发布前请确认：①所有旁白已人工复核合规词 ②专家出镜素材已打码 ③产品名称与实际一致
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-950/30 border border-red-700/40 rounded-xl">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep(5)}>返回</Button>
        <Button onClick={handlePublish} loading={publishing} size="lg">
          <Send size={16} />
          确认发布
        </Button>
      </div>
    </div>
  );
}
