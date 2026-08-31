"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { data: session, status } = useSession();
  const { totalItems } = useCart();

  return (
    <header className="border-b border-line bg-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-bark">
          Brewline
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/shop" className="text-espresso hover:text-bark">
            Shop
          </Link>
          <Link href="/cart" className="text-espresso hover:text-bark">
            Cart{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>

          {status === "loading" ? null : session ? (
            <>
              <Link href="/orders" className="text-espresso hover:text-bark">
                Orders
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-espresso hover:text-bark"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-espresso hover:text-bark">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
