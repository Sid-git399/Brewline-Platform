"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold text-bark">Your cart</h1>
        <p className="text-espresso/70">
          Your cart is empty.{" "}
          <Link href="/shop" className="underline">
            Browse the shop
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-bark">Your cart</h1>

      <div className="flex flex-col divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            <img
              src={`https://picsum.photos/seed/${item.imageSeed}/120/120`}
              alt={item.name}
              className="h-20 w-20 rounded object-cover"
            />
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-medium text-bark hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-espresso/70">{formatPrice(item.priceCents)} each</p>
            </div>
            <select
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="rounded border border-line px-2 py-1 text-sm"
              aria-label={`Quantity for ${item.name}`}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <p className="w-20 text-right text-sm font-medium text-bark">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-clay hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-semibold text-bark">Total: {formatPrice(totalCents)}</p>
        <Link
          href="/checkout"
          className="rounded bg-bark px-5 py-3 text-sm font-medium text-cream hover:bg-espresso"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
