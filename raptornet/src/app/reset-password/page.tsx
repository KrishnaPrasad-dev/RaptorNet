"use client";

import { useState } from "react";

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Failed to send reset email.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#05070b] text-white">
      <div className="w-full max-w-md p-8 rounded-xl border border-white/15 bg-[linear-gradient(145deg,rgba(12,16,24,0.56),rgba(8,10,16,0.62))] shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        {submitted ? (
          <p className="text-green-400 text-center">If your email is registered, a reset link has been sent.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-white/20 bg-black/35 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff4a4a]"
                placeholder="you@example.com"
              />
            </label>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full h-12 rounded-xl bg-[#ff3f3f] text-white font-semibold hover:bg-[#ff5a5a] transition">Send Reset Link</button>
          </form>
        )}
      </div>
    </main>
  );
}
