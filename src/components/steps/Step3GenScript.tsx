"use client";

import { useState } from "react";
import { useVideoStore, SceneState } from "@/store/videoStore";
import { Button } from "@/components/ui/Button";
import { GenProgress } from "@/components/ui/GenProgress";
import { Sparkles, RefreshCw } from "lucide-react";

export function Step3GenScript() {
  const { form, setProject, setStep, setGenerating, setGenProgress, setGenStage, generating, genProgress, genStage } = useVideoStore();
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    setGenProgress(10);
    setGenStage("正在连接 AI 模型...");

    try {
      setGenProgress(30);
      setGenStage("AI 正在分析产品信息...");

      const res = await fetch("/api/studio/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId: "demo-user", // TODO: replace with real auth
        }),
      });

      setGenProgress(80);
      setGenStage("正在解析脚本结构...");

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "脚本生成失败");
      }

      const data = await res.json();
      setGenProgress(100);
      setGenStage("脚本生成完成！");

      const scenes: SceneState[] = data.project.scenes.map((s: any) => ({
        id:          s.id,
        sceneNo:     s.sceneNo,
        duration:    s.duration,
        shotType:    s.shotType,
        visualDesc:  s.visualDesc,
        imagePrompt: s.imagePrompt,
        voiceover:   s.voiceover,
        subtitle:    s.subtitle,
        musicMood:   s.musicMood || "平静",
        avatarRole:  s.avatarRole || "专家顾问",
        imageStatus: "pending" as const,
        videoStatus: "pending" as const,
      }));

      setProject(data.project.id, data.project.title, scenes);

      setTimeout(() => {
        setGenerating(false);
        setStep(4);
      }, 600);
    } catch (err: any) {
      setError(err.message);
      setGenerating(false);
      setGenProgress(0);
      setGenStage("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)] mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          AI 脚本生成
        </h2>
        <p className="text-sm text-[var(--text-muted)]">基于参数自动生成分场景脚本，包含旁白、字幕与画面描述</p>
      </div>

      {/* 参数预览 */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-medium text-[var(--text-muted)]">生成参数确认</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--text-dim)]">视频类型：</span>
            <span className="text-[var(--text)]">{
              { kobo: "口播类", fangtan: "访谈类", xianchang: "现场类", qingjing: "情景类" }[form.videoType!] || form.videoType
            }</span>
          </div>
          <div>
            <span className="text-[var(--text-dim)]">产品名称：</span>
            <span className="text-[var(--text)]">{form.productName}</span>
          </div>
          <div>
            <span className="text-[var(--text-dim)]">目标体质：</span>
            <span className="text-[var(--text)]">{form.constitutions.join("、") || "通用"}</span>
          </div>
          <div>
            <span className="text-[var(--text-dim)]">视频用途：</span>
            <span className="text-[var(--text)]">{form.purpose}</span>
          </div>
          {form.solarTerm && (
            <div>
              <span className="text-[var(--text-dim)]">关联节气：</span>
              <span className="text-[var(--text)]">{form.solarTerm}</span>
            </div>
          )}
          {form.targetAudience && (
            <div className="col-span-2">
              <span className="text-[var(--text-dim)]">目标人群：</span>
              <span className="text-[var(--text)]">{form.targetAudience}</span>
            </div>
          )}
          {form.customNotes && (
            <div className="col-span-2">
              <span className="text-[var(--text-dim)]">补充说明：</span>
              <span className="text-[var(--text)]">{form.customNotes}</span>
            </div>
          )}
        </div>
      </div>

      {/* 合规提示 */}
      <div className="flex items-start gap-3 p-4 bg-amber-950/30 border border-amber-700/40 rounded-xl">
        <span className="text-amber-400 text-lg">⚠</span>
        <div className="text-sm">
          <p className="text-amber-300 font-medium mb-1">合规提醒</p>
          <p className="text-amber-200/70">AI 已内置合规过滤规则，会自动替换「治疗/治愈/根治」等违禁词。生成后请人工复核旁白文案。</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-700/40 rounded-xl">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep(2)} disabled={generating}>返回</Button>
        <div className="flex gap-2">
          {error && (
            <Button variant="secondary" onClick={handleGenerate} loading={generating}>
              <RefreshCw size={14} />
              重试
            </Button>
          )}
          <Button onClick={handleGenerate} loading={generating} size="lg">
            <Sparkles size={16} />
            {generating ? "生成中..." : "AI 生成脚本"}
          </Button>
        </div>
      </div>

      <GenProgress progress={genProgress} stage={genStage} visible={generating} />
    </div>
  );
}
