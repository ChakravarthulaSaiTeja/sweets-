"use client";

/**
 * Providers Component
 * 
 * Root provider component that wraps the application with necessary context providers.
 * Includes:
 * - SessionProvider: NextAuth session management
 * - CartProvider: Manages shopping cart state and operations
 */

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  );
}
