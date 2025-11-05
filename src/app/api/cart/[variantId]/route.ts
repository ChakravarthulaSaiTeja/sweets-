/**
 * Cart Item API Route
 * PUT /api/cart/[variantId] - Update cart item quantity
 * DELETE /api/cart/[variantId] - Remove item from cart
 * 
 * REQUIRES AUTHENTICATION
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{
    variantId: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!user.id) {
      console.error("User ID is missing from session. User may need to sign out and sign in again.");
      return NextResponse.json(
        { error: "Session error - Please sign out and sign in again" },
        { status: 401 }
      );
    }

    const { variantId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Check if cart item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_variantId: {
          userId: user.id,
          variantId: variantId,
        },
      },
      include: {
        variant: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Check inventory availability
    if (cartItem.variant.inventoryQty < quantity) {
      return NextResponse.json(
        { error: `Insufficient inventory. Only ${cartItem.variant.inventoryQty} units available` },
        { status: 400 }
      );
    }

    // Update quantity
    const updated = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: {
        variant: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      id: updated.id,
      variantId: updated.variantId,
      quantity: updated.quantity,
      product: {
        id: updated.variant.product.id,
        name: updated.variant.product.name,
        price: updated.variant.price,
        images: updated.variant.product.images,
        slug: updated.variant.product.slug,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { variantId } = await params;

    // Check if cart item exists
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_variantId: {
          userId: user.id,
          variantId: variantId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}

