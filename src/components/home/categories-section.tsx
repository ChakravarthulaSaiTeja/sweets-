import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Sweets",
    slug: "sweets",
    description: "Traditional Indian sweets made with authentic recipes",
    image: "https://savithrammas.com/site/image/cache/catalog/Untitled-3-1080x540.jpg",
    count: "25+ Varieties",
  },
  {
    name: "Hot Snacks",
    slug: "hot-snacks",
    description: "Freshly prepared hot snacks and savories",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop&crop=center",
    count: "15+ Varieties",
  },
  {
    name: "Pickles",
    slug: "pickles",
    description: "Traditional pickles and preserves",
    image: "https://cdn-tps.b-cdn.net/wp-content/uploads/2025/01/Traditional-Indian-Pickles.png",
    count: "10+ Varieties",
  },
  {
    name: "Powders",
    slug: "powders",
    description: "Spice powders and masala mixes",
    image: "https://tawablindia.com/wp-content/uploads/2025/03/التوابل-الهندية.jpg",
    count: "8+ Varieties",
  },
  {
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Curated gift boxes for special occasions",
    image: "/images/categories/gift-boxes.svg",
    count: "5+ Collections",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of traditional Indian delicacies, each
            category offering unique flavors and authentic recipes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products/${category.slug}`}
              className="group card card-hover"
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-800 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-yellow-600 font-medium">
                    {category.count}
                  </span>
                  <ArrowRight className="h-4 w-4 text-red-800 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="btn-outline inline-flex items-center group"
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
