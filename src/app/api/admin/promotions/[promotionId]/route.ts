/**
 * Admin Promotion Detail API Route
 * PUT /api/admin/promotions/[promotionId] - Update promotion
 * DELETE /api/admin/promotions/[promotionId] - Delete promotion
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{
    promotionId: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { promotionId } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.code !== undefined) updateData.code = body.code;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.value !== undefined) updateData.value = Number(body.value);
    if (body.minOrderValue !== undefined) updateData.minOrderValue = body.minOrderValue ? Number(body.minOrderValue) : null;
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount ? Number(body.maxDiscount) : null;
    if (body.active !== undefined) updateData.active = body.active;
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    const promotion = await prisma.promotion.update({
      where: { id: promotionId },
      data: updateData,
    });

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { promotionId } = await params;

    await prisma.promotion.delete({
      where: { id: promotionId },
    });

    return NextResponse.json({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}

