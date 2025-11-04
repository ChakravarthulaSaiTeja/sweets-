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
import { getAllCategories } from "@/lib/static-data";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
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

  const loadCategories = () => {
    try {
      const savedCategories = localStorage.getItem("adminCategories");
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        // Initialize with static data
        const staticCategories = getAllCategories();
        const formatted = staticCategories.map((cat: { id: string; name: string; slug: string; description?: string; isActive?: boolean }) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          isActive: cat.isActive ?? true,
        }));
        setCategories(formatted);
        localStorage.setItem("adminCategories", JSON.stringify(formatted));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem("adminCategories", JSON.stringify(updatedCategories));
    // Notify other components to refresh
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("adminDataChanged", {
          detail: { key: "adminCategories" },
        })
      );
    }
  };

  const handleDelete = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updated = categories.filter((c) => c.id !== categoryId);
      saveCategories(updated);
    }
  };

  const handleToggleStatus = (categoryId: string) => {
    const updated = categories.map((c) =>
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    );
    saveCategories(updated);
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
              <p className="text-sm text-[#8B1A1A] mb-4">{category.description}</p>
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
          onSave={(categoryData) => {
            if (editingCategory) {
              // Update existing
              const updated = categories.map((c) =>
                c.id === editingCategory.id ? { ...editingCategory, ...categoryData } : c
              );
              saveCategories(updated);
            } else {
              // Add new
              if (!categoryData.name || !categoryData.description) return;
              const slug = categoryData.name.toLowerCase().replace(/\s+/g, "-");
              const newCategory: Category = {
                id: `cat-${Date.now()}`,
                name: categoryData.name,
                slug,
                description: categoryData.description,
                isActive: categoryData.isActive ?? true,
              };
              saveCategories([...categories, newCategory]);
            }
            setShowForm(false);
            setEditingCategory(null);
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
    description: category?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;
    onSave({
      name: formData.name,
      description: formData.description,
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
