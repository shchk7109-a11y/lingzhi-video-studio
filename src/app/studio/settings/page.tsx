"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormGroup } from "@/components/ui/FormGroup";
import { Save, RefreshCw } from "lucide-react";

interface ConfigItem {
  key: string;
  label: string;
  value: string;
  placeholder: string;
  hint: string;
}

const DEFAULT_CONFIGS: ConfigItem[] = [
  {
    key: "script_model",
    label: "脚本生成模型",
    value: "gemini-3.1-flash",
    placeholder: "gemini-3.1-flash",
    hint: "通过谷高中转，用于生成视频脚本",
  },
  {
    key: "image_model_default",
    label: "图片生成模型（默认）",
    value: "gemini-3.1-flash-image-preview",
    placeholder: "gemini-3.1-flash-image-preview",
    hint: "用于生成分镜图，通过谷高 Nano Banana 中转",
  },
  {
    key: "image_model_pro",
    label: "图片生成模型（高质量）",
    value: "gemini-3-pro-image-preview",
    placeholder: "gemini-3-pro-image-preview",
    hint: "高质量分镜图，费用更高",
  },
  {
    key: "image_model_fast",
    label: "图片生成模型（快速）",
    value: "imagen-4.0-fast-generate-001",
    placeholder: "imagen-4.0-fast-generate-001",
    hint: "快速生成，适合批量预览",
  },
  {
    key: "video_model",
    label: "视频生成模型",
    value: "kling-v1",
    placeholder: "kling-v1",
    hint: "可灵 API 图生视频模型名称",
  },
];

export default function SettingsPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>(DEFAULT_CONFIGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateConfig(key: string, value: string) {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Save each config to the API
      await Promise.all(
        configs.map(c =>
          fetch("/api/studio/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: c.key, value: c.value }),
          })
        )
      );
      setSaved(true);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-8 py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--text)]">模型配置</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          动态配置 AI 模型，修改后立即生效，无需重启服务
        </p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-5">
        {configs.map(config => (
          <FormGroup key={config.key} label={config.label} hint={config.hint}>
            <input
              type="text"
              value={config.value}
              onChange={(e) => updateConfig(config.key, e.target.value)}
              placeholder={config.placeholder}
              className="w-full px-3 py-2 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] font-mono placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)] transition-colors"
            />
          </FormGroup>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <Button onClick={handleSave} loading={saving} size="lg">
          <Save size={14} />
          {saving ? "保存中..." : "保存配置"}
        </Button>
        {saved && (
          <span className="text-sm text-[var(--green-light)] flex items-center gap-1.5">
            <RefreshCw size={12} />
            配置已保存，立即生效
          </span>
        )}
      </div>

      <div className="mt-8 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-3">API 连接信息</h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex gap-2">
            <span className="text-[var(--text-dim)] w-32">谷高中转地址</span>
            <span className="text-[var(--text-muted)]">{process.env.GUHIGH_BASE_URL || "未配置"}</span>
          </div>
        </div>
        <p className="text-xs text-[var(--text-dim)] mt-3">API 密钥配置请修改 .env.local 文件</p>
      </div>
    </div>
  );
}
