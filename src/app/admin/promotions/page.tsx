"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Copy,
  Send,
  X,
} from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  type: string;
  value: number;
  minOrder?: number;
  couponCode?: string;
  maxUses?: number;
  userLimit?: number;
  startAt: string;
  endAt: string;
  combinable: boolean;
  active: boolean;
  createdAt: string;
  products?: Array<{ product: { id: string; name: string; slug: string } }>;
  categories?: Array<{ category: { id: string; name: string; slug: string } }>;
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      // Load from localStorage instead of API
      const savedPromotions = localStorage.getItem("promotions");
      if (savedPromotions) {
        setPromotions(JSON.parse(savedPromotions));
      } else {
        setPromotions([]);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    try {
      // Delete from localStorage
      const savedPromotions = JSON.parse(localStorage.getItem("promotions") || "[]");
      const updated = savedPromotions.filter((p: Promotion) => p.id !== id);
      localStorage.setItem("promotions", JSON.stringify(updated));
      setPromotions(updated);
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      // Update in localStorage
      const savedPromotions = JSON.parse(localStorage.getItem("promotions") || "[]");
      const updated = savedPromotions.map((p: Promotion) =>
        p.id === id ? { ...p, active: !active } : p
      );
      localStorage.setItem("promotions", JSON.stringify(updated));
      setPromotions(updated);
    } catch (error) {
      console.error("Error toggling promotion:", error);
    }
  };

  const handleSendNotification = async (id: string) => {
    if (!confirm("Send notification to all users about this promotion?"))
      return;

    try {
      // In a real app, this would send notifications
      // For demo purposes, just show a success message
      alert("Notification would be sent to all users about this promotion!");
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  const generateCouponCode = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    return `PROMO-${dateStr}-${randomSuffix}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startAt = new Date(promotion.startAt);
    const endAt = new Date(promotion.endAt);

    if (!promotion.active) {
      return (
        <span className="px-2 py-1 bg-[#FFF7EE] text-[#8B1A1A] rounded text-xs">
          Inactive
        </span>
      );
    }

    if (now < startAt) {
      return (
        <span className="px-2 py-1 bg-[#ffedd5] text-[#D4AF37] rounded text-xs">
          Scheduled
        </span>
      );
    }

    if (now > endAt) {
      return (
        <span className="px-2 py-1 bg-red-100 text-[#FFB347] rounded text-xs">
          Expired
        </span>
      );
    }

    return (
      <span className="px-2 py-1 bg-[#fff9e6] text-[#8B1A1A] rounded text-xs">
        Active
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      PERCENTAGE: "bg-[#ffedd5] text-[#D4AF37]",
      FIXED: "bg-[#fff9e6] text-[#8B1A1A]",
      BOGO: "bg-purple-100 text-purple-800",
      BUNDLE: "bg-orange-100 text-orange-800",
      FLASH: "bg-red-100 text-[#FFB347]",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs ${colors[type as keyof typeof colors] || "bg-[#FFF7EE] text-[#8B1A1A]"}`}
      >
        {type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF7EE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border--[#FFB347] mx-auto"></div>
          <p className="mt-4 text-[#8B1A1A]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#8B1A1A]">
              Promotion Management
            </h1>
            <p className="text-[#8B1A1A] mt-2">
              Manage discounts, offers, and promotional campaigns
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#FFB347] text-white px-4 py-2 rounded-lg hover:bg-[#b91c1c] transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Promotion
          </button>
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FFF7EE]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Type & Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Coupon Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-[#FFF7EE]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-[#8B1A1A]">
                          {promotion.name}
                        </div>
                        <div className="text-sm text-[#8B1A1A]">
                          Min Order: ₹{promotion.minOrder || 0}
                        </div>
                        {promotion.products &&
                          promotion.products.length > 0 && (
                            <div className="text-xs text-[#D4AF37]">
                              Products: {promotion.products.length}
                            </div>
                          )}
                        {promotion.categories &&
                          promotion.categories.length > 0 && (
                            <div className="text-xs text-[#8B1A1A]">
                              Categories: {promotion.categories.length}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getTypeBadge(promotion.type)}
                        <div className="text-sm text-[#8B1A1A]">
                          {promotion.type === "PERCENTAGE"
                            ? `${promotion.value}%`
                            : promotion.type === "FIXED"
                              ? `₹${promotion.value}`
                              : promotion.type === "BOGO"
                                ? "Buy 1 Get 1"
                                : promotion.type === "BUNDLE"
                                  ? "Bundle Deal"
                                  : "Flash Sale"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promotion.couponCode ? (
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-[#FFF7EE] px-2 py-1 rounded">
                            {promotion.couponCode}
                          </code>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                promotion.couponCode!,
                              )
                            }
                            className="text-[#8B1A1A] hover:text-[#8B1A1A]"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[#8B1A1A] text-sm">No code</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8B1A1A]">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <div>
                          <div>Start: {formatDate(promotion.startAt)}</div>
                          <div>End: {formatDate(promotion.endAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(promotion)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingPromotion(promotion);
                            setShowForm(true);
                          }}
                          className="text-[#D4AF37] hover:text-[#D4AF37]"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleActive(promotion.id, promotion.active)
                          }
                          className={`${promotion.active ? "text-[#FFB347] hover:text-[#b91c1c]" : "text-[#8B1A1A] hover:text-[#8B1A1A]"}`}
                          title={promotion.active ? "Deactivate" : "Activate"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendNotification(promotion.id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Send Notification"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-[#FFB347] hover:text-[#b91c1c]"
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
        </div>

        {/* Empty State */}
        {promotions.length === 0 && !showForm && (
          <div className="text-center py-12">
            <div className="text-[#8B1A1A] mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-[#8B1A1A] mb-2">
              No promotions found
            </h3>
            <p className="text-[#8B1A1A] mb-4">
              Get started by creating your first promotion.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#FFB347] text-white px-4 py-2 rounded-lg hover:bg-[#b91c1c] transition-colors"
            >
              Create Promotion
            </button>
          </div>
        )}

        {/* Promotion Form - Inline on Same Page */}
        {showForm && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border-2 border-amber-100 overflow-hidden">
            <PromotionFormInline
              promotion={editingPromotion}
              onClose={() => {
                setShowForm(false);
                setEditingPromotion(null);
              }}
              onSuccess={() => {
                fetchPromotions();
                setShowForm(false);
                setEditingPromotion(null);
              }}
              generateCouponCode={generateCouponCode}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Promotion Form - Inline Component (Same Page)
function PromotionFormInline({
  promotion,
  onClose,
  onSuccess,
  generateCouponCode,
}: {
  promotion: Promotion | null;
  onClose: () => void;
  onSuccess: () => void;
  generateCouponCode: () => string;
}) {
  const [formData, setFormData] = useState({
    name: promotion?.name || "",
    type: promotion?.type || "PERCENTAGE",
    value: promotion?.value || 0,
    minOrder: promotion?.minOrder || 0,
    couponCode: promotion?.couponCode || "",
    maxUses: promotion?.maxUses || 0,
    userLimit: promotion?.userLimit || 0,
    startAt: promotion?.startAt
      ? new Date(promotion.startAt).toISOString().slice(0, 16)
      : "",
    endAt: promotion?.endAt
      ? new Date(promotion.endAt).toISOString().slice(0, 16)
      : "",
    combinable: promotion?.combinable ?? false,
    active: promotion?.active ?? true,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to localStorage instead of API
      const promotions = JSON.parse(localStorage.getItem("promotions") || "[]");
      
      if (promotion) {
        // Update existing
        const updated = promotions.map((p: Promotion) =>
          p.id === promotion.id ? { ...promotion, ...formData } : p
        );
        localStorage.setItem("promotions", JSON.stringify(updated));
      } else {
        // Create new
        const newPromotion: Promotion = {
          id: `PROMO${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("promotions", JSON.stringify([...promotions, newPromotion]));
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Failed to save promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 border-b border-amber-200 pb-4">
        <h2 className="text-2xl font-bold text-[#8B1A1A]">
          {promotion ? "Edit Promotion" : "Create New Promotion"}
        </h2>
        <button
          onClick={onClose}
          className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors p-2 hover:bg-amber-50 rounded-lg"
          aria-label="Close form"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Promotion Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-10 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] appearance-none cursor-pointer transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                >
                  <option value="PERCENTAGE" className="bg-white text-[#8B1A1A]">Percentage</option>
                  <option value="FIXED" className="bg-white text-[#8B1A1A]">Fixed Amount</option>
                  <option value="BOGO" className="bg-white text-[#8B1A1A]">Buy 1 Get 1</option>
                  <option value="BUNDLE" className="bg-white text-[#8B1A1A]">Bundle Deal</option>
                  <option value="FLASH" className="bg-white text-[#8B1A1A]">Flash Sale</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-[2.75rem] transform -translate-y-1/2 pointer-events-none z-10">
                  <svg className="w-5 h-5 text-[#8B1A1A]/60 group-hover:text-[#8B1A1A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Value *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Minimum Order Value
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.minOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minOrder: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>

            {/* Coupon Code - Full Width with Generate Button */}
            <div>
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) =>
                    setFormData({ ...formData, couponCode: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Enter coupon code or generate one"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      couponCode: generateCouponCode(),
                    })
                  }
                  className="px-6 py-3 bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white border-2 border-amber-200 rounded-xl hover:from-[#7A1515] hover:to-[#B8941F] transition-all duration-300 shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Max Uses and User Limit - Separate Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Max Uses
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxUses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxUses: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="0 = unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  User Limit (per user)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.userLimit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userLimit: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="0 = unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startAt}
                  onChange={(e) =>
                    setFormData({ ...formData, startAt: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endAt}
                  onChange={(e) =>
                    setFormData({ ...formData, endAt: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="combinable"
                  checked={formData.combinable}
                  onChange={(e) =>
                    setFormData({ ...formData, combinable: e.target.checked })
                  }
                  className="h-4 w-4 text-[#FFB347] focus:ring-red-500 border-[#fff9e6] rounded"
                />
                <label
                  htmlFor="combinable"
                  className="ml-2 block text-sm text-[#8B1A1A]"
                >
                  Combinable with other offers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="h-4 w-4 text-[#FFB347] focus:ring-red-500 border-[#fff9e6] rounded"
                />
                <label
                  htmlFor="active"
                  className="ml-2 block text-sm text-[#8B1A1A]"
                >
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-amber-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-amber-200 rounded-xl text-[#8B1A1A] hover:bg-[#FFF7EE] hover:border-[#D4AF37] transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white rounded-xl hover:from-[#7A1515] hover:to-[#B8941F] disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
              >
                {loading ? "Saving..." : promotion ? "Update Promotion" : "Create Promotion"}
              </button>
            </div>
          </form>
    </div>
  );
}
