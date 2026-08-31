"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    shippingName: "",
    shippingLine1: "",
    shippingCity: "",
    shippingZip: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return <p className="text-espresso/70">Your cart is empty. Add something before checking out.</p>;
  }

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      clearCart();
      router.push("/orders");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <h1 className="mb-6 text-2xl font-semibold text-bark">Checkout</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">Full name</label>
            <input
              required
              value={form.shippingName}
              onChange={handleChange("shippingName")}
              className="w-full rounded border border-line px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-espresso">Address</label>
            <input
              required
              value={form.shippingLine1}
              onChange={handleChange("shippingLine1")}
              className="w-full rounded border border-line px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">City</label>
              <input
                required
                value={form.shippingCity}
                onChange={handleChange("shippingCity")}
                className="w-full rounded border border-line px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-espresso">Postal code</label>
              <input
                required
                value={form.shippingZip}
                onChange={handleChange("shippingZip")}
                className="w-full rounded border border-line px-3 py-2"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded bg-bark px-5 py-3 text-sm font-medium text-cream hover:bg-espresso disabled:opacity-60"
          >
            {isSubmitting ? "Placing order…" : `Place order — ${formatPrice(totalCents)}`}
          </button>
          <p className="text-xs text-espresso/60">
            This is a demo store — no real payment is processed.
          </p>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-bark">Order summary</h2>
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-3 text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatPrice(item.priceCents * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between font-semibold text-bark">
          <span>Total</span>
          <span>{formatPrice(totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
