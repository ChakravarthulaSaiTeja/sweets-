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

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  originalPrice?: number | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  categoryId: string;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    sku: string;
    inventoryQty: number;
    weight: string | null;
    packSize: string | null;
    isActive: boolean;
  }>;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isVisible: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, products]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products and categories from API
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (productData: any, isUpdate: boolean) => {
    try {
      if (isUpdate && editingProduct) {
        // Update existing product - remove variants from payload as they're managed separately
        const { variants, inventoryQty, weight, packSize, ...updatePayload } = productData;
        const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePayload),
        });

        if (response.ok) {
          setShowForm(false);
          setEditingProduct(null);
          await loadData();
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          const errorMessage = errorData.error || `Failed to update product (${response.status})`;
          console.error("Product update error:", errorMessage);
          alert(errorMessage);
          throw new Error(errorMessage);
        }
      } else {
        // Create new product
        const response = await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          setShowForm(false);
          setEditingProduct(null);
          await loadData();
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          const errorMessage = errorData.error || `Failed to create product (${response.status})`;
          console.error("Product creation error:", errorMessage);
          alert(errorMessage);
          throw new Error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save product";
      alert(errorMessage);
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

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This will set it as inactive.")) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await loadData();
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          const errorMessage = errorData.error || `Failed to delete product (${response.status})`;
          console.error("Product delete error:", errorMessage);
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to delete product";
        alert(errorMessage);
      }
    }
  };

  const handleToggleStatus = async (productId: string, field: "isActive" | "isFeatured" | "isBestSeller" | "isVisible") => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        alert("Product not found");
        return;
      }

      const newValue = !product[field];
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: newValue }),
      });

      if (response.ok) {
        await loadData();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to update product (${response.status})`;
        console.error("Toggle status error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update product";
      alert(errorMessage);
    }
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
                        value={product.variants?.[0]?.inventoryQty || 0}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 0;
                          // Note: Direct variant inventory updates would require a variant API endpoint
                          // For now, display-only. Admin can edit through product form
                        }}
                        className="w-20 px-2 py-1 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A] bg-gray-50"
                        min="0"
                        readOnly
                        title="Edit product to update inventory"
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
          onReload={async () => {
            // Reload all products and update editingProduct if it exists
            await loadData();
            // If editing a product, refresh the editingProduct with latest data from database
            if (editingProduct) {
              try {
                const response = await fetch(`/api/admin/products/${editingProduct.id}`);
                if (response.ok) {
                  const updatedProduct = await response.json();
                  setEditingProduct(updatedProduct);
                }
              } catch (error) {
                console.error("Error refreshing product:", error);
              }
            }
          }}
          onSave={async (productData) => {
            if (editingProduct) {
              // Update existing product
              await saveProduct(productData, true);
            } else {
              // Create new product
              const slug = productData.name?.toLowerCase().replace(/\s+/g, "-") || "";
              const productPayload = {
                name: productData.name,
                slug: slug,
                description: productData.description || "",
                shortDescription: productData.shortDescription || null,
                price: productData.price || 0,
                originalPrice: productData.originalPrice || null,
                images: productData.images || [],
                categoryId: productData.category?.id || "",
                isActive: true,
                isFeatured: productData.isFeatured || false,
                isBestSeller: productData.isBestSeller || false,
                isVisible: true,
                variants: productData.inventoryQty ? [{
                  name: productData.weight || "Default",
                  price: productData.price || 0,
                  sku: `SKU-${Date.now()}`,
                  inventoryQty: productData.inventoryQty || 0,
                  weight: productData.weight || null,
                  packSize: productData.packSize || null,
                  isActive: true,
                }] : [],
              };
              await saveProduct(productPayload, false);
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
  onReload,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Partial<Product> & { inventoryQty?: number; weight?: string | null; packSize?: string | null }) => Promise<void>;
  onReload: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || null,
    categoryId: product?.categoryId || categories[0]?.id || "",
    inventoryQty: product?.variants?.[0]?.inventoryQty || 0,
    images: product?.images.join(",") || "",
    weight: product?.variants?.[0]?.weight || "",
    packSize: product?.variants?.[0]?.packSize || "",
    isFeatured: product?.isFeatured || false,
    isBestSeller: product?.isBestSeller || false,
  });

  const [variants, setVariants] = useState(
    product?.variants || []
  );

  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingVariantData, setEditingVariantData] = useState<{
    name: string;
    price: number;
    weight: string | null;
    inventoryQty: number;
  } | null>(null);

  const [newVariantData, setNewVariantData] = useState({
    name: "",
    price: 0,
    weight: "",
    inventoryQty: 0,
    packSize: "",
  });

  // Update variants when product changes
  useEffect(() => {
    if (product) {
      setVariants(product.variants || []);
    } else {
      setVariants([]);
    }
    setEditingVariantId(null);
    setEditingVariantData(null);
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find((c) => c.id === formData.categoryId);
    if (!selectedCategory) return;

    await onSave({
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription || null,
      price: formData.price,
      originalPrice: formData.originalPrice || null,
      category: {
        id: selectedCategory.id,
        name: selectedCategory.name,
        slug: selectedCategory.slug,
      },
      categoryId: selectedCategory.id,
      images: formData.images.split(",").filter((img) => img.trim()),
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      // These are passed for product creation (to create initial variant)
      inventoryQty: formData.inventoryQty,
      weight: formData.weight || null,
      packSize: formData.packSize || null,
    });
  };

  const handleSaveVariant = async (variantId: string) => {
    if (!editingVariantData) {
      alert("No variant data to save");
      return;
    }

    try {
      const response = await fetch(`/api/admin/variants/${variantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingVariantData),
      });

      if (response.ok) {
        const updatedVariant = await response.json();
        // Update local state immediately for instant UI feedback
        setVariants(variants.map((v) => (v.id === variantId ? updatedVariant : v)));
        setEditingVariantId(null);
        setEditingVariantData(null);
        // Reload data from database to ensure consistency
        await onReload();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to update variant (${response.status})`;
        console.error("Variant update error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error saving variant:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save variant";
      alert(errorMessage);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/variants/${variantId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update local state immediately for instant UI feedback
        setVariants(variants.filter((v) => v.id !== variantId));
        // Reload data from database to ensure consistency
        await onReload();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to delete variant (${response.status})`;
        console.error("Variant delete error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete variant";
      alert(errorMessage);
    }
  };

  const handleAddVariant = async () => {
    if (!product) {
      alert("Product not found");
      return;
    }

    if (!newVariantData.name || newVariantData.name.trim() === "") {
      alert("Please enter a variant name");
      return;
    }

    if (newVariantData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    try {
      const response = await fetch("/api/admin/variants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          name: newVariantData.name.trim(),
          price: Number(newVariantData.price),
          weight: newVariantData.weight?.trim() || null,
          inventoryQty: Number(newVariantData.inventoryQty) || 0,
          packSize: newVariantData.packSize?.trim() || null,
        }),
      });

      if (response.ok) {
        const newVariant = await response.json();
        // Update local state immediately for instant UI feedback
        setVariants([...variants, newVariant]);
        setNewVariantData({
          name: "",
          price: 0,
          weight: "",
          inventoryQty: 0,
          packSize: "",
        });
        // Reload data from database to ensure consistency
        await onReload();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to create variant (${response.status})`;
        console.error("Variant creation error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error creating variant:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create variant";
      alert(errorMessage);
    }
  };

  const handleEditVariant = (variant: typeof variants[0]) => {
    setEditingVariantId(variant.id);
    setEditingVariantData({
      name: variant.name,
      price: variant.price,
      weight: variant.weight || null,
      inventoryQty: variant.inventoryQty,
    });
  };

  const handleCancelEditVariant = () => {
    setEditingVariantId(null);
    setEditingVariantData(null);
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
                {categories.map((cat) => (
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
                Pack Size
              </label>
              <input
                type="text"
                value={formData.packSize}
                onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                placeholder="1 Box"
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-[#8B1A1A] border-amber-200 rounded focus:ring-[#8B1A1A]"
              />
              <span className="text-sm font-medium text-[#8B1A1A]">Featured</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="w-4 h-4 text-[#8B1A1A] border-amber-200 rounded focus:ring-[#8B1A1A]"
              />
              <span className="text-sm font-medium text-[#8B1A1A]">Best Seller</span>
            </label>
          </div>

          {/* Variants Section - Only show when editing existing product */}
          {product && (
            <div className="pt-4 border-t border-amber-200">
              <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Variants</h3>
              
              {variants.length > 0 && (
                <div className="space-y-3 mb-6">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="bg-[#FFF7EE] border-2 border-amber-200 rounded-xl p-4"
                    >
                      {editingVariantId === variant.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={editingVariantData?.name || ""}
                              onChange={(e) =>
                                setEditingVariantData({
                                  ...editingVariantData!,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingVariantData?.price || 0}
                              onChange={(e) =>
                                setEditingVariantData({
                                  ...editingVariantData!,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                              Weight
                            </label>
                            <input
                              type="text"
                              value={editingVariantData?.weight || ""}
                              onChange={(e) =>
                                setEditingVariantData({
                                  ...editingVariantData!,
                                  weight: e.target.value || null,
                                })
                              }
                              placeholder="500g"
                              className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                              Stock
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={editingVariantData?.inventoryQty || 0}
                              onChange={(e) =>
                                setEditingVariantData({
                                  ...editingVariantData!,
                                  inventoryQty: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                            />
                          </div>
                          <div className="md:col-span-4 flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => handleSaveVariant(variant.id)}
                              className="px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-colors"
                            >
                              Save Variant
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEditVariant}
                              className="px-4 py-2 border border-[#8B1A1A] text-[#8B1A1A] rounded-lg text-sm font-semibold hover:bg-[#8B1A1A] hover:text-white transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1 grid grid-cols-4 gap-4">
                            <div>
                              <span className="text-xs text-[#8B1A1A]/70">Name</span>
                              <p className="text-sm font-medium text-[#8B1A1A]">{variant.name}</p>
                            </div>
                            <div>
                              <span className="text-xs text-[#8B1A1A]/70">Price</span>
                              <p className="text-sm font-medium text-[#8B1A1A]">{formatPrice(variant.price)}</p>
                            </div>
                            <div>
                              <span className="text-xs text-[#8B1A1A]/70">Weight</span>
                              <p className="text-sm font-medium text-[#8B1A1A]">{variant.weight || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-xs text-[#8B1A1A]/70">Stock</span>
                              <p className="text-sm font-medium text-[#8B1A1A]">{variant.inventoryQty}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditVariant(variant)}
                              className="px-3 py-1 bg-[#8B1A1A] text-white rounded text-xs font-semibold hover:bg-[#D4AF37] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVariant(variant.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Variant Section */}
              <div className="bg-[#FFF7EE] border-2 border-amber-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-[#8B1A1A] mb-3">Add New Variant</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newVariantData.name}
                      onChange={(e) =>
                        setNewVariantData({ ...newVariantData, name: e.target.value })
                      }
                      placeholder="500g"
                      className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newVariantData.price}
                      onChange={(e) =>
                        setNewVariantData({
                          ...newVariantData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={newVariantData.weight}
                      onChange={(e) =>
                        setNewVariantData({ ...newVariantData, weight: e.target.value })
                      }
                      placeholder="500g"
                      className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#8B1A1A] mb-1">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newVariantData.inventoryQty}
                      onChange={(e) =>
                        setNewVariantData({
                          ...newVariantData,
                          inventoryQty: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-amber-200 rounded text-sm text-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Add Variant
                </button>
              </div>
            </div>
          )}

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
