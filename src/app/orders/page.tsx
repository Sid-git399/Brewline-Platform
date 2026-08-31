import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  // Middleware already guarantees a session here, but we defend in depth:
  // never trust that upstream checks were applied, and always scope the
  // query to the authenticated user so no one can view another user's orders.
  if (!session?.user?.id) {
    return <p className="text-espresso/70">Please sign in to view your orders.</p>;
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold text-bark">Your orders</h1>
        <p className="text-espresso/70">You haven&apos;t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-bark">Your orders</h1>
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order.id} className="rounded-md border border-line p-4">
            <div className="mb-3 flex items-center justify-between text-sm text-espresso/70">
              <span>Order #{order.id.slice(-8)}</span>
              <span>{order.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-line pt-3 font-medium text-bark">
              <span>Shipped to {order.shippingCity}</span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
