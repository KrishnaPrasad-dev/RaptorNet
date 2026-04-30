"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Failed to reset password.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05070b] text-white">
      <div className="w-full max-w-md p-8 rounded-xl border border-white/15 bg-[linear-gradient(145deg,rgba(12,16,24,0.56),rgba(8,10,16,0.62))] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Set New Password</h2>
        {success ? (
          <p className="text-green-400 text-center">Password reset! Redirecting to login...</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">New Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]"
                placeholder="Enter new password"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Confirm Password</span>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]"
                placeholder="Confirm new password"
              />
            </label>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full h-12 rounded-xl bg-[#ff3f3f] text-white font-semibold hover:bg-[#ff5a5a] transition">Reset Password</button>
          </form>
        )}
      </div>
    </main>
  );
}
