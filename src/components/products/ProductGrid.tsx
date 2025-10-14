"use client";

import Image from "next/image";
import { ShoppingCart, Heart } from "lucide-react";
import { formatPrice } from "@/utils";
import { useCart } from "@/contexts/cart-context";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  inventoryQty: number;
  brand?: string;
  category?: {
    name: string;
    slug: string;
  };
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  const getDiscountPercentage = (
    originalPrice: number,
    currentPrice: number,
  ) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1);
      // You could add a toast notification here if you want
      console.log(`Added ${productName} to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const hasDiscount =
          product.originalPrice && product.originalPrice > product.price;
        const discountPercentage = hasDiscount
          ? getDiscountPercentage(product.originalPrice!, product.price)
          : 0;

        return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <button
                onClick={() => product.inventoryQty > 0 && handleAddToCart(product.id, product.name)}
                disabled={product.inventoryQty === 0}
                className={`w-full h-full ${product.inventoryQty === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <Image
                  src={product.images[0] || "/images/placeholder-product.svg"}
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-300 ${
                    product.inventoryQty > 0 ? 'group-hover:scale-105' : ''
                  }`}
                />
              </button>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isBestSeller && (
                  <span className="bg-[#7B1E2D] text-white text-xs font-medium px-2 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-[#C79A2A] text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => product.inventoryQty > 0 && handleAddToCart(product.id, product.name)}
                  disabled={product.inventoryQty === 0}
                  className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-colors ${
                    product.inventoryQty > 0 ? 'hover:bg-white' : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Category */}
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                {product.category?.name || "Product"}
              </div>

              {/* Product Name */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Description */}
              {product.shortDescription && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-[#7B1E2D]">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {product.inventoryQty > 0 ? (
                    <span className="text-green-600">In Stock</span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => product.inventoryQty > 0 && handleAddToCart(product.id, product.name)}
                  disabled={product.inventoryQty === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.inventoryQty > 0
                      ? "bg-[#7B1E2D] text-white hover:bg-[#C79A2A] hover:text-[#7B1E2D]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {product.inventoryQty > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
