/**
 * Order Detail API Route
 * GET /api/orders/[orderId] - Get order details
 * PUT /api/orders/[orderId] - Update order status (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAuth } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { orderId } = await params;
    const user = await getCurrentUser();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized (owner or admin)
    if (user && (user.id === order.userId || (user as { role?: string }).role === "ADMIN")) {
      return NextResponse.json(order);
    }

    // For guest orders, allow access via phone number match
    if (!user && order.addressPhone) {
      const searchParams = request.nextUrl.searchParams;
      const phone = searchParams.get("phone");
      if (phone && phone.replace(/\D/g, "") === (order.addressPhone || "").replace(/\D/g, "")) {
        return NextResponse.json(order);
      }
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await requireAuth();
    
    // Check if user is admin
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { orderId } = await params;
    const body = await request.json();
    const { status, paymentStatus } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updateData: {
      status?: string;
      paymentStatus?: string;
    } = {};

    if (status) {
      const validStatuses = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ["PENDING", "PAID", "FAILED"];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      updateData.paymentStatus = paymentStatus;
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

