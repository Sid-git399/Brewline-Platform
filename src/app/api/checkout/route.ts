import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in to check out." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { shippingName, shippingLine1, shippingCity, shippingZip, items } = parsed.data;

  // Never trust prices from the client. Look up each product server-side and
  // build the order from the current database values.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productsById = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productsById.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "One of the items in your cart no longer exists." },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Not enough stock for "${product.name}". Only ${product.stock} left.` },
        { status: 409 }
      );
    }
  }

  const totalCents = items.reduce((sum, item) => {
    const product = productsById.get(item.productId)!;
    return sum + product.priceCents * item.quantity;
  }, 0);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: session.user.id,
          totalCents,
          shippingName,
          shippingLine1,
          shippingCity,
          shippingZip,
          items: {
            create: items.map((item) => {
              const product = productsById.get(item.productId)!;
              return {
                productId: product.id,
                quantity: item.quantity,
                unitPriceCents: product.priceCents,
              };
            }),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error("Checkout failed:", err);
    return NextResponse.json(
      { error: "Something went wrong processing your order. Please try again." },
      { status: 500 }
    );
  }
}
