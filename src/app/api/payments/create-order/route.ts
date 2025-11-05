/**
 * Razorpay Order Creation API Route
 * POST /api/payments/create-order - Create Razorpay order for payment
 */

import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get order from database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized
    const user = await getCurrentUser();
    if (user && order.userId && user.id !== order.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    // Update order with Razorpay order ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}

