"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch("/api/admin/promotions");
      const data = await response.json();
      if (data.success) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPromotions(promotions.filter((promo) => promo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !active }),
      });

      if (response.ok) {
        setPromotions(
          promotions.map((promo) =>
            promo.id === id ? { ...promo, active: !active } : promo,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling promotion:", error);
    }
  };

  const handleSendNotification = async (id: string) => {
    if (!confirm("Send notification to all users about this promotion?"))
      return;

    try {
      const response = await fetch(`/api/admin/promotions/${id}/notify`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Notification sent successfully!");
      } else {
        alert("Failed to send notification");
      }
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
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
          Inactive
        </span>
      );
    }

    if (now < startAt) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          Scheduled
        </span>
      );
    }

    if (now > endAt) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
          Expired
        </span>
      );
    }

    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
        Active
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      PERCENTAGE: "bg-blue-100 text-blue-800",
      FIXED: "bg-green-100 text-green-800",
      BOGO: "bg-purple-100 text-purple-800",
      BUNDLE: "bg-orange-100 text-orange-800",
      FLASH: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs ${colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}
      >
        {type}
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Promotion Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage discounts, offers, and promotional campaigns
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Promotion
          </button>
        </div>

        {/* Promotions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupon Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {promotion.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Min Order: ₹{promotion.minOrder || 0}
                        </div>
                        {promotion.products &&
                          promotion.products.length > 0 && (
                            <div className="text-xs text-blue-600">
                              Products: {promotion.products.length}
                            </div>
                          )}
                        {promotion.categories &&
                          promotion.categories.length > 0 && (
                            <div className="text-xs text-green-600">
                              Categories: {promotion.categories.length}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getTypeBadge(promotion.type)}
                        <div className="text-sm text-gray-900">
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
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {promotion.couponCode}
                          </code>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                promotion.couponCode!,
                              )
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No code</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                          onClick={() => setEditingPromotion(promotion)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleActive(promotion.id, promotion.active)
                          }
                          className={`${promotion.active ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}`}
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
                          className="text-red-600 hover:text-red-900"
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
        {promotions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No promotions found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first promotion.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Create Promotion
            </button>
          </div>
        )}
      </div>

      {/* Promotion Form Modal */}
      {showForm && (
        <PromotionFormModal
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
      )}
    </div>
  );
}

// Promotion Form Modal Component
function PromotionFormModal({
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
      const url = promotion
        ? `/api/admin/promotions/${promotion.id}`
        : "/api/admin/promotions";
      const method = promotion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save promotion");
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Failed to save promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {promotion ? "Edit Promotion" : "Create Promotion"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promotion Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED">Fixed Amount</option>
                  <option value="BOGO">Buy 1 Get 1</option>
                  <option value="BUNDLE">Bundle Deal</option>
                  <option value="FLASH">Flash Sale</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      value: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    minOrder: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) =>
                      setFormData({ ...formData, couponCode: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        couponCode: generateCouponCode(),
                      })
                    }
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Uses
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxUses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxUses: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startAt}
                  onChange={(e) =>
                    setFormData({ ...formData, startAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endAt}
                  onChange={(e) =>
                    setFormData({ ...formData, endAt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="combinable"
                  className="ml-2 block text-sm text-gray-900"
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
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="active"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : promotion ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
