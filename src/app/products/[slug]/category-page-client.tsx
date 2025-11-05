"use client";

/**
 * Client-side Category Page
 * Fetches products by category from API
 */

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryHeader } from "@/components/products/CategoryHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";

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

interface CategoryPageClientProps {
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  isVisible: boolean;
}

export default function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryInfo = categoryMap[slug];

  useEffect(() => {
    async function loadProducts() {
      if (!categoryInfo) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/products?category=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [slug, categoryInfo]);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#8B1A1A] mb-4">
            Category Not Found
          </h1>
          <p className="text-[#8B1A1A] mb-8">
            The category you&apos;re looking for doesn&apos;t exist.
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

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      {/* Category Header */}
      <CategoryHeader
        name={categoryInfo.name}
        description={categoryInfo.description}
        productCount={products.length}
      />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
            <div className="text-center py-12">
              <div className="text-[#8B1A1A] mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#8B1A1A] mb-2">
                No products found
              </h3>
              <p className="text-[#8B1A1A]">
                We&apos;re working on adding more products to this category.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
