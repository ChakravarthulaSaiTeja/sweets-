/**
 * Admin Variant Detail API Route
 * PUT /api/admin/variants/[id] - Update variant
 * DELETE /api/admin/variants/[id] - Delete variant
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{
    id: string;
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

    const { id } = await params;
    const body = await request.json();

    // Validation
    if (body.price !== undefined && body.price < 0) {
      return NextResponse.json(
        { error: "Price must be >= 0" },
        { status: 400 }
      );
    }

    if (body.inventoryQty !== undefined && body.inventoryQty < 0) {
      return NextResponse.json(
        { error: "Inventory quantity must be >= 0" },
        { status: 400 }
      );
    }

    // Check if variant exists
    const existingVariant = await prisma.variant.findUnique({
      where: { id },
    });

    if (!existingVariant) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.inventoryQty !== undefined) updateData.inventoryQty = Number(body.inventoryQty);
    if (body.weight !== undefined) updateData.weight = body.weight || null;
    if (body.packSize !== undefined) updateData.packSize = body.packSize || null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    // Update variant
    const variant = await prisma.variant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error("Error updating variant:", error);
    return NextResponse.json(
      { error: "Failed to update variant" },
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

    const { id } = await params;

    // Check if variant exists
    const existingVariant = await prisma.variant.findUnique({
      where: { id },
    });

    if (!existingVariant) {
      return NextResponse.json(
        { error: "Variant not found" },
        { status: 404 }
      );
    }

    // Delete variant (hard delete - variants can be safely deleted as cart items will be cleaned up)
    await prisma.variant.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Variant deleted successfully" });
  } catch (error) {
    console.error("Error deleting variant:", error);
    return NextResponse.json(
      { error: "Failed to delete variant" },
      { status: 500 }
    );
  }
}

