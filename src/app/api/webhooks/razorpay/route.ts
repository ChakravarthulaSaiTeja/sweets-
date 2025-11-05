/**
 * Razorpay Webhook Handler
 * POST /api/webhooks/razorpay - Handle Razorpay webhook events
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    const text = JSON.stringify(body);
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const event = body.event;
    const payload = body.payload;

    // Handle payment events
    if (event === "payment.captured" || event === "payment.authorized") {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      const order = await prisma.order.findFirst({
        where: {
          razorpayOrderId: orderId,
        },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            razorpayPaymentId: paymentEntity.id,
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },
        });
      }
    } else if (event === "payment.failed") {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;

      const order = await prisma.order.findFirst({
        where: {
          razorpayOrderId: orderId,
        },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "FAILED",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

