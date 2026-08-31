"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

type ProductCardProduct = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageSeed: string;
  stock: number;
};

export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      imageSeed: product.imageSeed,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
      <Link href={`/products/${product.slug}`}>
        <img
          src={`https://picsum.photos/seed/${product.imageSeed}/500/500`}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`} className="font-medium text-bark hover:underline">
          {product.name}
        </Link>
        <p className="text-sm text-espresso/70">{formatPrice(product.priceCents)}</p>
        {product.stock === 0 ? (
          <p className="mt-auto text-sm text-clay">Out of stock</p>
        ) : (
          <button
            onClick={handleAdd}
            className="mt-auto rounded border border-bark px-3 py-2 text-sm font-medium text-bark transition hover:bg-bark hover:text-cream"
          >
            {justAdded ? "Added ✓" : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}
