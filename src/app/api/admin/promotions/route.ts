/**
 * Admin Promotions API Route
 * GET /api/admin/promotions - Get all promotions
 * POST /api/admin/promotions - Create new promotion
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const promotions = await prisma.promotion.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      active,
      expiresAt,
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { error: "Code, type, and value are required" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingPromotion = await prisma.promotion.findUnique({
      where: { code },
    });

    if (existingPromotion) {
      return NextResponse.json(
        { error: "Promotion code already exists" },
        { status: 400 }
      );
    }

    const promotion = await prisma.promotion.create({
      data: {
        code,
        type,
        value: Number(value),
        minOrderValue: minOrderValue ? Number(minOrderValue) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        active: active !== undefined ? active : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    );
  }
}

