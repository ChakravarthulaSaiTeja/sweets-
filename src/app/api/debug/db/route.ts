/**
 * Database Debug API Route
 * 
 * This route verifies that Vercel is correctly connecting to Neon Postgres.
 * Access at: /api/debug/db
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Perform a simple database query to verify connection
    const productCount = await prisma.product.count();
    
    return NextResponse.json({
      db: "connected",
      products: productCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Debug DB] Database connection error:", error);
    
    return NextResponse.json(
      {
        db: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

