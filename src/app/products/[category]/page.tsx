import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryHeader } from "@/components/products/CategoryHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
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

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = categoryMap[category];

  if (!categoryInfo) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${categoryInfo.name} - Kotaiah's Sweets & Foods`,
    description: categoryInfo.description,
  };
}

async function getCategoryProducts(categorySlug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        products: {
          where: { isActive: true },
          orderBy: [
            { isFeatured: "desc" },
            { isBestSeller: "desc" },
            { createdAt: "desc" },
          ],
          take: 20,
        },
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category products:", error);
    return null;
  }
}

// Serialize Decimal values to numbers for client components
function serializeProducts(products: any[]) {
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    taxPercent: Number(product.taxPercent),
    brand: product.brand || "Kotaiah's Sweets", // Default brand
    category: {
      name: product.category?.name || "Product",
      slug: product.category?.slug || "product",
    },
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryInfo = categoryMap[category];

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The category you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="bg-[#7B1E2D] text-white px-6 py-3 rounded-lg hover:bg-[#C79A2A] transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const categoryData = await getCategoryProducts(categoryInfo.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <CategoryHeader
        name={categoryInfo.name}
        description={categoryInfo.description}
        productCount={categoryData?.products.length || 0}
      />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          {categoryData?.products && categoryData.products.length > 0 ? (
            <ProductGrid products={serializeProducts(categoryData.products)} />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                We're working on adding more products to this category.
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
