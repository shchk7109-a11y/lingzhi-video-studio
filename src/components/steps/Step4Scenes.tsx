"use client";

import { useState } from "react";
import { useVideoStore } from "@/store/videoStore";
import { Button } from "@/components/ui/Button";
import { SceneCard } from "@/components/scene/SceneCard";
import { SceneDetailPanel } from "@/components/scene/SceneDetailPanel";
import { Images } from "lucide-react";

export function Step4Scenes() {
  const { scenes, setStep, projectTitle } = useVideoStore();
  const [activeSceneNo, setActiveSceneNo] = useState(scenes[0]?.sceneNo ?? 1);
  const [batchGenerating, setBatchGenerating] = useState(false);

  const activeScene = scenes.find(s => s.sceneNo === activeSceneNo);

  async function handleBatchGenImages() {
    setBatchGenerating(true);
    for (const scene of scenes) {
      if (scene.id && scene.imageStatus !== "done") {
        await fetch("/api/studio/scene-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sceneId: scene.id }),
        }).catch(() => null);
      }
    }
    setBatchGenerating(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-0.5" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            场景分镜
          </h2>
          <p className="text-sm text-[var(--text-muted)]">{projectTitle} · {scenes.length} 个场景</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleBatchGenImages} loading={batchGenerating} size="sm">
            <Images size={14} />
            批量生成分镜图
          </Button>
        </div>
      </div>

      {/* 专家素材合规提示 */}
      <div className="flex items-center gap-3 px-4 py-3 bg-amber-950/20 border border-amber-700/30 rounded-xl">
        <span className="text-amber-400">⚠</span>
        <p className="text-sm text-amber-300/80">提醒：如视频含专家出镜素材，请确认已完成打码处理</p>
      </div>

      {/* 双栏布局 */}
      <div className="grid grid-cols-12 gap-4 min-h-[60vh]">
        {/* 左：场景列表 */}
        <div className="col-span-4 space-y-2 overflow-y-auto max-h-[70vh] pr-1">
          {scenes.map(scene => (
            <SceneCard
              key={scene.sceneNo}
              scene={scene}
              active={scene.sceneNo === activeSceneNo}
              onClick={() => setActiveSceneNo(scene.sceneNo)}
            />
          ))}
        </div>

        {/* 右：场景详情 */}
        <div className="col-span-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 overflow-y-auto max-h-[70vh]">
          {activeScene ? (
            <SceneDetailPanel scene={activeScene} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-[var(--text-muted)]">请选择场景</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep(3)}>返回</Button>
        <Button onClick={() => setStep(5)} size="lg">
          下一步：生成视频
        </Button>
      </div>
    </div>
  );
}
