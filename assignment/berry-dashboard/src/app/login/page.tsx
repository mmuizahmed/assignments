"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import BerryLogo from "@/components/layout/BerryLogo";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not log in");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-berry p-4 text-berry-text">
      <form onSubmit={submit} className="flex w-full max-w-[400px] flex-col gap-4 rounded-[8px] bg-berry-card p-8">
        <div className="mb-2 flex justify-center">
          <BerryLogo />
        </div>
        <h1 className="text-center text-[20px] font-bold text-berry-heading">Admin Login</h1>
        {message ? <p className="text-[14px] text-berry-error">{message}</p> : null}
        <input
          required
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-[8px] border border-berry-divider bg-berry-canvas px-3 text-[14px] text-berry-text outline-none"
        />
        <input
          required
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 rounded-[8px] border border-berry-divider bg-berry-canvas px-3 text-[14px] text-berry-text outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-[8px] bg-berry-secondary px-4 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
