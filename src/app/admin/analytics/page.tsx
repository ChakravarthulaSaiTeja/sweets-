"use client";

/**
 * Admin Analytics Page
 * 
 * Displays:
 * - Sales overview and trends
 * - Revenue charts
 * - Top selling products
 * - Customer metrics
 * - Order status distribution
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, DollarSign, ShoppingCart, Users, BarChart3 } from "lucide-react";
import { formatPrice } from "@/utils";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  ordersByStatus: Record<string, number>;
  revenueByDay: Array<{ date: string; revenue: number }>;
}

// OrderItem and Order interfaces removed - not used in this component

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const analytics = await response.json();
      
      // Calculate total revenue
      const totalRevenue = analytics.totalRevenue || 0;

      // Calculate average order value
      const averageOrderValue = analytics.totalOrders > 0 ? totalRevenue / analytics.totalOrders : 0;

      // Use analytics data from API
      const ordersByStatus = analytics.ordersByStatus || {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
      };

      // Calculate top products from recent orders if available
      const topProducts: Array<{ name: string; quantity: number; revenue: number }> = [];
      if (analytics.recentOrders && analytics.recentOrders.length > 0) {
        const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
        analytics.recentOrders.forEach((order: any) => {
          order.orderItems?.forEach((item: any) => {
            const productName = item.variant?.product?.name || "Unknown Product";
            const existing = productMap.get(productName) || {
              name: productName,
              quantity: 0,
              revenue: 0,
            };
            productMap.set(productName, {
              name: productName,
              quantity: existing.quantity + item.quantity,
              revenue: existing.revenue + (Number(item.price) * item.quantity),
            });
          });
        });
        topProducts.push(...Array.from(productMap.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 10));
      }

      // Revenue by day (last 7 days) - simplified calculation
      const revenueByDay: Array<{ date: string; revenue: number }> = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        revenueByDay.push({ date: dateStr, revenue: 0 }); // Will be calculated from orders if needed
      }

      setData({
        totalRevenue,
        totalOrders: analytics.totalOrders || 0,
        averageOrderValue,
        totalCustomers: analytics.totalUsers || 0,
        topProducts,
        ordersByStatus,
        revenueByDay,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8B1A1A]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-[#8B1A1A]/50 mx-auto mb-4" />
          <p className="text-[#8B1A1A]">No analytics data available</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.revenueByDay.map((d) => d.revenue), 1);

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
              <h1 className="text-3xl font-bold text-[#8B1A1A] mt-2">Analytics Dashboard</h1>
              <p className="text-[#8B1A1A] mt-1">Sales and performance metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#ffedd5] rounded-lg">
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A]">Total Revenue</p>
                <p className="text-2xl font-bold text-[#8B1A1A]">
                  {formatPrice(data.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#fff9e6] rounded-lg">
                <ShoppingCart className="h-6 w-6 text-[#8B1A1A]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A]">Total Orders</p>
                <p className="text-2xl font-bold text-[#8B1A1A]">{data.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A]">Avg Order Value</p>
                <p className="text-2xl font-bold text-[#8B1A1A]">
                  {formatPrice(data.averageOrderValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A]">Total Customers</p>
                <p className="text-2xl font-bold text-[#8B1A1A]">{data.totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Revenue Trend (Last 7 Days)</h3>
            <div className="space-y-3">
              {data.revenueByDay.map((day, index) => {
                const percentage = (day.revenue / maxRevenue) * 100;
                const date = new Date(day.date);
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-xs text-[#8B1A1A]">
                      {date.toLocaleDateString("en-IN", { weekday: "short" })}
                    </div>
                    <div className="flex-1 bg-[#FFF7EE] rounded-full h-8 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      >
                        {day.revenue > 0 && (
                          <span className="text-xs font-semibold text-white">
                            {formatPrice(day.revenue)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Top Selling Products</h3>
            <div className="space-y-3">
              {data.topProducts.length > 0 ? (
                data.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#FFF7EE] rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#8B1A1A] text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-[#8B1A1A]">{product.name}</p>
                        <p className="text-xs text-[#8B1A1A]/70">
                          {product.quantity} sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#8B1A1A]">
                        {formatPrice(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#8B1A1A]/70 text-center py-8">No sales data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Orders by Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(data.ordersByStatus).map(([status, count]) => (
              <div
                key={status}
                className="bg-[#FFF7EE] rounded-lg p-4 text-center"
              >
                <p className="text-2xl font-bold text-[#8B1A1A]">{count}</p>
                <p className="text-sm text-[#8B1A1A]/70 capitalize mt-1">{status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
