"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageSeed: string;
  stock: number;
};

export default function AddToCartForm({ productId, slug, name, priceCents, imageSeed, stock }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (stock === 0) {
    return <p className="text-clay">Out of stock</p>;
  }

  function handleAdd() {
    addItem({ productId, slug, name, priceCents, imageSeed }, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="rounded border border-line px-2 py-2 text-sm"
        aria-label="Quantity"
      >
        {Array.from({ length: Math.min(stock, 10) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        className="rounded bg-bark px-5 py-2 text-sm font-medium text-cream hover:bg-espresso"
      >
        {justAdded ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
