import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { OurStorySection } from "@/components/home/our-story-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

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
