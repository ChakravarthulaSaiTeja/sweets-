"use client";

/**
 * Conditional Layout Component
 * 
 * Conditionally renders Navigation and Footer only for non-admin routes.
 * Admin routes have their own separate layout without these components.
 */

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Admin routes have their own layout, don't render Navigation/Footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Regular website routes - include Navigation and Footer
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navigation />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

