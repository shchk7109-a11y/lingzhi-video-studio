"use client";

import { SceneState } from "@/store/videoStore";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Video } from "lucide-react";

interface SceneCardProps {
  scene: SceneState;
  active?: boolean;
  onClick?: () => void;
}

export function SceneCard({ scene, active, onClick }: SceneCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-xl border transition-all duration-150",
        active
          ? "border-[var(--gold)] bg-[var(--gold-dim)]"
          : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-light)] hover:bg-[var(--bg-hover)]"
      )}
    >
      {/* Scene image thumbnail */}
      <div className="w-full aspect-video rounded-lg overflow-hidden mb-2 bg-[var(--bg-hover)]">
        {scene.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={scene.imageUrl} alt={`场景${scene.sceneNo}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={24} className="text-[var(--text-dim)]" />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-semibold", active ? "text-[var(--gold)]" : "text-[var(--text-muted)]")}>
              S{scene.sceneNo}
            </span>
            <span className="text-xs text-[var(--text-dim)]">{scene.duration}s</span>
            <span className="text-xs text-[var(--text-dim)]">{scene.shotType}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] truncate">{scene.visualDesc}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StatusBadge status={scene.imageStatus} />
          {scene.videoStatus !== "pending" && (
            <div className="flex items-center gap-1">
              <Video size={10} className="text-[var(--text-dim)]" />
              <StatusBadge status={scene.videoStatus} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
