import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice)
        (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice)
        (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (bestSeller === "true") {
      where.isBestSeller = true;
    }

    // Fetch all products first to apply custom sorting
    const allProducts = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Define the desired category order
    const categoryOrder = ['sweets', 'hot-snacks', 'pickles', 'powders', 'gift-boxes'];
    
    // Apply custom sorting based on sortBy parameter
    let sortedProducts = allProducts;
    
    if (sortBy === "category") {
      // Sort by category order, then by featured/best seller status
      sortedProducts = allProducts.sort((a, b) => {
        const aCategoryIndex = categoryOrder.indexOf(a.category.slug);
        const bCategoryIndex = categoryOrder.indexOf(b.category.slug);
        
        // If both categories are in the defined order, sort by category order
        if (aCategoryIndex !== -1 && bCategoryIndex !== -1) {
          if (aCategoryIndex !== bCategoryIndex) {
            return aCategoryIndex - bCategoryIndex;
          }
        }
        
        // If only one category is in the defined order, prioritize it
        if (aCategoryIndex !== -1 && bCategoryIndex === -1) return -1;
        if (aCategoryIndex === -1 && bCategoryIndex !== -1) return 1;
        
        // If both categories are not in the defined order, sort alphabetically
        if (aCategoryIndex === -1 && bCategoryIndex === -1) {
          return a.category.name.localeCompare(b.category.name);
        }
        
        // Within the same category, sort by featured status, then best seller, then creation date
        if (a.isFeatured !== b.isFeatured) {
          return b.isFeatured ? 1 : -1; // Featured products first
        }
        if (a.isBestSeller !== b.isBestSeller) {
          return b.isBestSeller ? 1 : -1; // Best sellers second
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
      });
    } else if (sortBy === "price") {
      sortedProducts = allProducts.sort((a, b) => {
        const aPrice = parseFloat(a.price.toString());
        const bPrice = parseFloat(b.price.toString());
        return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
      });
    } else if (sortBy === "name") {
      sortedProducts = allProducts.sort((a, b) => {
        return sortOrder === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
    } else if (sortBy === "createdAt") {
      sortedProducts = allProducts.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });
    } else {
      // Default: sort by category order
      sortedProducts = allProducts.sort((a, b) => {
        const aCategoryIndex = categoryOrder.indexOf(a.category.slug);
        const bCategoryIndex = categoryOrder.indexOf(b.category.slug);
        
        if (aCategoryIndex !== -1 && bCategoryIndex !== -1) {
          if (aCategoryIndex !== bCategoryIndex) {
            return aCategoryIndex - bCategoryIndex;
          }
        }
        
        if (aCategoryIndex !== -1 && bCategoryIndex === -1) return -1;
        if (aCategoryIndex === -1 && bCategoryIndex !== -1) return 1;
        
        if (aCategoryIndex === -1 && bCategoryIndex === -1) {
          return a.category.name.localeCompare(b.category.name);
        }
        
        if (a.isFeatured !== b.isFeatured) {
          return b.isFeatured ? 1 : -1;
        }
        if (a.isBestSeller !== b.isBestSeller) {
          return b.isBestSeller ? 1 : -1;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    // Apply pagination
    const total = sortedProducts.length;
    const products = sortedProducts.slice(skip, skip + limit);

    // Calculate average ratings
    const productsWithRatings = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0;

      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
        reviews: undefined, // Remove reviews from response
      };
    });

    return NextResponse.json({
      products: productsWithRatings,
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
      { status: 500 },
    );
  }
}
