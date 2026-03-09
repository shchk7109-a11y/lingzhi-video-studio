"use client";

import { useState } from "react";
import { SceneState, useVideoStore } from "@/store/videoStore";
import { Button } from "@/components/ui/Button";
import { FormGroup } from "@/components/ui/FormGroup";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Image as ImageIcon, RefreshCw, Loader2 } from "lucide-react";

interface SceneDetailPanelProps {
  scene: SceneState;
}

export function SceneDetailPanel({ scene }: SceneDetailPanelProps) {
  const { updateScene } = useVideoStore();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenImage() {
    if (!scene.id) return;
    setError(null);
    setGenerating(true);
    updateScene(scene.sceneNo, { imageStatus: "generating" });

    try {
      const res = await fetch("/api/studio/scene-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneId: scene.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "图片生成失败");

      updateScene(scene.sceneNo, { imageUrl: data.imageUrl, imageStatus: "done" });
    } catch (err: any) {
      setError(err.message);
      updateScene(scene.sceneNo, { imageStatus: "failed" });
    } finally {
      setGenerating(false);
    }
  }

  function handleFieldChange(field: keyof SceneState, value: string) {
    updateScene(scene.sceneNo, { [field]: value } as Partial<SceneState>);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--gold)]">场景 {scene.sceneNo}</span>
          <span className="text-xs text-[var(--text-muted)]">{scene.duration}s · {scene.shotType}</span>
        </div>
        <StatusBadge status={scene.imageStatus} />
      </div>

      {/* 分镜图 */}
      <div className="aspect-video bg-[var(--bg-hover)] rounded-xl overflow-hidden border border-[var(--border)] relative">
        {scene.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={scene.imageUrl} alt={`场景${scene.sceneNo}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            {generating ? (
              <>
                <Loader2 size={32} className="text-[var(--gold)] animate-spin" />
                <span className="text-sm text-[var(--text-muted)]">AI 生成分镜图中...</span>
              </>
            ) : (
              <>
                <ImageIcon size={32} className="text-[var(--text-dim)]" />
                <span className="text-sm text-[var(--text-dim)]">暂无分镜图</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 生成按钮 */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleGenImage}
          loading={generating}
          disabled={generating}
          className="flex-1"
        >
          <RefreshCw size={14} />
          {scene.imageUrl ? "重新生成分镜图" : "生成分镜图"}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/30 border border-red-700/40 rounded-lg">
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* 可编辑字段 */}
      <div className="space-y-3">
        <FormGroup label="画面描述">
          <textarea
            rows={2}
            value={scene.visualDesc}
            onChange={(e) => handleFieldChange("visualDesc", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
          />
        </FormGroup>

        <FormGroup label="旁白文案">
          <textarea
            rows={3}
            value={scene.voiceover}
            onChange={(e) => handleFieldChange("voiceover", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
          />
        </FormGroup>

        <FormGroup label="字幕文案">
          <input
            type="text"
            value={scene.subtitle}
            onChange={(e) => handleFieldChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-colors"
          />
        </FormGroup>

        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="音乐氛围">
            <select
              value={scene.musicMood}
              onChange={(e) => handleFieldChange("musicMood", e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-colors"
            >
              {["平静", "活力", "温暖", "神秘", "专业"].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="出镜角色">
            <select
              value={scene.avatarRole}
              onChange={(e) => handleFieldChange("avatarRole", e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-colors"
            >
              {["专家顾问", "店员顾问", "用户客户"].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </FormGroup>
        </div>

        <FormGroup label="图片生成提示词">
          <textarea
            rows={3}
            value={scene.imagePrompt}
            onChange={(e) => handleFieldChange("imagePrompt", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] font-mono focus:outline-none focus:border-[var(--gold)] transition-colors resize-none"
          />
        </FormGroup>
      </div>
    </div>
  );
}
