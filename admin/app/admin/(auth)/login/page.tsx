"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/app/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post<{ token: string }>("/api/auth/login", { email, password });
      setToken(data.token);
      router.replace("/admin/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-white text-2xl font-semibold tracking-widest uppercase">Lex & David</h1>
          <p className="text-white/40 text-sm mt-1">Admin Login</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition text-sm" placeholder="admin@lexdavid.com" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition text-sm" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="mt-2 px-4 py-3 rounded bg-white text-black text-sm font-semibold tracking-wider uppercase hover:bg-white/90 transition disabled:opacity-50">
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
