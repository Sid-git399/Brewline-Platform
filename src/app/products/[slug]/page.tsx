import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import AddToCartForm from "@/components/AddToCartForm";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <img
        src={`https://picsum.photos/seed/${product.imageSeed}/700/700`}
        alt={product.name}
        className="w-full rounded-md border border-line object-cover"
      />
      <div>
        <p className="text-sm uppercase tracking-wide text-clay">{product.category}</p>
        <h1 className="mt-1 text-2xl font-semibold text-bark">{product.name}</h1>
        <p className="mt-3 text-lg text-espresso">{formatPrice(product.priceCents)}</p>
        <p className="mt-4 text-espresso/80">{product.description}</p>
        <p className="mt-2 text-sm text-espresso/60">
          {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
        </p>
        <div className="mt-6">
          <AddToCartForm
            productId={product.id}
            slug={product.slug}
            name={product.name}
            priceCents={product.priceCents}
            imageSeed={product.imageSeed}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}
