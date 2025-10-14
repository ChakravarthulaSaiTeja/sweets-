"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { formatPrice } from "@/utils";
import { useCart } from "@/contexts/cart-context";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  isBestSeller: boolean;
  isFeatured: boolean;
  brand?: string;
  category: {
    name: string;
    slug: string;
  };
}

// Real product data with correct external image URLs
const featuredProducts: Product[] = [
  {
    id: "GJ001",
    name: "Gulab Jamun",
    slug: "gulab-jamun",
    price: 280,
    originalPrice: undefined,
    images: ["https://www.shutterstock.com/image-photo/gulab-jamun-beloved-dessert-indian-260nw-2536754249.jpg"],
    isBestSeller: false,
    isFeatured: false,
    brand: "Kotaiah's Sweets",
    category: { name: "Sweets", slug: "sweets" },
  },
  {
    id: "KK001",
    name: "Kaju Katli",
    slug: "kaju-katli",
    price: 450,
    originalPrice: undefined,
    images: ["https://upload.wikimedia.org/wikipedia/commons/a/ac/Kaju_katli_sweet.jpg"],
    isBestSeller: false,
    isFeatured: false,
    brand: "Kotaiah's Sweets",
    category: { name: "Sweets", slug: "sweets" },
  },
  {
    id: "KKJ001",
    name: "Kakinada Kaja",
    slug: "kakinada-kaja",
    price: 180,
    originalPrice: undefined,
    images: ["https://sitarafoods.com/wp-content/uploads/2022/07/04-2.jpg"],
    isBestSeller: true,
    isFeatured: true,
    brand: "Kotaiah's Sweets",
    category: { name: "Sweets", slug: "sweets" },
  },
  {
    id: "DGB001",
    name: "Diwali Gift Box",
    slug: "diwali-gift-box",
    price: 1200,
    originalPrice: undefined,
    images: ["https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center"],
    isBestSeller: false,
    isFeatured: false,
    brand: "Kotaiah's Sweets",
    category: { name: "Gift Boxes", slug: "gift-boxes" },
  },
];

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden">
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
          <span className="text-xs text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 rounded-full font-medium shadow-sm">
            {product.category.name}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm" />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2 font-medium">(4.8)</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-800 drop-shadow-sm">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 bg-red-800 text-white rounded-xl hover:bg-red-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and best-selling products, carefully
            selected for their exceptional quality and authentic taste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
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
