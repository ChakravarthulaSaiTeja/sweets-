import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart, Heart, Package, Clock, Weight } from "lucide-react";
import { formatPrice } from "@/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  ingredients: string[];
  shelfLife: number;
  weight: string;
  packSize: string;
  inventoryQty: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  category: {
    name: string;
    slug: string;
  };
  averageRating: number;
  reviewCount: number;
  relatedProducts: Product[];
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return {
        title: "Product Not Found - Kotaiah's Sweets & Foods",
        description: "The requested product could not be found.",
      };
    }
    
    const product: Product = await response.json();
    
    return {
      title: `${product.name} - Kotaiah's Sweets & Foods`,
      description: product.shortDescription || product.description,
      openGraph: {
        title: `${product.name} - Kotaiah's Sweets & Foods`,
        description: product.shortDescription || product.description,
        images: product.images,
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found - Kotaiah's Sweets & Foods",
      description: "The requested product could not be found.",
    };
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link
            href="/products"
            className="bg-[#7B1E2D] text-white px-6 py-3 rounded-lg hover:bg-[#C79A2A] transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#7B1E2D]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#7B1E2D]">Products</Link>
            <span>/</span>
            <Link href={`/products/${product.category.slug}`} className="hover:text-[#7B1E2D]">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-white">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            
            {/* Additional Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-sm bg-white">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Badges */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
              <div className="flex space-x-2">
                {product.isBestSeller && (
                  <span className="bg-[#7B1E2D] text-white text-xs font-medium px-2 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-[#C79A2A] text-white text-xs font-medium px-2 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.averageRating}) • {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#7B1E2D]">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg text-gray-600">
                {product.shortDescription}
              </p>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Weight className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="font-medium">{product.weight}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Pack Size</div>
                  <div className="font-medium">{product.packSize}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Shelf Life</div>
                  <div className="font-medium">{product.shelfLife} days</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Stock</div>
                  <div className="font-medium text-green-600">
                    {product.inventoryQty > 0 ? `${product.inventoryQty} available` : 'Out of stock'}
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex space-x-4">
              <button
                disabled={product.inventoryQty === 0}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium transition-colors ${
                  product.inventoryQty > 0
                    ? "bg-[#7B1E2D] text-white hover:bg-[#C79A2A] hover:text-[#7B1E2D]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.inventoryQty > 0 ? "Add to Cart" : "Out of Stock"}</span>
              </button>
              <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Back Button */}
            <Link
              href={`/products/${product.category.slug}`}
              className="inline-flex items-center space-x-2 text-[#7B1E2D] hover:text-[#C79A2A] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to {product.category.name}</span>
            </Link>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            About This Product
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="text-lg leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Ingredients */}
        {product.ingredients.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
              Ingredients
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {product.ingredients.map((ingredient, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm border">
                  <span className="text-sm font-medium text-gray-700">
                    {ingredient}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {product.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#7B1E2D] transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#7B1E2D]">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {relatedProduct.averageRating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
