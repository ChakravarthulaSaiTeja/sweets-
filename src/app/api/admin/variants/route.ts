/**
 * Admin Variants API Route
 * POST /api/admin/variants - Create new variant
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

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
    const { productId, name, price, weight, inventoryQty, packSize, sku } = body;

    // Validation
    if (!productId || !name || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: productId, name, price" },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: "Price must be >= 0" },
        { status: 400 }
      );
    }

    if (inventoryQty !== undefined && inventoryQty < 0) {
      return NextResponse.json(
        { error: "Inventory quantity must be >= 0" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Generate SKU if not provided
    const variantSku = sku || `SKU-${productId}-${Date.now()}`;

    // Check if SKU already exists
    const existingVariant = await prisma.variant.findUnique({
      where: { sku: variantSku },
    });

    if (existingVariant) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }

    // Create variant
    const variant = await prisma.variant.create({
      data: {
        productId,
        name,
        price: Number(price),
        sku: variantSku,
        inventoryQty: inventoryQty !== undefined ? Number(inventoryQty) : 0,
        weight: weight || null,
        packSize: packSize || null,
        isActive: true,
      },
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error("Error creating variant:", error);
    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 }
    );
  }
}

