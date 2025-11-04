"use client";

/**
 * Client-side Products Page
 * Reacts to admin panel changes in real-time
 */

import { Suspense } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";
import { getAllProducts, getAllCategories } from "@/lib/static-data";
import { useAdminData } from "@/hooks/useAdminData";

export default function ProductsPageClient() {
  const products = useAdminData("adminProducts", getAllProducts(), getAllProducts);
  const categories = useAdminData("adminCategories", getAllCategories(), getAllCategories);

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white py-16">
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
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                <span>{products.length} Products Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                <span>{categories.length} Categories</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                <span>Fresh Daily</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-[#fff9e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#8B1A1A] flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Browse by Category
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category: { id: string; name: string; slug: string; description?: string; isActive?: boolean }) => (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="group p-4 bg-[#FFF7EE] hover:bg-[#8B1A1A] hover:text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-white group-hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-lg font-bold text-[#8B1A1A] group-hover:text-white">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-white">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#8B1A1A] group-hover:text-white/80 mt-1">
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
          <h2 className="text-2xl font-bold text-[#8B1A1A]">
            All Products ({products.length})
          </h2>
          <div className="text-sm text-[#8B1A1A]">
            Showing all available products
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          {products.length > 0 ? (
            <ProductGrid products={products.filter((p: { isActive?: boolean; isVisible?: boolean }) => p.isActive !== false && p.isVisible !== false)} />
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
              <p className="text-[#8B1A1A] mb-6">
                We&apos;re working on adding more products to our collection.
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
