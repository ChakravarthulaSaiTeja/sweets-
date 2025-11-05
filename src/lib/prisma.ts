/**
 * Prisma Client Singleton
 * 
 * This file creates a single instance of Prisma Client that is reused across the application.
 * 
 * Why Singleton Pattern?
 * - In development, Next.js hot-reload can create multiple Prisma Client instances
 * - Multiple instances can cause connection pool exhaustion
 * - Singleton ensures only one instance exists
 * 
 * How It Works:
 * 1. Check if Prisma Client already exists in global scope (development only)
 * 2. If exists, reuse it
 * 3. If not, create a new instance
 * 4. Store in global scope for development hot-reload
 * 
 * Database Connection:
 * - Uses DATABASE_URL environment variable
 * - Connects to PostgreSQL database (Neon in production)
 * - Logs connection info (with masked credentials for security)
 * 
 * Logging:
 * - Development: Logs all queries, errors, and warnings (useful for debugging)
 * - Production: Only logs errors (reduces noise in logs)
 */

import { PrismaClient } from "@prisma/client";

// Type definition for global Prisma instance
// In development, we store Prisma Client in global scope to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Log database connection for deployment verification
// This helps verify that Vercel is connecting to the correct database
// Credentials are masked for security (password and database name hidden)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  // Mask sensitive information in connection string
  // Example: "postgresql://user:password@host/db" becomes "postgresql://user:***@host/***"
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@').replace(/\/[^?]+/, '/***');
  console.log(`[Prisma] Connecting to database: ${maskedUrl}`);
}

/**
 * Prisma Client Instance
 * 
 * This is the main database client that all API routes use to query the database.
 * 
 * Usage Example:
 * ```typescript
 * import { prisma } from "@/lib/prisma";
 * 
 * // Get all products
 * const products = await prisma.product.findMany();
 * 
 * // Create a new product
 * const product = await prisma.product.create({
 *   data: { name: "Gulab Jamun", price: 280 }
 * });
 * ```
 */
export const prisma =
  // Check if Prisma Client already exists (development hot-reload scenario)
  globalForPrisma.prisma ??
  // If not, create a new Prisma Client instance
  new PrismaClient({
    // Configure logging based on environment
    // Development: Log everything (queries, errors, warnings) for debugging
    // Production: Only log errors to reduce log noise
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// In development, store Prisma Client in global scope
// This prevents creating multiple instances during hot-reload
// In production, this is not needed (no hot-reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

