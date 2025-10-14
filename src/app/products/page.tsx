import { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "All Products - Kotaiah's Sweets & Foods",
  description: "Browse our complete collection of authentic Indian sweets, snacks, pickles, spice powders, and gift boxes.",
};

async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
    });

    // Define the desired category order
    const categoryOrder = ['sweets', 'hot-snacks', 'pickles', 'powders', 'gift-boxes'];
    
    // Sort products by category order, then by featured/best seller status
    const sortedProducts = products.sort((a, b) => {
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

    return sortedProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
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

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  const serializedProducts = serializeProducts(products);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              All Products
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover our complete collection of authentic Indian sweets, snacks, 
              pickles, spice powders, and beautifully curated gift boxes.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{products.length} Products Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>{categories.length} Categories</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Fresh Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Browse by Category
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="group p-4 bg-gray-50 hover:bg-[#7B1E2D] hover:text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-white group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-lg font-bold text-[#7B1E2D] group-hover:text-white">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-white">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-white/80 mt-1">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            All Products ({products.length})
          </h2>
          <div className="text-sm text-gray-500">
            Showing all available products
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          {serializedProducts.length > 0 ? (
            <ProductGrid products={serializedProducts} />
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
              <p className="text-gray-500 mb-6">
                We're working on adding more products to our collection.
              </p>
              <Link
                href="/"
                className="btn-primary inline-flex items-center group"
              >
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
