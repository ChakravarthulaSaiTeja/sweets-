"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-red-800 to-red-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>


      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                A Tradition of Sweetness
                <span className="block text-yellow-400">Since 1900</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Experience the authentic taste of traditional Indian sweets,
                crafted with love and passed down through generations.
                <span className="block mt-3 text-2xl font-bold text-yellow-400 drop-shadow-lg tracking-wide font-heading">
                  Original creators of Kakinada Kaja - The authentic recipe since 1900
                </span>
                Every bite tells a story of heritage and excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products/sweets"
                className="btn-secondary inline-flex items-center justify-center group shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Shop Heritage Sweets
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  // TODO: Add video modal or redirect to video page
                  console.log("Watch Our Story clicked");
                }}
                className="border-2 border-white text-white hover:bg-white hover:text-red-800 px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center group transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                Watch Our Story
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>124+ Years of Excellence</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Fresh Daily Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Authentic Recipes</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-3xl transform hover:scale-105 transition-all duration-500 relative group">
              <Image
                src="https://sitarafoods.com/wp-content/uploads/2022/07/04-2.jpg"
                alt="Authentic Kakinada Kaja - Original Recipe Since 1900"
                width={600}
                height={600}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#7B1E2D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-red-800 p-6 rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-300 border border-gray-100">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">Varieties</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-yellow-600 text-white p-6 rounded-xl shadow-2xl transform hover:scale-110 transition-all duration-300 border border-yellow-500">
              <div className="text-2xl font-bold">100K+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
