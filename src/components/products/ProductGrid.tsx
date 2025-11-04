"use client";

/**
 * ProductGrid Component
 * 
 * Displays a responsive grid of product cards with images, pricing, and add-to-cart functionality.
 * Features include discount badges, stock status, and quick action buttons.
 * 
 * @param products - Array of product objects to display in the grid
 */

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/utils";
import { useCart } from "@/contexts/cart-context";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  inventoryQty: number;
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

  /**
   * Calculates the discount percentage between original and current price
   * @param originalPrice - The original price before discount
   * @param currentPrice - The current discounted price
   * @returns The discount percentage rounded to nearest integer
   */
  const getDiscountPercentage = (
    originalPrice: number,
    currentPrice: number,
  ) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  /**
   * Handles adding a product to the shopping cart
   * @param productId - The unique identifier of the product
   * @param productName - The name of the product (for user feedback)
   */
  const handleAddToCart = async (productId: string, productName: string) => {
    try {
      await addToCart(productId, 1);
      // Show success feedback with enhanced styling
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-white">${productName}</p>
            <p class="text-sm text-white/90">Added to cart successfully!</p>
          </div>
        </div>
      `;
      notification.className = 'cart-notification';
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: linear-gradient(135deg, #8B1A1A 0%, #A02020 50%, #8B1A1A 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(139, 26, 26, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.2);
        z-index: 9999;
        min-width: 320px;
        max-width: 90vw;
        animation: cartNotificationSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        backdrop-filter: blur(10px);
      `;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.style.animation = 'cartNotificationSlideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } catch (error) {
      // Error logging is kept for debugging purposes
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
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
              <Link href={`/products/${product.slug}`} className="block w-full h-full">
                <Image
                  src={product.images[0] || "/images/placeholder-product.svg"}
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-300 ${
                    product.inventoryQty > 0 ? 'group-hover:scale-105' : ''
                  }`}
                />
              </Link>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {product.isBestSeller && (
                  <span className="bg-[#8B1A1A] text-white text-xs font-medium px-2 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-[#D4AF37] text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-[#FFB347] text-white text-xs font-medium px-2 py-1 rounded-full">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Quick Actions - Add to Cart Button */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => product.inventoryQty > 0 && handleAddToCart(product.id, product.name)}
                  disabled={product.inventoryQty === 0}
                  className={`p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-colors ${
                    product.inventoryQty > 0 ? 'hover:bg-white' : 'opacity-50 cursor-not-allowed'
                  }`}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="h-4 w-4 text-[#8B1A1A]" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Category */}
              <div className="text-xs text-[#8B1A1A] mb-1 uppercase tracking-wide">
                {product.category?.name || "Product"}
              </div>

              {/* Product Name */}
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-[#8B1A1A] mb-2 line-clamp-2 hover:text-[#D4AF37] transition-colors">
                  {product.name}
                </h3>
              </Link>

              {/* Description */}
              {product.shortDescription && (
                <p className="text-sm text-[#8B1A1A] mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-[#8B1A1A]">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-[#8B1A1A] line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#8B1A1A]">
                  {product.inventoryQty > 0 ? (
                    <span className="text-[#8B1A1A]">In Stock</span>
                  ) : (
                    <span className="text-[#FFB347]">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => product.inventoryQty > 0 && handleAddToCart(product.id, product.name)}
                  disabled={product.inventoryQty === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    product.inventoryQty > 0
                      ? "bg-[#8B1A1A] text-white hover:bg-[#D4AF37] hover:text-[#8B1A1A]"
                      : "bg-[#FFF7EE] text-[#8B1A1A] cursor-not-allowed"
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
