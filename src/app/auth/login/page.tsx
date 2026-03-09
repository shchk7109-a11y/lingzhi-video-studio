"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("邮箱或密码不正确");
    } else {
      router.push("/studio");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--green)] flex items-center justify-center">
            <Leaf size={28} className="text-[var(--gold)]" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[var(--text)]">灵芝水铺</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">视频制作系统</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8">
          <h2 className="text-lg font-medium text-[var(--text)] mb-6">登录账号</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1.5">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/30 border border-red-700/40 rounded-lg">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full justify-center">
              登录
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[var(--text-dim)] mt-6">
          灵芝水铺内部系统 · 仅限授权人员使用
        </p>
      </div>
    </div>
  );
}
