import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brewline — Specialty Coffee Gear",
  description: "Whole bean coffee, pour-over brewers, grinders, and accessories.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
