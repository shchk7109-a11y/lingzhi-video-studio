import { Sidebar } from "@/components/layout/Sidebar";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <main className="ml-60 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
