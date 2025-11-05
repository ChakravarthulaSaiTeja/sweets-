/**
 * Products API Route
 * GET /api/products - List all products with optional filters
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build where clause
    const where: {
      isVisible?: boolean;
      isActive?: boolean;
      category?: { slug: string };
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
      isFeatured?: boolean;
      isBestSeller?: boolean;
    } = {
      isVisible: true,
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (bestSeller === "true") {
      where.isBestSeller = true;
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

