"use client";

import { useState, useEffect, useRef } from "react";
import { useVideoStore } from "@/store/videoStore";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Video, Play, Loader2 } from "lucide-react";

interface VideoTask {
  sceneNo: number;
  taskId: string;
  status: "pending" | "generating" | "done" | "failed";
  videoUrl?: string;
}

export function Step5GenVideo() {
  const { scenes, setStep, updateScene } = useVideoStore();
  const [tasks, setTasks] = useState<VideoTask[]>([]);
  const [started, setStarted] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenesWithImages = scenes.filter(s => s.imageUrl && s.imageStatus === "done");

  async function handleStartVideoGen() {
    setStarted(true);
    const newTasks: VideoTask[] = [];

    for (const scene of scenesWithImages) {
      try {
        const res = await fetch("/api/studio/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sceneId: scene.id,
            imageUrl: scene.imageUrl,
            prompt: scene.imagePrompt,
          }),
        });
        const data = await res.json();
        if (data.taskId) {
          newTasks.push({ sceneNo: scene.sceneNo, taskId: data.taskId, status: "generating" });
          updateScene(scene.sceneNo, { videoStatus: "generating" });
        }
      } catch {
        newTasks.push({ sceneNo: scene.sceneNo, taskId: "", status: "failed" });
        updateScene(scene.sceneNo, { videoStatus: "failed" });
      }
    }

    setTasks(newTasks);
    startPolling(newTasks);
  }

  function startPolling(initialTasks: VideoTask[]) {
    pollingRef.current = setInterval(async () => {
      const pending = initialTasks.filter(t => t.status === "generating" && t.taskId);
      if (pending.length === 0) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        return;
      }

      for (const task of pending) {
        try {
          const res = await fetch(`/api/studio/video-status/${task.taskId}`);
          const data = await res.json();
          if (data.status === "completed" && data.videoUrl) {
            setTasks(prev => prev.map(t =>
              t.taskId === task.taskId ? { ...t, status: "done", videoUrl: data.videoUrl } : t
            ));
            const scene = scenes.find(s => s.sceneNo === task.sceneNo);
            if (scene) updateScene(scene.sceneNo, { videoClipUrl: data.videoUrl, videoStatus: "done" });
          } else if (data.status === "failed") {
            setTasks(prev => prev.map(t =>
              t.taskId === task.taskId ? { ...t, status: "failed" } : t
            ));
          }
        } catch {
          // silent fail, retry next poll
        }
      }
    }, 3000);
  }

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const allDone = tasks.length > 0 && tasks.every(t => t.status === "done" || t.status === "failed");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)] mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          生成视频片段
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          基于分镜图生成各场景视频片段（每片段约5秒），异步处理，约需 2-5 分钟
        </p>
      </div>

      {scenesWithImages.length === 0 && (
        <div className="p-5 bg-amber-950/20 border border-amber-700/30 rounded-xl text-center">
          <p className="text-amber-300 text-sm">请先在 Step4 为至少一个场景生成分镜图，才能进行视频生成</p>
        </div>
      )}

      {scenesWithImages.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-sm text-[var(--text-muted)] mb-2">
            <span>共 {scenesWithImages.length} 个场景可生成视频</span>
            {started && <span>{tasks.filter(t => t.status === "done").length} / {tasks.length} 完成</span>}
          </div>

          {scenesWithImages.map(scene => {
            const task = tasks.find(t => t.sceneNo === scene.sceneNo);
            return (
              <div key={scene.sceneNo} className="flex items-center gap-3 p-3 bg-[var(--bg-hover)] rounded-lg">
                <div className="w-16 h-10 rounded overflow-hidden bg-[var(--bg)] flex-shrink-0">
                  {scene.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={scene.imageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)]">场景 {scene.sceneNo}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{scene.visualDesc}</p>
                </div>
                <div className="flex items-center gap-2">
                  {task?.status === "generating" && <Loader2 size={14} className="text-[var(--gold)] animate-spin" />}
                  {task?.status === "done" && task.videoUrl && (
                    <a href={task.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="ghost">
                        <Play size={12} />
                        预览
                      </Button>
                    </a>
                  )}
                  <StatusBadge status={task?.status || scene.videoStatus} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep(4)}>返回</Button>
        <div className="flex gap-2">
          {!started && scenesWithImages.length > 0 && (
            <Button onClick={handleStartVideoGen} size="lg">
              <Video size={16} />
              开始生成视频
            </Button>
          )}
          {(started || scenesWithImages.length === 0) && (
            <Button onClick={() => setStep(6)} size="lg" variant={allDone ? "primary" : "secondary"}>
              {allDone ? "继续：审核发布" : "跳过，直接审核"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
