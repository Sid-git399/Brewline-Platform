import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

const CATEGORIES = ["Beans", "Brewers", "Grinders", "Accessories"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category;

  const products = await prisma.product.findMany({
    where: activeCategory ? { category: activeCategory } : undefined,
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-bark">Shop</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full border px-3 py-1 text-sm ${
            !activeCategory
              ? "border-bark bg-bark text-cream"
              : "border-line text-espresso hover:border-espresso"
          }`}
        >
          All
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/shop?category=${encodeURIComponent(category)}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              activeCategory === category
                ? "border-bark bg-bark text-cream"
                : "border-line text-espresso hover:border-espresso"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-espresso/70">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
