import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us - Kotaiah's Sweets & Foods",
  description:
    "Learn about our rich heritage and commitment to authentic Indian sweets and traditional recipes.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
              About Kotaiah's Sweets & Foods
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
              Original creators of Kakinada Kaja since 1900 - A legacy of authentic 
              Indian sweets and traditional recipes passed down through generations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Story Content */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                For over 124 years, Kotaiah's Sweets & Foods has been the
                original creator and trusted name for authentic Kakinada Kaja and
                traditional Indian sweets. What started as a small family business
                has grown into a beloved institution, serving communities with
                the finest quality sweets and snacks.
              </p>
              <p>
                Our journey began with a simple mission: to preserve and share
                the rich culinary heritage of India, starting with our signature
                Kakinada Kaja recipe. Every recipe in our collection has been
                carefully passed down through generations, ensuring that the
                authentic flavors and traditional methods are maintained.
              </p>
              <p>
                Today, we continue to honor this legacy by using only the finest
                ingredients, traditional preparation methods, and maintaining
                the highest standards of quality and hygiene in all our
                products. Our Kakinada Kaja remains our most cherished creation,
                representing over a century of sweet tradition.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://sitarafoods.com/wp-content/uploads/2022/07/04-2.jpg"
                alt="Authentic Kakinada Kaja - Our Signature Sweet"
                fill
                className="object-cover"
              />
            </div>
            {/* Image overlay with signature product info */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm font-semibold text-[#7B1E2D]">Our Signature</div>
              <div className="text-xs text-gray-600">Kakinada Kaja</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#7B1E2D]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏺</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Authenticity
              </h3>
              <p className="text-gray-600">
                We stay true to traditional recipes and preparation methods,
                ensuring every product carries the authentic taste of India.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#C79A2A]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quality
              </h3>
              <p className="text-gray-600">
                We use only the finest ingredients and maintain strict quality
                standards in every step of our production process.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#7B1E2D]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Passion
              </h3>
              <p className="text-gray-600">
                Our love for traditional Indian cuisine drives us to
                continuously improve and innovate while preserving our heritage.
              </p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🍯</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Traditional Sweets
              </h3>
              <p className="text-gray-600 text-sm">
                Authentic Indian sweets made with traditional recipes
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🥟</div>
              <h3 className="font-semibold text-gray-900 mb-2">Hot Snacks</h3>
              <p className="text-gray-600 text-sm">
                Crispy and flavorful snacks perfect for any occasion
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🥒</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Pickles & Preserves
              </h3>
              <p className="text-gray-600 text-sm">
                Tangy and spicy pickles made with fresh ingredients
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-semibold text-gray-900 mb-2">Gift Boxes</h3>
              <p className="text-gray-600 text-sm">
                Beautifully curated gift boxes for special occasions
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">
            Experience the Taste of Tradition
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Visit our store or order online to experience the authentic flavors
            that have made us a household name for generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products/sweets"
              className="bg-white text-[#7B1E2D] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-[#7B1E2D] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
