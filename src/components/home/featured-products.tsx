"use client";

/**
 * Featured Products Section
 * 
 * Displays a grid of featured products from the catalog.
 * Each product card includes image, rating, price, and quick add-to-cart functionality.
 */

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { formatPrice } from "@/utils";
import { useCart } from "@/contexts/cart-context";
import { getAllProducts } from "@/lib/static-data";
import { useAdminData } from "@/hooks/useAdminData";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  brand?: string;
  category: {
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
}

/**
 * Product Card Component
 * Displays individual product information in a card layout
 * @param product - Product object to display
 */
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  /**
   * Handles adding product to cart from card
   * Prevents navigation to product detail page when clicking add to cart
   */
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
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
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-[#fff9e6] overflow-hidden">
      <div className="relative">
        <button
          onClick={(e) => handleAddToCart(e)}
          className="w-full h-full cursor-pointer"
        >
          <div className="aspect-square overflow-hidden rounded-t-2xl">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </button>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs text-[#8B1A1A] bg-gradient-to-r from-[#fff9e6] to-[#fff3cc] px-3 py-1 rounded-full font-medium shadow-sm">
            {product.category.name}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-[#8B1A1A] mb-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-[#D4AF37] fill-current drop-shadow-sm" />
            ))}
          </div>
          <span className="text-sm text-[#8B1A1A] ml-2 font-medium">({product.averageRating})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-[#FFB347] drop-shadow-sm">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 bg-[#D4AF37] text-white rounded-xl hover:bg-[#B8941F] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  // Watch for admin changes
  const allProducts = useAdminData("adminProducts", getAllProducts(), getAllProducts);
  interface ProductFilter {
    isFeatured?: boolean;
    isActive?: boolean;
    isVisible?: boolean;
  }
  const featuredProducts = allProducts.filter((p: ProductFilter) => p.isFeatured && p.isActive !== false && p.isVisible !== false);

  return (
    <section className="py-16 bg-[#FFF7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#8B1A1A] mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-[#8B1A1A] max-w-2xl mx-auto">
            Discover our most popular and best-selling products, carefully
            selected for their exceptional quality and authentic taste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/products"
            className="btn-primary inline-flex items-center group shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
