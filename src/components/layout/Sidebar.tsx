"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Video, FolderOpen, Library, Settings, LogOut, Leaf } from "lucide-react";

const navItems = [
  { href: "/studio/create",   icon: Video,      label: "创建视频" },
  { href: "/studio/projects", icon: FolderOpen,  label: "项目列表" },
  { href: "/studio/library",  icon: Library,     label: "素材中台" },
  { href: "/studio/settings", icon: Settings,    label: "模型配置" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen flex flex-col bg-[var(--bg-card)] border-r border-[var(--border)] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--green)] flex items-center justify-center">
            <Leaf size={16} className="text-[var(--gold)]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text)]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              灵芝水铺
            </div>
            <div className="text-xs text-[var(--text-muted)]">视频制作系统</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                active
                  ? "bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--gold)]/30"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text)]"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[var(--border)]">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--red)] transition-all duration-150">
          <LogOut size={16} />
          退出登录
        </button>
      </div>
    </aside>
  );
}
