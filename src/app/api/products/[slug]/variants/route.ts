/**
 * Product Variants API Route
 * GET /api/products/[slug]/variants - Get variants for a specific product
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
        isVisible: true,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const variants = await prisma.variant.findMany({
      where: {
        productId: product.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        sku: true,
        inventoryQty: true,
        weight: true,
        packSize: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json(
      { error: "Failed to fetch variants" },
      { status: 500 }
    );
  }
}

