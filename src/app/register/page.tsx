"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold text-bark">Create an account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-espresso">Name</label>
          <input
            required
            value={form.name}
            onChange={handleChange("name")}
            className="w-full rounded border border-line px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-espresso">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            className="w-full rounded border border-line px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-espresso">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange("password")}
            className="w-full rounded border border-line px-3 py-2"
          />
          <p className="mt-1 text-xs text-espresso/60">At least 8 characters.</p>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-bark px-5 py-3 text-sm font-medium text-cream hover:bg-espresso disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-espresso/70">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
