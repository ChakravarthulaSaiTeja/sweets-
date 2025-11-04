/**
 * Product/Category Page (Server Component)
 * 
 * Handles both category pages and individual product pages.
 * Determines if the slug is a category or product and renders accordingly.
 * Generates static pages for all products and categories at build time.
 */

import { getAllProducts, getAllCategories, getProductBySlug } from "@/lib/static-data";
import ProductDetailClient from "./product-detail-client";
import CategoryPageClient from "./category-page-client";
import Link from "next/link";

/**
 * Generates static params for all products and categories at build time
 * Required for static export with dynamic routes
 */
export async function generateStaticParams() {
  const products = getAllProducts();
  const categories = getAllCategories();
  
  // Combine product slugs and category slugs
  const productParams = products.map((product: { slug: string }) => ({
    slug: product.slug,
  }));
  
  const categoryParams = categories.map((category: { slug: string }) => ({
    slug: category.slug,
  }));
  
  return [...productParams, ...categoryParams];
}

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

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  
  // First check if it's a product
  const product = getProductBySlug(slug);
  if (product) {
    return <ProductDetailClient slug={slug} />;
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
