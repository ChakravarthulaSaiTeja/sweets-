"use client";

/**
 * Product Detail Client Component
 * 
 * Displays detailed product information including:
 * - Product images with badges (Best Seller, Featured, Discount)
 * - Product name, description, and category
 * - Rating and reviews
 * - Price with discount information
 * - Product details (weight, shelf life, ingredients)
 * - Stock status and quantity selector
 * - Add to cart functionality
 * - Shipping information
 * 
 * @param slug - Product slug identifier from URL
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/utils";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Package, Calendar, Truck } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProductDetailClientProps {
  product: Product;
}

interface Variant {
  id: string;
  name: string;
  price: number;
  sku: string;
  inventoryQty: number;
  weight: string | null;
  packSize: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  images: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  variants: Variant[];
  averageRating: number | null;
  reviewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
}

export default function ProductDetailClient({ product: initialProduct }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    // Select first variant by default (after sorting by weight)
    if (initialProduct.variants && initialProduct.variants.length > 0) {
      // Sort variants by weight/quantity in ascending order
      const sortedVariants = [...initialProduct.variants].sort((a, b) => {
        const getWeightValue = (weight: string | null): number => {
          if (!weight) return 0;
          const match = weight.match(/(\d+(?:\.\d+)?)\s*(g|kg|G|KG)/i);
          if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            return unit === 'kg' ? value * 1000 : value;
          }
          return 0;
        };
        
        const weightA = getWeightValue(a.weight) || getWeightValue(a.name);
        const weightB = getWeightValue(b.weight) || getWeightValue(b.name);
        
        if (weightA === weightB) {
          return a.price - b.price;
        }
        
        return weightA - weightB;
      });
      
      setSelectedVariant(sortedVariants[0]);
    }
  }, [initialProduct]);

  /**
   * Handles adding the product to cart with selected quantity
   * Shows user feedback when item is added successfully
   * Requires user to be logged in
   */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Show message that login is required
      alert("Please sign in to add items to cart");
      return;
    }

    if (!initialProduct || !selectedVariant) {
      return;
    }

    if (selectedVariant.inventoryQty === 0) {
      alert("This variant is out of stock");
      return;
    }

    try {
      await addToCart(selectedVariant.id, quantity);
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
              <p class="font-semibold text-white">${initialProduct.name}</p>
              <p class="text-sm text-white/90">${quantity}x added to cart successfully!</p>
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
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  /**
   * Updates quantity within valid range (1 to available inventory)
   */
  const handleQuantityChange = (delta: number) => {
    const maxQty = selectedVariant?.inventoryQty || 0;
    const newQuantity = Math.max(1, Math.min(quantity + delta, maxQty));
    setQuantity(newQuantity);
  };

  // Calculate display price and inventory from selected variant or product base
  const displayPrice = selectedVariant?.price ?? initialProduct?.price ?? 0;
  const displayInventory = selectedVariant?.inventoryQty ?? 0;
  const displayWeight = selectedVariant?.weight ?? null;

  const hasDiscount = initialProduct?.originalPrice != null && initialProduct.originalPrice > displayPrice;
  const discountPercentage = hasDiscount && initialProduct?.originalPrice != null
    ? Math.round(((initialProduct.originalPrice - displayPrice) / initialProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-[#8B1A1A] hover:text-[#D4AF37]">
              Home
            </Link>
            <span className="text-[#8B1A1A]">/</span>
            <Link href="/products" className="text-[#8B1A1A] hover:text-[#D4AF37]">
              Products
            </Link>
            <span className="text-[#8B1A1A]">/</span>
            {initialProduct.category && (
              <>
                <Link
                  href={`/products/${initialProduct.category.slug}`}
                  className="text-[#8B1A1A] hover:text-[#D4AF37]"
                >
                  {initialProduct.category.name}
                </Link>
                <span className="text-[#8B1A1A]">/</span>
              </>
            )}
            <span className="text-[#8B1A1A]">{initialProduct.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={initialProduct.category ? `/products/${initialProduct.category.slug}` : "/products"}
          className="inline-flex items-center text-[#8B1A1A] hover:text-[#D4AF37] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {initialProduct.category?.name || "Products"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src={initialProduct.images[0] || "/images/placeholder-product.svg"}
                alt={initialProduct.name}
                fill
                className="object-cover"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {initialProduct.isBestSeller && (
                  <span className="bg-[#8B1A1A] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
                {initialProduct.isFeatured && (
                  <span className="bg-[#D4AF37] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-[#FFB347] text-white text-xs font-medium px-3 py-1 rounded-full">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {initialProduct.category && (
              <div className="text-sm text-[#D4AF37] uppercase tracking-wide font-medium">
                {initialProduct.category.name}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-heading font-bold text-[#8B1A1A]">
              {initialProduct.name}
            </h1>

            {/* Rating */}
            {initialProduct.averageRating != null && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(initialProduct.averageRating ?? 0)
                          ? "text-[#D4AF37] fill-[#D4AF37]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#8B1A1A]">
                  {initialProduct.averageRating} ({initialProduct.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Variant Selector - Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#8B1A1A]">Select Quantity:</label>
              {initialProduct.variants && initialProduct.variants.length > 0 ? (() => {
                // Sort variants by weight/quantity in ascending order
                const sortedVariants = [...initialProduct.variants].sort((a, b) => {
                  // Extract numeric value from weight (e.g., "500g" -> 500, "1kg" -> 1000)
                  const getWeightValue = (weight: string | null): number => {
                    if (!weight) return 0;
                    const match = weight.match(/(\d+(?:\.\d+)?)\s*(g|kg|G|KG)/i);
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
                
                return (
                  <select
                    value={selectedVariant?.id ?? sortedVariants[0]?.id ?? ""}
                    onChange={(e) => {
                      const variant = sortedVariants.find((v) => v.id === e.target.value);
                      if (variant) {
                        setSelectedVariant(variant);
                        setQuantity(1); // Reset quantity when variant changes
                      }
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm"
                  >
                    {sortedVariants.map((variant) => (
                      <option
                        key={variant.id}
                        value={variant.id}
                        disabled={variant.inventoryQty === 0}
                      >
                        {variant.name} ({variant.weight || variant.name}) - {formatPrice(variant.price)}
                        {variant.inventoryQty === 0 ? " (Out of Stock)" : ` (${variant.inventoryQty} in stock)`}
                      </option>
                    ))}
                  </select>
                );
              })() : (
                <div className="px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-[#8B1A1A]/70">
                  No variants available
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#8B1A1A]">
                {formatPrice(displayPrice)}
              </span>
              {initialProduct.originalPrice && initialProduct.originalPrice > displayPrice && (
                <>
                  <span className="text-2xl text-[#8B1A1A] line-through opacity-60">
                    {formatPrice(initialProduct.originalPrice)}
                  </span>
                  <span className="bg-[#FFB347] text-white text-sm font-medium px-3 py-1 rounded-full">
                    Save {formatPrice(initialProduct.originalPrice - displayPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-[#8B1A1A] leading-relaxed text-lg">
                {initialProduct.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200">
              {displayWeight && (
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs text-[#8B1A1A] uppercase">Weight</div>
                    <div className="text-sm font-medium text-[#8B1A1A]">{displayWeight}</div>
                  </div>
                </div>
              )}
              {selectedVariant?.packSize && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs text-[#8B1A1A] uppercase">Pack Size</div>
                    <div className="text-sm font-medium text-[#8B1A1A]">{selectedVariant.packSize}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="pt-4 border-t border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-[#8B1A1A] mb-1">Stock Status</div>
                  {displayInventory > 0 ? (
                    <div className="text-[#8B1A1A] font-medium">
                      {displayInventory} units available
                    </div>
                  ) : (
                    <div className="text-[#FFB347] font-medium">Out of Stock</div>
                  )}
                </div>
              </div>

              {/* Show login message if not authenticated */}
              {!isAuthenticated && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-[#8B1A1A]">
                    Please sign in to add items to cart
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              {displayInventory > 0 && isAuthenticated && (
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm font-medium text-[#8B1A1A]">Quantity:</span>
                  <div className="flex items-center border border-amber-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-[#8B1A1A] hover:text-white transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-[#8B1A1A] font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-[#8B1A1A] hover:text-white transition-colors"
                      disabled={quantity >= displayInventory}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={displayInventory === 0 || !selectedVariant}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  displayInventory > 0 && selectedVariant
                    ? "bg-[#8B1A1A] text-white hover:bg-[#D4AF37] hover:text-[#8B1A1A] shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {!isAuthenticated
                    ? "Please Sign In to Add to Cart"
                    : displayInventory > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </span>
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-[#D4AF37] mt-0.5" />
                <div>
                  <div className="font-medium text-[#8B1A1A] mb-1">Free Shipping</div>
                  <div className="text-sm text-[#8B1A1A]">
                    Free shipping on orders above ₹500. Delivery within 2-3 business days.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

