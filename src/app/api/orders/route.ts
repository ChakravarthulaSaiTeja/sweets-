/**
 * Orders API Route
 * 
 * This file handles order creation and retrieval operations.
 * 
 * Endpoints:
 * - POST /api/orders - Create a new order from cart items
 * - GET /api/orders - Retrieve all orders for the authenticated user
 * 
 * Order Creation Flow:
 * 1. Validate order data (items, address, payment method)
 * 2. Check inventory availability for all items
 * 3. Generate unique order number
 * 4. Use database transaction to:
 *    - Create order record
 *    - Deduct inventory from variants
 *    - Create order items (linking products to order)
 * 5. Clear user's cart after successful order
 * 6. Return order confirmation
 * 
 * Why Transactions?
 * - Ensures atomicity: either ALL operations succeed or ALL fail
 * - Prevents race conditions: if two users order the last item simultaneously, only one succeeds
 * - Prevents overselling: inventory is checked and deducted in one atomic operation
 * 
 * Authentication:
 * - POST: User can be authenticated OR guest (guest orders stored with userId=null)
 * - GET: Requires authentication (only authenticated users can view their orders)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * POST /api/orders
 * 
 * Creates a new order from cart items.
 * 
 * Steps:
 * 1. Parse and validate request body (items, address, payment info)
 * 2. Get current user (if authenticated)
 * 3. Generate unique order number
 * 4. Validate all items exist and have sufficient inventory
 * 5. Use database transaction to create order and deduct inventory atomically
 * 6. Return order confirmation with order number
 * 
 * Request Body Format:
 * {
 *   items: [{ variantId, quantity, ... }],  // Cart items
 *   addressName: "John Doe",
 *   addressPhone: "1234567890",
 *   addressStreet: "123 Main St",
 *   addressCity: "City",
 *   addressState: "State",
 *   addressPincode: "123456",
 *   deliveryDate: "2024-01-15",
 *   deliverySlot: "Morning",
 *   paymentMethod: "COD",
 *   subtotal: 1000,
 *   taxAmount: 180,
 *   shippingAmount: 50,
 *   discountAmount: 0,
 *   totalAmount: 1230,
 *   notes: "Optional delivery instructions"
 * }
 * 
 * @param request - NextRequest containing order data in body
 * @returns JSON response with created order or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse request body to extract order data
    const body = await request.json();
    const {
      items,              // Array of cart items to order
      addressName,        // Customer's full name
      addressPhone,       // Customer's phone number
      addressStreet,      // Street address
      addressCity,        // City
      addressState,       // State
      addressPincode,     // Postal/ZIP code
      deliveryDate,       // Preferred delivery date
      deliverySlot,       // Delivery time slot (Morning/Evening)
      paymentMethod,      // Payment method (COD/Online)
      subtotal,           // Subtotal before tax/shipping
      taxAmount,          // Tax amount
      shippingAmount,     // Shipping charges
      discountAmount,     // Discount amount (if any)
      totalAmount,        // Final total amount
      notes,              // Optional delivery notes
    } = body;

    // Step 2: Validate required fields
    // Order must have at least one item
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    // All address fields are required for delivery
    if (!addressName || !addressPhone || !addressStreet || !addressCity || !addressState || !addressPincode) {
      return NextResponse.json(
        { error: "All address fields are required" },
        { status: 400 }
      );
    }

    // Step 3: Get current user (if authenticated)
    // Guest orders are allowed (userId will be null)
    const user = await getCurrentUser();

    // Step 4: Generate unique order number
    // Format: ORD-{timestamp}-{random_string}
    // Example: ORD-1704067200000-ABC123XY
    // This ensures each order has a unique identifier
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Step 5: Validate inventory and prepare order items
    // We need to:
    // - Verify each variant exists and is active
    // - Check inventory is sufficient
    // - Prepare order items array for database insertion
    const orderItems: Array<{
      variantId: string;
      productId: string;
      quantity: number;
      price: number;
    }> = [];
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

    // Step 6: Use database transaction to create order and deduct inventory atomically
    // 
    // Why Transaction?
    // - Atomicity: Either ALL operations succeed or ALL fail (no partial orders)
    // - Prevents race conditions: If two users order simultaneously, only one succeeds
    // - Data consistency: Inventory deduction and order creation happen together
    //
    // Example Race Condition Prevention:
    // - User A and User B both try to order the last item
    // - Without transaction: Both might succeed, overselling item
    // - With transaction: Only first transaction succeeds, second fails with "insufficient inventory"
    //
    // Transaction Flow:
    // 1. Verify inventory is still sufficient (might have changed since initial check)
    // 2. Deduct inventory from each variant
    // 3. Create order record
    // 4. Create order items (linking products to order)
    // 5. If any step fails, rollback all changes
    const order = await prisma.$transaction(async (tx) => {
      // Step 6.1: Verify inventory again and deduct atomically
      // We check again because inventory might have changed between initial check and now
      // This is the final check before committing the order
      for (const item of orderItems) {
        // Get current variant state (within transaction)
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

export async function GET(_request: NextRequest) {
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

