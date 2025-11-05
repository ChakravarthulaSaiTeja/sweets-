/**
 * Orders API Route
 * POST /api/orders - Create new order
 * GET /api/orders - Get user's orders (requires authentication)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      addressName,
      addressPhone,
      addressStreet,
      addressCity,
      addressState,
      addressPincode,
      deliveryDate,
      deliverySlot,
      paymentMethod,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      notes,
    } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!addressName || !addressPhone || !addressStreet || !addressCity || !addressState || !addressPincode) {
      return NextResponse.json(
        { error: "All address fields are required" },
        { status: 400 }
      );
    }

    // Get user if authenticated
    const user = await getCurrentUser();

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Validate inventory and create order items
    const orderItems = [];
    for (const item of items) {
      // Handle both cart item format (with variantId) and direct format
      const variantId = item.variantId || item.id;
      const quantity = item.quantity || 1;

      const variant = await prisma.variant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant || !variant.isActive || !variant.product.isActive || !variant.product.isVisible) {
        return NextResponse.json(
          { error: `Variant ${variantId} not available` },
          { status: 400 }
        );
      }

      if (variant.inventoryQty < quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for ${variant.product.name}. Only ${variant.inventoryQty} units available.` },
          { status: 400 }
        );
      }

      orderItems.push({
        variantId: variant.id,
        productId: variant.productId,
        quantity: quantity,
        price: Number(variant.price),
      });
    }

    // Use a transaction to ensure atomicity: create order and deduct inventory together
    const order = await prisma.$transaction(async (tx) => {
      // First, verify inventory is still sufficient and deduct atomically
      for (const item of orderItems) {
        const variant = await tx.variant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant || variant.inventoryQty < item.quantity) {
          throw new Error(
            `Insufficient inventory for variant ${item.variantId}. Available: ${variant?.inventoryQty || 0}, Required: ${item.quantity}`
          );
        }

        // Atomically decrement inventory
        await tx.variant.update({
          where: { id: item.variantId },
          data: {
            inventoryQty: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Create order with order items
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id || null,
          status: "PENDING",
          paymentStatus: "PENDING", // All orders start as PENDING, will be updated when payment is confirmed
          paymentMethod: paymentMethod || "COD",
          addressName,
          addressPhone: (addressPhone || "").replace(/\D/g, ""), // Normalize phone number
          addressStreet,
          addressCity,
          addressState,
          addressPincode,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          deliverySlot: deliverySlot || null,
          subtotal: Number(subtotal),
          taxAmount: Number(taxAmount || 0),
          shippingAmount: Number(shippingAmount || 0),
          discountAmount: Number(discountAmount || 0),
          totalAmount: Number(totalAmount),
          notes: notes || null,
          orderItems: {
            create: orderItems.map((item) => ({
              variantId: item.variantId,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: {
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
          },
        },
      });

      // Clear user's cart if authenticated (within transaction)
      if (user) {
        await tx.cartItem.deleteMany({
          where: { userId: user.id },
        });
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    
    // Handle inventory-related errors with more specific messages
    if (error instanceof Error && error.message.includes("Insufficient inventory")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

