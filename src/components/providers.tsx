"use client";

/**
 * Providers Component
 * 
 * Root provider component that wraps the application with necessary context providers.
 * Currently includes:
 * - CartProvider: Manages shopping cart state and operations
 * 
 * Note: NextAuth SessionProvider was removed due to static export incompatibility
 */

import { CartProvider } from "@/contexts/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>{children}</CartProvider>
  );
}
