/**
 * Order Tracking API Route
 * GET /api/orders/track - Track order by order number or phone number
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");

    if (!orderNumber && !phone) {
      return NextResponse.json(
        { error: "Order number or phone number is required" },
        { status: 400 }
      );
    }

    const where: {
      orderNumber?: string;
      addressPhone?: { contains: string };
    } = {};

    if (orderNumber) {
      where.orderNumber = orderNumber;
    }

    if (phone) {
      // Normalize phone number (strip non-digits) for comparison
      const normalizedPhone = phone.replace(/\D/g, "");
      // Use contains to match even if stored phone has formatting
      where.addressPhone = { contains: normalizedPhone };
    }

    const orders = await prisma.order.findMany({
      where,
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

    // Filter by normalized phone if phone was provided
    let filteredOrders = orders;
    if (phone && !orderNumber) {
      const normalizedPhone = phone.replace(/\D/g, "");
      filteredOrders = orders.filter((order) => 
        order.addressPhone && order.addressPhone.replace(/\D/g, "") === normalizedPhone
      );
    }

    if (filteredOrders.length === 0) {
      return NextResponse.json(
        { error: "No orders found" },
        { status: 404 }
      );
    }

    return NextResponse.json(filteredOrders);
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}

