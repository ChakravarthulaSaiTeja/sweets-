"use client";

/**
 * Admin Products Management Page
 * 
 * Allows admins to:
 * - View all products in a table/grid
 * - Add new products
 * - Edit existing products
 * - Delete products
 * - Update inventory
 * - Toggle product status (active/inactive)
 * - Set featured/best seller flags
 */

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter, Eye, X, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils";
import { getAllProducts, getAllCategories } from "@/lib/static-data";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  inventoryQty: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isVisible: boolean; // Controls visibility for customers
  weight?: string;
  shelfLife?: number;
  ingredients?: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const categories = getAllCategories();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, products]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = () => {
    try {
      // Load from localStorage or use static data
      const savedProducts = localStorage.getItem("adminProducts");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        // Ensure all existing products default to visible if not set
        const productsWithDefaultVisibility = parsed.map((p: Product) => ({
          ...p,
          isVisible: p.isVisible !== undefined ? p.isVisible : true, // Default to visible
        }));
        setProducts(productsWithDefaultVisibility as Product[]);
        // Update localStorage with default visibility
        if (parsed.some((p: Product) => p.isVisible === undefined)) {
          localStorage.setItem("adminProducts", JSON.stringify(productsWithDefaultVisibility));
        }
      } else {
        // Initialize with static data
        const staticProducts = getAllProducts();
        // Ensure all products have isVisible field (default to true - all visible by default)
        const productsWithVisibility = staticProducts.map((p: Product) => ({
          ...p,
          isVisible: true, // All products visible by default
        }));
        setProducts(productsWithVisibility as Product[]);
        localStorage.setItem("adminProducts", JSON.stringify(productsWithVisibility));
      }
    } catch (error) {
      console.error("Error loading products:", error);
      // Fallback to static data - ensure visibility defaults to true
      const staticProducts = getAllProducts();
      const productsWithVisibility = staticProducts.map((p: Product) => ({
        ...p,
        isVisible: true, // Default to visible
      }));
      setProducts(productsWithVisibility as Product[]);
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem("adminProducts", JSON.stringify(updatedProducts));
    // Notify other components to refresh immediately
    if (typeof window !== "undefined") {
      // Dispatch custom event for immediate same-tab updates
      window.dispatchEvent(
        new CustomEvent("adminDataChanged", {
          detail: { key: "adminProducts" },
        })
      );
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category.slug === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== productId);
      saveProducts(updated);
    }
  };

  const handleToggleStatus = (productId: string, field: "isActive" | "isFeatured" | "isBestSeller" | "isVisible") => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, [field]: !p[field] } : p
    );
    saveProducts(updated);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8B1A1A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#fff9e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-[#8B1A1A] mt-2">Products Management</h1>
              <p className="text-[#8B1A1A] mt-1">
                Manage your product catalog ({products.length} products)
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8B1A1A]/60 group-focus-within:text-[#8B1A1A] w-5 h-5 transition-colors z-10" />
              <input
                type="text"
                placeholder="Search products by name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] placeholder:text-[#8B1A1A]/50 transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8B1A1A]/60 group-focus-within:text-[#8B1A1A] w-5 h-5 transition-colors z-10 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] appearance-none cursor-pointer transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              >
                <option value="all">All Categories</option>
                {categories.map((cat: { id: string; name: string; slug: string }) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-[#8B1A1A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-[#FFF7EE]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Visibility
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FFF7EE]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 relative rounded-lg overflow-hidden">
                          <Image
                            src={product.images[0] || "/images/placeholder-product.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#8B1A1A]">{product.name}</div>
                          <div className="text-xs text-[#8B1A1A]/70">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#8B1A1A]">{product.category.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8B1A1A] font-semibold">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-[#8B1A1A]/70 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={product.inventoryQty}
                        onChange={(e) => {
                          const updated = products.map((p) =>
                            p.id === product.id
                              ? { ...p, inventoryQty: parseInt(e.target.value) || 0 }
                              : p
                          );
                          saveProducts(updated);
                        }}
                        className="w-20 px-2 py-1 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(product.id, "isActive")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          product.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(product.id, "isFeatured")}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                            product.isFeatured
                              ? "bg-[#D4AF37] text-white hover:bg-[#B8941F]"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="Featured"
                        >
                          F
                        </button>
                        <button
                          onClick={() => handleToggleStatus(product.id, "isBestSeller")}
                          className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                            product.isBestSeller
                              ? "bg-[#8B1A1A] text-white hover:bg-[#7A1515]"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="Best Seller"
                        >
                          BS
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleToggleStatus(product.id, "isVisible")}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          product.isVisible
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                        title={product.isVisible ? "Visible to customers - Click to hide" : "Hidden from customers - Click to show"}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors p-2 rounded-lg hover:bg-[#8B1A1A]/10"
                          title="View Product Page"
                          target="_blank"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors p-2 rounded-lg hover:bg-[#8B1A1A]/10"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#8B1A1A]">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={(productData) => {
            if (editingProduct) {
              // Update existing
              const updated = products.map((p) =>
                p.id === editingProduct.id ? { ...editingProduct, ...productData } : p
              );
              saveProducts(updated);
            } else {
              // Add new
              if (!productData.name) return;
              const newProduct: Product = {
                id: `PROD${Date.now()}`,
                slug: productData.name.toLowerCase().replace(/\s+/g, "-"),
                name: productData.name,
                description: productData.description || "",
                price: productData.price || 0,
                originalPrice: productData.originalPrice || null,
                images: productData.images || [],
                category: productData.category || { id: "", name: "", slug: "" },
                inventoryQty: productData.inventoryQty || 0,
                isActive: true,
                isFeatured: false,
                isBestSeller: false,
                isVisible: true, // New products are visible by default
                shortDescription: productData.shortDescription,
                weight: productData.weight,
                shelfLife: productData.shelfLife,
                ingredients: productData.ingredients,
              };
              saveProducts([...products, newProduct]);
            }
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Product Form Modal Component
function ProductFormModal({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: Array<{ id: string; name: string; slug: string }>;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || null,
    categoryId: product?.category.id || categories[0]?.id || "",
    inventoryQty: product?.inventoryQty || 0,
    images: product?.images.join(",") || "",
    weight: product?.weight || "",
    shelfLife: product?.shelfLife || 0,
    ingredients: product?.ingredients?.join(",") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find((c) => c.id === formData.categoryId);
    if (!selectedCategory) return;

    onSave({
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription,
      price: formData.price,
      originalPrice: formData.originalPrice || null,
      category: {
        id: selectedCategory.id,
        name: selectedCategory.name,
        slug: selectedCategory.slug,
      },
      inventoryQty: formData.inventoryQty,
      images: formData.images.split(",").filter((img) => img.trim()),
      weight: formData.weight || undefined,
      shelfLife: formData.shelfLife || undefined,
      ingredients: formData.ingredients
        ? formData.ingredients.split(",").map((i) => i.trim())
        : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-amber-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#8B1A1A]">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 pr-10 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] appearance-none cursor-pointer transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              >
                {categories.map((cat: { id: string; name: string; slug: string }) => (
                  <option key={cat.id} value={cat.id} className="bg-white text-[#8B1A1A]">
                    {cat.name}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-[2.75rem] transform -translate-y-1/2 pointer-events-none z-10">
                <svg className="w-5 h-5 text-[#8B1A1A]/60 group-hover:text-[#8B1A1A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
              Short Description
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.inventoryQty}
                onChange={(e) =>
                  setFormData({ ...formData, inventoryQty: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
              Image URLs (comma-separated) *
            </label>
            <input
              type="text"
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">Weight</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="500g"
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Shelf Life (days)
              </label>
              <input
                type="number"
                min="0"
                value={formData.shelfLife}
                onChange={(e) =>
                  setFormData({ ...formData, shelfLife: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
              Ingredients (comma-separated)
            </label>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="Milk, Sugar, Cardamom"
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-amber-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-[#8B1A1A] text-[#8B1A1A] rounded-lg font-semibold hover:bg-[#8B1A1A] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
