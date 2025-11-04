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
import { getProductBySlug, getAllProducts } from "@/lib/static-data";
import { formatPrice } from "@/utils";
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Package, Calendar, Truck } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const [product, setProduct] = useState<{
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    images: string[];
    isBestSeller: boolean;
    isFeatured: boolean;
    inventoryQty: number;
    category?: { name: string; slug: string };
    averageRating?: number;
    reviewCount?: number;
    ingredients?: string[];
    weight?: string;
    shelfLife?: number;
  } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  // Watch for admin changes
  const allProducts = useAdminData("adminProducts", getAllProducts(), getAllProducts);

  useEffect(() => {
    // Find product from current data (including admin updates)
    // Only show visible products to customers
    interface Product {
      slug: string;
      isVisible?: boolean;
    }
    const foundProduct = allProducts.find((p: Product) => p.slug === slug && p.isVisible !== false) || getProductBySlug(slug);
    if (foundProduct && foundProduct.isVisible === false) {
      setProduct(null); // Hide invisible products
      setLoading(false);
    } else if (foundProduct) {
      setProduct(foundProduct);
      setLoading(false);
    } else {
      // Product not found or not visible
      setProduct(null);
      setLoading(false);
    }
  }, [slug, allProducts]);

  /**
   * Handles adding the product to cart with selected quantity
   * Shows user feedback when item is added successfully
   */
  const handleAddToCart = async () => {
    if (product && product.inventoryQty > 0) {
      try {
        await addToCart(product.id, quantity);
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
              <p class="font-semibold text-white">${product.name}</p>
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
    }
  };

  /**
   * Updates quantity within valid range (1 to available inventory)
   */
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + delta, product?.inventoryQty || 10));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="text-[#8B1A1A]">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#8B1A1A] mb-4">Product Not Found</h1>
          <p className="text-[#8B1A1A] mb-8">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/products"
            className="bg-[#8B1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#D4AF37] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;
  const discountPercentage = hasDiscount && product.originalPrice != null
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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
            {product.category && (
              <>
                <Link
                  href={`/products/${product.category.slug}`}
                  className="text-[#8B1A1A] hover:text-[#D4AF37]"
                >
                  {product.category.name}
                </Link>
                <span className="text-[#8B1A1A]">/</span>
              </>
            )}
            <span className="text-[#8B1A1A]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={product.category ? `/products/${product.category.slug}` : "/products"}
          className="inline-flex items-center text-[#8B1A1A] hover:text-[#D4AF37] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {product.category?.name || "Products"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src={product.images[0] || "/images/placeholder-product.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestSeller && (
                  <span className="bg-[#8B1A1A] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
                {product.isFeatured && (
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
            {product.category && (
              <div className="text-sm text-[#D4AF37] uppercase tracking-wide font-medium">
                {product.category.name}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-heading font-bold text-[#8B1A1A]">
              {product.name}
            </h1>

            {/* Rating */}
            {product.averageRating != null && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.averageRating ?? 0)
                          ? "text-[#D4AF37] fill-[#D4AF37]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#8B1A1A]">
                  {product.averageRating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#8B1A1A]">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && product.originalPrice != null && (
                <>
                  <span className="text-2xl text-[#8B1A1A] line-through opacity-60">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-[#FFB347] text-white text-sm font-medium px-3 py-1 rounded-full">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-[#8B1A1A] leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200">
              {product.weight && (
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs text-[#8B1A1A] uppercase">Weight</div>
                    <div className="text-sm font-medium text-[#8B1A1A]">{product.weight}</div>
                  </div>
                </div>
              )}
              {product.shelfLife && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs text-[#8B1A1A] uppercase">Shelf Life</div>
                    <div className="text-sm font-medium text-[#8B1A1A]">{product.shelfLife} days</div>
                  </div>
                </div>
              )}
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="pt-4 border-t border-amber-200">
                <h3 className="text-lg font-semibold text-[#8B1A1A] mb-2">Ingredients</h3>
                <ul className="list-disc list-inside text-[#8B1A1A] space-y-1">
                  {product.ingredients.map((ingredient: string, index: number) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Status */}
            <div className="pt-4 border-t border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-[#8B1A1A] mb-1">Stock Status</div>
                  {product.inventoryQty > 0 ? (
                    <div className="text-[#8B1A1A] font-medium">
                      {product.inventoryQty} units available
                    </div>
                  ) : (
                    <div className="text-[#FFB347] font-medium">Out of Stock</div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              {product.inventoryQty > 0 && (
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
                      disabled={quantity >= product.inventoryQty}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.inventoryQty === 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  product.inventoryQty > 0
                    ? "bg-[#8B1A1A] text-white hover:bg-[#D4AF37] hover:text-[#8B1A1A] shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.inventoryQty > 0 ? "Add to Cart" : "Out of Stock"}</span>
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

