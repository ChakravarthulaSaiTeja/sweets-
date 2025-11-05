import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { OurStorySection } from "@/components/home/our-story-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kotaiah Foods – Traditional Sweets Delivered Fresh",
  description: "Order authentic sweets made fresh daily. Premium quality, local delivery available.",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <OurStorySection />
      <TestimonialsSection />
    </div>
  );
}
