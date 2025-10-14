import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { couponCode, orderValue } = await request.json();

    if (!couponCode) {
      return NextResponse.json(
        { success: false, error: "Coupon code is required" },
        { status: 400 },
      );
    }

    const now = new Date();

    // Check if it's a promotion coupon
    const promotion = await prisma.promotion.findFirst({
      where: {
        couponCode: couponCode,
        active: true,
        startAt: { lte: now },
        endAt: { gte: now },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (promotion) {
      // Check usage limits
      const usageCount = await prisma.promotionUsage.count({
        where: {
          promotionId: promotion.id,
        },
      });

      if (promotion.maxUses && usageCount >= promotion.maxUses) {
        return NextResponse.json(
          { success: false, error: "Promotion usage limit exceeded" },
          { status: 400 },
        );
      }

      // Check minimum order value
      if (promotion.minOrder && orderValue < promotion.minOrder) {
        return NextResponse.json(
          {
            success: false,
            error: `Minimum order value of ₹${promotion.minOrder} required`,
          },
          { status: 400 },
        );
      }

      let discountAmount = 0;
      if (promotion.type === "PERCENTAGE") {
        discountAmount = (orderValue * Number(promotion.value)) / 100;
      } else if (promotion.type === "FIXED") {
        discountAmount = Number(promotion.value);
      }

      return NextResponse.json({
        success: true,
        promotion: {
          id: promotion.id,
          name: promotion.name,
          type: promotion.type,
          value: promotion.value,
          discountAmount,
          minOrder: promotion.minOrder,
          combinable: promotion.combinable,
          expiresAt: promotion.endAt,
          usesLeft: promotion.maxUses ? promotion.maxUses - usageCount : null,
        },
      });
    }

    // Check if it's a regular coupon
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode,
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired coupon code" },
        { status: 400 },
      );
    }

    // Check usage limits
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: "Coupon usage limit exceeded" },
        { status: 400 },
      );
    }

    // Check minimum order value
    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order value of ₹${coupon.minOrderValue} required`,
        },
        { status: 400 },
      );
    }

    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = (orderValue * Number(coupon.value)) / 100;
      if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
        discountAmount = Number(coupon.maxDiscount);
      }
    } else if (coupon.type === "FIXED") {
      discountAmount = Number(coupon.value);
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
        minOrderValue: coupon.minOrderValue,
        maxDiscount: coupon.maxDiscount,
        expiresAt: coupon.validUntil,
        usesLeft: coupon.usageLimit
          ? coupon.usageLimit - coupon.usedCount
          : null,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate coupon" },
      { status: 500 },
    );
  }
}
