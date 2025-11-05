"use client";

/**
 * Admin Categories Management Page
 * 
 * Allows admins to:
 * - View all categories
 * - Add new categories
 * - Edit existing categories
 * - Delete categories
 * - Manage category descriptions
 */

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Failed to load categories:", errorData.error);
        alert(`Failed to load categories: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This will set it as inactive.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadCategories();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to delete category (${response.status})`;
        console.error("Category delete error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete category";
      alert(errorMessage);
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    try {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) {
        alert("Category not found");
        return;
      }

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !category.isActive }),
      });

      if (response.ok) {
        await loadCategories();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to update category (${response.status})`;
        console.error("Toggle status error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update category";
      alert(errorMessage);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
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
              <h1 className="text-3xl font-bold text-[#8B1A1A] mt-2">Categories Management</h1>
              <p className="text-[#8B1A1A] mt-1">
                Manage product categories ({categories.length} categories)
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#8B1A1A]">{category.name}</h3>
                  <p className="text-sm text-[#8B1A1A]/70 mt-1">{category.slug}</p>
                </div>
                <button
                  onClick={() => handleToggleStatus(category.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    category.isActive
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </button>
              </div>
              <p className="text-sm text-[#8B1A1A] mb-4">{category.description || "No description"}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg hover:bg-[#7A1515] transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          onSave={async (categoryData) => {
            try {
              if (editingCategory) {
                // Update existing category
                const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: categoryData.name,
                    slug: categoryData.slug || editingCategory.slug,
                    description: categoryData.description || null,
                    isActive: categoryData.isActive !== undefined ? categoryData.isActive : editingCategory.isActive,
                  }),
                });

                if (response.ok) {
                  setShowForm(false);
                  setEditingCategory(null);
                  await loadCategories();
                } else {
                  const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
                  const errorMessage = errorData.error || `Failed to update category (${response.status})`;
                  alert(errorMessage);
                }
              } else {
                // Create new category
                if (!categoryData.name) {
                  alert("Category name is required");
                  return;
                }

                const slug = categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, "-");
                const response = await fetch("/api/admin/categories", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: categoryData.name,
                    slug,
                    description: categoryData.description || null,
                    isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
                  }),
                });

                if (response.ok) {
                  setShowForm(false);
                  setEditingCategory(null);
                  await loadCategories();
                } else {
                  const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
                  const errorMessage = errorData.error || `Failed to create category (${response.status})`;
                  alert(errorMessage);
                }
              }
            } catch (error) {
              console.error("Error saving category:", error);
              const errorMessage = error instanceof Error ? error.message : "Failed to save category";
              alert(errorMessage);
            }
          }}
        />
      )}
    </div>
  );
}

// Category Form Modal Component
function CategoryFormModal({
  category,
  onClose,
  onSave,
}: {
  category: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    isActive: category?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Category name is required");
      return;
    }

    // Auto-generate slug if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    onSave({
      name: formData.name,
      slug,
      description: formData.description || null,
      isActive: formData.isActive,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="sticky top-0 bg-white border-b border-amber-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#8B1A1A]">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated-from-name"
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
            />
            <p className="text-xs text-[#8B1A1A]/70 mt-1">Leave empty to auto-generate from name</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#8B1A1A] border-amber-200 rounded focus:ring-[#8B1A1A]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-[#8B1A1A]">
              Active
            </label>
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
              {category ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
