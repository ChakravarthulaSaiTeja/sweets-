/**
 * Cart API Route
 * GET /api/cart - Get user's cart
 * POST /api/cart - Add item to cart
 * 
 * REQUIRES AUTHENTICATION
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to view your cart" },
        { status: 401 }
      );
    }

    // Get user's cart items with product and variant details
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: user.id,
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform to match frontend cart structure
    const formattedCartItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.variant.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        price: item.variant.price,
        images: item.variant.product.images,
        slug: item.variant.product.slug,
      },
      variant: {
        id: item.variant.id,
        name: item.variant.name,
        price: item.variant.price,
        sku: item.variant.sku,
        inventoryQty: item.variant.inventoryQty,
      },
    }));

    return NextResponse.json({ items: formattedCartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to add items to cart" },
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

    const body = await request.json();
    const { variantId, quantity } = body;

    if (!variantId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid request - variantId and quantity (>=1) required" },
        { status: 400 }
      );
    }

    // Check if variant exists and is available
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            slug: true,
            isActive: true,
            isVisible: true,
          },
        },
      },
    });

    if (!variant || !variant.isActive || !variant.product.isActive || !variant.product.isVisible) {
      return NextResponse.json(
        { error: "Product variant not found or not available" },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_variantId: {
          userId: user.id,
          variantId: variantId,
        },
      },
    });

    // Calculate total quantity that will be in cart
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    // Check inventory availability (must be sufficient for total quantity in cart)
    if (variant.inventoryQty < totalQuantity) {
      return NextResponse.json(
        { error: `Insufficient inventory. Only ${variant.inventoryQty} units available. You already have ${existingItem?.quantity || 0} in your cart.` },
        { status: 400 }
      );
    }

    let cartItem;
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: totalQuantity,
        },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          variantId: variantId,
          quantity: quantity,
        },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // Return formatted cart item
    const formattedItem = {
      id: cartItem.id,
      productId: cartItem.variant.productId,
      variantId: cartItem.variantId,
      quantity: cartItem.quantity,
      product: {
        id: cartItem.variant.product.id,
        name: cartItem.variant.product.name,
        price: cartItem.variant.price,
        images: cartItem.variant.product.images,
        slug: cartItem.variant.product.slug,
      },
      variant: {
        id: cartItem.variant.id,
        name: cartItem.variant.name,
        price: cartItem.variant.price,
        sku: cartItem.variant.sku,
        inventoryQty: cartItem.variant.inventoryQty,
      },
    };

    return NextResponse.json(formattedItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

