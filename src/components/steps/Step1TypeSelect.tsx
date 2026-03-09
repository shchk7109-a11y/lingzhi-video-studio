"use client";

import { useVideoStore, VideoType } from "@/store/videoStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Mic, Users, Camera, Theater } from "lucide-react";

const VIDEO_TYPES: {
  type: VideoType;
  icon: React.ElementType;
  label: string;
  desc: string;
  duration: string;
  tags: string[];
}[] = [
  {
    type: "kobo",
    icon: Mic,
    label: "口播类",
    desc: "主播/讲师直接面对镜头讲解，适合产品培训与知识传递",
    duration: "60-90秒",
    tags: ["培训讲解", "产品介绍"],
  },
  {
    type: "fangtan",
    icon: Users,
    label: "访谈类",
    desc: "专家或店员接受采访形式，专业背书，科普宣传效果好",
    duration: "90-180秒",
    tags: ["科普宣传", "专家背书"],
  },
  {
    type: "xianchang",
    icon: Camera,
    label: "现场类",
    desc: "真实制作/服务场景记录，展示产品工艺与品质细节",
    duration: "60-120秒",
    tags: ["制作展示", "工艺记录"],
  },
  {
    type: "qingjing",
    icon: Theater,
    label: "情景类",
    desc: "角色扮演情景剧，生动呈现使用场景与体质调理过程",
    duration: "90-150秒",
    tags: ["场景培训", "情景剧"],
  },
];

export function Step1TypeSelect() {
  const { form, setForm, setStep } = useVideoStore();

  function handleSelect(type: VideoType) {
    setForm({ videoType: type });
  }

  function handleNext() {
    if (form.videoType) setStep(2);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text)] mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          选择视频类型
        </h2>
        <p className="text-sm text-[var(--text-muted)]">选择最适合本次内容需求的视频形式</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VIDEO_TYPES.map(({ type, icon: Icon, label, desc, duration, tags }) => {
          const selected = form.videoType === type;
          return (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className={cn(
                "text-left p-5 rounded-xl border transition-all duration-200",
                selected
                  ? "border-[var(--gold)] bg-[var(--gold-dim)]"
                  : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-light)] hover:bg-[var(--bg-hover)]"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  selected ? "bg-[var(--gold)]/20 text-[var(--gold)]" : "bg-[var(--bg-hover)] text-[var(--text-muted)]"
                )}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("font-semibold", selected ? "text-[var(--gold)]" : "text-[var(--text)]")}>
                      {label}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                      {duration}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-2">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-dim)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!form.videoType} size="lg">
          下一步：填写参数
        </Button>
      </div>
    </div>
  );
}
