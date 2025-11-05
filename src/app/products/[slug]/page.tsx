/**
 * Product/Category Page (Server Component)
 * 
 * Handles both category pages and individual product pages.
 * Determines if the slug is a category or product and renders accordingly.
 */

import ProductDetailClient from "./product-detail-client";
import CategoryPageClient from "./category-page-client";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

const categoryMap: Record<
  string,
  { name: string; description: string; slug: string }
> = {
  sweets: {
    name: "Traditional Sweets",
    description:
      "Discover our collection of authentic Indian sweets made with traditional recipes and premium ingredients.",
    slug: "sweets",
  },
  "hot-snacks": {
    name: "Hot Snacks & Savories",
    description:
      "Crispy, flavorful snacks perfect for any time of day. From samosas to pakoras, we have it all.",
    slug: "hot-snacks",
  },
  pickles: {
    name: "Pickles & Preserves",
    description:
      "Tangy, spicy pickles made with fresh ingredients and traditional methods.",
    slug: "pickles",
  },
  powders: {
    name: "Spice Powders & Mixes",
    description: "Authentic spice blends and powders to enhance your cooking.",
    slug: "powders",
  },
  "gift-boxes": {
    name: "Gift Boxes",
    description:
      "Beautifully curated gift boxes perfect for special occasions and festivals.",
    slug: "gift-boxes",
  },
};

interface SlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Generate dynamic metadata for product pages
 */
export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // Fetch product from database
    const product = await prisma.product.findUnique({
      where: {
        slug,
        isVisible: true,
        isActive: true,
      },
      select: {
        name: true,
        description: true,
        images: true,
        metaTitle: true,
        metaDescription: true,
      },
    });

    if (product) {
      const title = product.metaTitle || `${product.name} | Kotaiah Foods`;
      const description = product.metaDescription || product.description;
      const imageUrl = product.images && product.images.length > 0 ? product.images[0] : undefined;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          images: imageUrl ? [{ url: imageUrl }] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching product for metadata:", error);
  }

  // Default metadata if not a product
  return {
    title: "Kotaiah Foods",
    description: "Traditional Indian sweets and foods",
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  
  // First check if it's a product by querying database
  try {
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
    
    if (product) {
      return <ProductDetailClient product={product} />;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
  
  // Then check if it's a category
  const categoryInfo = categoryMap[slug];
  if (categoryInfo) {
    return <CategoryPageClient slug={slug} />;
  }
  
  // Not found - neither product nor category
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#8B1A1A] mb-4">
          Page Not Found
        </h1>
        <p className="text-[#8B1A1A] mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="bg-[#8B1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#D4AF37] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
