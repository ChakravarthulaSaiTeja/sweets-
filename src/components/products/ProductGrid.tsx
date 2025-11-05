"use client";

/**
 * ProductGrid Component
 * 
 * Displays a responsive grid of product cards with images, pricing, and add-to-cart functionality.
 * Features include discount badges, stock status, variant selection dropdown, and quick action buttons.
 * 
 * @param products - Array of product objects to display in the grid
 */

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/utils";
import { useCart } from "@/contexts/cart-context";
import { useState, useEffect } from "react";

interface Variant {
  id: string;
  name: string;
  price: number;
  inventoryQty: number;
  weight: string | null;
}

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
  variants?: Variant[];
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Initialize selected variants on mount
  useEffect(() => {
    const initial: Record<string, string> = {};
    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        initial[product.id] = product.variants[0].id;
      }
    });
    setSelectedVariants(prev => {
      // Only update if there are new products
      const hasChanges = Object.keys(initial).some(id => prev[id] !== initial[id]);
      return hasChanges ? { ...prev, ...initial } : prev;
    });
  }, [products]);

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
   * @param variantId - The unique identifier of the selected variant
   * @param productName - The name of the product (for user feedback)
   */
  const handleAddToCart = async (productId: string, variantId: string | null, productName: string) => {
    if (!variantId) {
      alert("Please select a weight/quantity option");
      return;
    }

    try {
      await addToCart(variantId, 1);
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
        // Get variants or use fallback
        let variants = product.variants && product.variants.length > 0 
          ? product.variants 
          : [{ id: product.id, name: "Default", price: product.price, inventoryQty: product.inventoryQty, weight: null }];
        
        // Sort variants by weight/quantity in ascending order
        variants = [...variants].sort((a, b) => {
          // Extract numeric value from weight/name (e.g., "500g" -> 500, "1kg" -> 1000)
          const getWeightValue = (text: string | null): number => {
            if (!text) return 0;
            const match = text.match(/(\d+(?:\.\d+)?)\s*(g|kg|G|KG)/i);
            if (match) {
              const value = parseFloat(match[1]);
              const unit = match[2].toLowerCase();
              return unit === 'kg' ? value * 1000 : value;
            }
            return 0;
          };
          
          // Try weight first, then name
          const weightA = getWeightValue(a.weight) || getWeightValue(a.name);
          const weightB = getWeightValue(b.weight) || getWeightValue(b.name);
          
          // If weights are equal, sort by price
          if (weightA === weightB) {
            return a.price - b.price;
          }
          
          return weightA - weightB;
        });
        
        // Get selected variant or default to first variant
        const selectedVariantId = selectedVariants[product.id] || variants[0]?.id || null;
        const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
        
        // Calculate display price and inventory from selected variant
        const displayPrice = selectedVariant?.price || product.price;
        const displayInventory = selectedVariant?.inventoryQty || product.inventoryQty;
        
        const hasDiscount =
          product.originalPrice && product.originalPrice > displayPrice;
        const discountPercentage = hasDiscount && product.originalPrice
          ? getDiscountPercentage(product.originalPrice, displayPrice)
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
                    displayInventory > 0 ? 'group-hover:scale-105' : ''
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

              {/* Variant Selector Dropdown */}
              {variants.length > 1 && (
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-[#8B1A1A] mb-2">
                    Select Quantity:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVariantId || ""}
                      onChange={(e) => {
                        setSelectedVariants(prev => ({ ...prev, [product.id]: e.target.value }));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-4 py-2.5 pr-10 text-sm font-medium bg-white border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm cursor-pointer appearance-none"
                    >
                      {variants.map((variant) => (
                        <option
                          key={variant.id}
                          value={variant.id}
                          disabled={variant.inventoryQty === 0}
                        >
                          {variant.name} - {formatPrice(variant.price)}
                          {variant.inventoryQty === 0 ? " (Out of Stock)" : ""}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-[#8B1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-[#8B1A1A]">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-[#8B1A1A] line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>

              {/* Stock Status and Add to Cart */}
              <div className="space-y-2">
                <div className="text-xs text-[#8B1A1A]">
                  {displayInventory > 0 ? (
                    <span className="text-[#8B1A1A]">{displayInventory} in stock</span>
                  ) : (
                    <span className="text-[#FFB347]">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (displayInventory > 0 && selectedVariantId) {
                      handleAddToCart(product.id, selectedVariantId, product.name);
                    }
                  }}
                  disabled={displayInventory === 0 || !selectedVariantId}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    displayInventory > 0 && selectedVariantId
                      ? "bg-[#8B1A1A] text-white hover:bg-[#D4AF37] hover:text-[#8B1A1A]"
                      : "bg-[#FFF7EE] text-[#8B1A1A] cursor-not-allowed"
                  }`}
                >
                  {displayInventory > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
