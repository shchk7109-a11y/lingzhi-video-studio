"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Upload, Image as ImageIcon } from "lucide-react";

const ASSET_TYPES = [
  { key: "all",      label: "全部" },
  { key: "product",  label: "产品素材" },
  { key: "avatar",   label: "数字形象" },
  { key: "expert",   label: "专家素材" },
  { key: "audio",    label: "背景音乐" },
  { key: "template", label: "片段模板" },
];

export default function LibraryPage() {
  const [activeType, setActiveType] = useState("all");

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">素材中台</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">管理品牌素材资产，供视频制作引用</p>
        </div>
        <Button>
          <Upload size={14} />
          上传素材
        </Button>
      </div>

      {/* 专家素材合规提示 */}
      <div className="flex items-center gap-3 px-4 py-3 bg-amber-950/20 border border-amber-700/30 rounded-xl mb-5">
        <span className="text-amber-400">⚠</span>
        <p className="text-sm text-amber-300/80">专家出镜素材上传前请确认已完成打码处理，平台不提供自动打码功能</p>
      </div>

      {/* 类型筛选 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {ASSET_TYPES.map(t => (
          <Tag
            key={t.key}
            label={t.label}
            active={activeType === t.key}
            onClick={() => setActiveType(t.key)}
          />
        ))}
      </div>

      {/* 空状态 */}
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <ImageIcon size={40} className="text-[var(--text-dim)]" />
        <p className="text-[var(--text-muted)]">暂无素材，点击「上传素材」添加</p>
        <p className="text-xs text-[var(--text-dim)]">支持图片、视频、音频格式，单文件不超过 500MB</p>
      </div>
    </div>
  );
}
