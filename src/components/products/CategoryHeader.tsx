"use client";

interface CategoryHeaderProps {
  name: string;
  description: string;
  productCount: number;
}

export function CategoryHeader({
  name,
  description,
  productCount,
}: CategoryHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
            {name}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            {description}
          </p>
          <div className="text-lg text-white/80">
            {productCount} {productCount === 1 ? "product" : "products"}{" "}
            available
          </div>
        </div>
      </div>
    </div>
  );
}
