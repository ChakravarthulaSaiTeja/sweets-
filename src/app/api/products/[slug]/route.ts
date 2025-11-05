/**
 * Product Detail API Route
 * GET /api/products/[slug] - Get single product by slug with variants
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
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          where: {
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
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

