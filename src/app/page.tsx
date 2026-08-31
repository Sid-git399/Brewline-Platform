import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-16">
      <section className="border-b border-line pb-12 pt-4">
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-bark">
          Coffee gear for people who care how it tastes.
        </h1>
        <p className="mt-4 max-w-md text-espresso/80">
          Carefully sourced beans and brewing equipment, chosen for people who want a
          better cup at home — not more gadgets on the counter.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded bg-bark px-5 py-3 text-sm font-medium text-cream hover:bg-espresso"
        >
          Shop all products
        </Link>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-bark">Featured</h2>
          <Link href="/shop" className="text-sm text-espresso hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
