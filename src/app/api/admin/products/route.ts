/**
 * Admin Products API Route
 * GET /api/admin/products - Get all products (including inactive/invisible)
 * POST /api/admin/products - Create new product
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();
    
    if ((user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            sku: true,
            inventoryQty: true,
            weight: true,
            packSize: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
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
      name,
      slug,
      description,
      shortDescription,
      price,
      originalPrice,
      images,
      categoryId,
      isVisible,
      isActive,
      isFeatured,
      isBestSeller,
      metaTitle,
      metaDescription,
      variants,
    } = body;

    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { error: "Name, slug, and category are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create product with variants
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        shortDescription: shortDescription || null,
        price: Number(price) || 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        images: images || [],
        categoryId,
        isVisible: isVisible !== undefined ? isVisible : true,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        isBestSeller: isBestSeller || false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        variants: {
          create: (variants || []).map((v: any) => ({
            name: v.name,
            price: Number(v.price),
            sku: v.sku,
            inventoryQty: Number(v.inventoryQty) || 0,
            weight: v.weight || null,
            packSize: v.packSize || null,
            isActive: v.isActive !== undefined ? v.isActive : true,
          })),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

