/**
 * Clear Cart API Route
 * DELETE /api/cart/clear - Clear all items from user's cart
 * 
 * REQUIRES AUTHENTICATION
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete all cart items for user
    await prisma.cartItem.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}

