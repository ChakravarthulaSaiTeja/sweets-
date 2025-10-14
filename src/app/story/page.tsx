import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story - Kotaiah's Sweets & Foods",
  description: "Discover the rich heritage and tradition behind Kotaiah's Sweets & Foods, serving authentic Indian sweets since 1900.",
};

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-6">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A journey of tradition, passion, and authentic flavors that spans over 124 years
          </p>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  The Beginning (1900)
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  It all started in the bustling streets of Hyderabad in the year 1900, when our founder, 
                  Sri Kotaiah, opened a small sweet shop with nothing but a dream and traditional recipes 
                  passed down through generations. What began as a humble venture to bring authentic 
                  Indian sweets to the local community has grown into a legacy that continues to thrive today.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  The Secret Recipe
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our success lies in our unwavering commitment to traditional methods and authentic ingredients. 
                  Each sweet is crafted using age-old techniques, with recipes that have been carefully preserved 
                  and perfected over the decades. We believe that the best sweets come from the heart, and that's 
                  why every batch is made with love and attention to detail.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  Growing Through Generations
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Over the years, Kotaiah's Sweets & Foods has been passed down through four generations of 
                  the family, each bringing their own innovations while maintaining the core values of quality, 
                  authenticity, and customer satisfaction. Today, we continue to serve our community with the 
                  same dedication and passion that started it all.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  Our Promise
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We promise to continue delivering the same authentic taste and quality that has made us 
                  a trusted name for over 124 years. Every sweet we make is crafted with love, using 
                  traditional methods and the finest ingredients. When you choose Kotaiah's, you're not 
                  just buying sweets – you're becoming part of our family's legacy.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-heading font-bold mb-4">
                  Join Our Sweet Journey
                </h3>
                <p className="text-lg mb-6">
                  Experience the taste of tradition and become part of our story
                </p>
                <a
                  href="/products"
                  className="inline-block bg-white text-[#7B1E2D] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  Explore Our Sweets
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
