import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zakie — profile-driven generation",
  description:
    "A demo showing that generating from a stored business profile beats generating from a blank prompt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-6">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="text-lg font-semibold tracking-tight">Zakie</span>
              <span className="text-sm text-muted">Business profile demo</span>
            </Link>
            <Link
              href="/status"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Status
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-14">
          {children}
        </main>
        <footer className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-8 py-6 text-sm text-muted">
            Demo only — no accounts, no billing.
          </div>
        </footer>
      </body>
    </html>
  );
}
