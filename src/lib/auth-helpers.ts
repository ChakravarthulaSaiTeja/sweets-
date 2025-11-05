/**
 * Auth Helpers
 * 
 * Helper functions for checking authentication in API routes
 * Works with NextAuth
 */

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Get current user session in API routes
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

