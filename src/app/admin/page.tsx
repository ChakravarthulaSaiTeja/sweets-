"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  Gift,
  BarChart3
} from "lucide-react";
import { formatPrice } from "@/utils";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  activePromotions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activePromotions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const analytics = await response.json();
      
      setStats({
        totalProducts: analytics.totalProducts || 0,
        totalOrders: analytics.totalOrders || 0,
        totalUsers: analytics.totalUsers || 0,
        totalRevenue: Number(analytics.totalRevenue) || 0,
        activePromotions: analytics.activePromotions || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Fallback to placeholder data
      setStats({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        activePromotions: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8B1A1A]"></div>
      </div>
    );
  }

  const adminMenuItems = [
    {
      title: "Products",
      description: "Manage product catalog",
      icon: Package,
      href: "/admin/products",
      gradient: "from-[#8B1A1A] to-[#D4AF37]",
      iconBg: "bg-gradient-to-br from-[#8B1A1A] to-[#A02020]",
      iconColor: "text-white",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(139,26,26,0.4)]",
      stats: stats.totalProducts,
    },
    {
      title: "Categories",
      description: "Manage product categories",
      icon: Package,
      href: "/admin/categories",
      gradient: "from-[#D4AF37] to-[#FFB347]",
      iconBg: "bg-gradient-to-br from-[#D4AF37] to-[#E5C050]",
      iconColor: "text-white",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
    },
    {
      title: "Orders",
      description: "View and manage orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      gradient: "from-[#8B1A1A] to-[#FFB347]",
      iconBg: "bg-gradient-to-br from-[#8B1A1A] to-[#D4AF37]",
      iconColor: "text-white",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(139,26,26,0.4)]",
      stats: stats.totalOrders,
    },
    {
      title: "Promotions",
      description: "Create and manage promotions",
      icon: Gift,
      href: "/admin/promotions",
      gradient: "from-[#FFB347] to-[#D4AF37]",
      iconBg: "bg-gradient-to-br from-[#FFB347] to-[#FFC973]",
      iconColor: "text-white",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(255,179,71,0.4)]",
      stats: stats.activePromotions,
    },
    {
      title: "Analytics",
      description: "View sales and performance data",
      icon: BarChart3,
      href: "/admin/analytics",
      gradient: "from-[#8B1A1A] via-[#D4AF37] to-[#FFB347]",
      iconBg: "bg-gradient-to-br from-[#8B1A1A] to-[#D4AF37]",
      iconColor: "text-white",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: Settings,
      href: "/admin/settings",
      gradient: "from-[#D4AF37] to-[#8B1A1A]",
      iconBg: "bg-gradient-to-br from-[#D4AF37] to-[#B8941F]",
      iconColor: "text-white",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#fff9e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#8B1A1A]">Admin Dashboard</h1>
              <p className="text-[#8B1A1A] mt-1">
                Welcome back, Admin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-[#8B1A1A]">Total Revenue</p>
                <p className="text-2xl font-bold text-[#8B1A1A]">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-white to-[#FFF7EE] rounded-xl shadow-lg hover:shadow-2xl border-2 border-amber-100 hover:border-[#D4AF37] p-6 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/0 via-[#D4AF37]/0 to-[#FFB347]/0 group-hover:from-[#8B1A1A]/10 group-hover:via-[#D4AF37]/10 group-hover:to-[#FFB347]/10 transition-all duration-500 rounded-xl"></div>
            <div className="relative z-10 flex items-center">
              <div className="p-3 bg-gradient-to-br from-[#8B1A1A] to-[#D4AF37] rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A] group-hover:text-[#8B1A1A] transition-colors">Total Products</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] bg-clip-text text-transparent">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-[#FFF7EE] rounded-xl shadow-lg hover:shadow-2xl border-2 border-amber-100 hover:border-[#D4AF37] p-6 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/0 via-[#D4AF37]/0 to-[#FFB347]/0 group-hover:from-[#8B1A1A]/10 group-hover:via-[#D4AF37]/10 group-hover:to-[#FFB347]/10 transition-all duration-500 rounded-xl"></div>
            <div className="relative z-10 flex items-center">
              <div className="p-3 bg-gradient-to-br from-[#D4AF37] to-[#FFB347] rounded-xl shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A] group-hover:text-[#8B1A1A] transition-colors">Total Orders</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFB347] bg-clip-text text-transparent">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-[#FFF7EE] rounded-xl shadow-lg hover:shadow-2xl border-2 border-amber-100 hover:border-[#D4AF37] p-6 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/0 via-[#D4AF37]/0 to-[#FFB347]/0 group-hover:from-[#8B1A1A]/10 group-hover:via-[#D4AF37]/10 group-hover:to-[#FFB347]/10 transition-all duration-500 rounded-xl"></div>
            <div className="relative z-10 flex items-center">
              <div className="p-3 bg-gradient-to-br from-[#8B1A1A] to-[#A02020] rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(139,26,26,0.5)]">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A] group-hover:text-[#8B1A1A] transition-colors">Total Users</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#8B1A1A] to-[#A02020] bg-clip-text text-transparent">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white to-[#FFF7EE] rounded-xl shadow-lg hover:shadow-2xl border-2 border-amber-100 hover:border-[#D4AF37] p-6 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/0 via-[#D4AF37]/0 to-[#FFB347]/0 group-hover:from-[#8B1A1A]/10 group-hover:via-[#D4AF37]/10 group-hover:to-[#FFB347]/10 transition-all duration-500 rounded-xl"></div>
            <div className="relative z-10 flex items-center">
              <div className="p-3 bg-gradient-to-br from-[#FFB347] to-[#D4AF37] rounded-xl shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,179,71,0.5)]">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#8B1A1A] group-hover:text-[#8B1A1A] transition-colors">Active Promotions</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#FFB347] to-[#D4AF37] bg-clip-text text-transparent">{stats.activePromotions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="bg-gradient-to-br from-white to-[#FFF7EE] rounded-xl shadow-lg border-2 border-amber-100 hover:border-[#D4AF37] transition-all duration-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-[#FFF7EE] to-white">
            <h2 className="text-xl font-bold text-[#8B1A1A] flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#D4AF37]" />
              Admin Tools
            </h2>
            <p className="text-[#8B1A1A]/70 mt-1">
              Manage your e-commerce platform
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group block p-6 bg-gradient-to-br from-white to-[#FFF7EE] hover:from-[#FFF7EE] hover:to-white rounded-xl border-2 border-amber-100 hover:border-[#D4AF37] transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeIn 0.6s ease-out forwards'
                    }}
                  >
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl`}></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-xl pointer-events-none"></div>
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-xl ${item.hoverGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                    
                    <div className="relative z-10 flex items-start">
                      <div className={`p-4 ${item.iconBg} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${item.hoverGlow} group-hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]`}>
                        <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold text-[#8B1A1A] group-hover:text-[#8B1A1A] transition-colors flex items-center gap-2">
                          {item.title}
                          <svg className="w-4 h-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </h3>
                        <p className="text-[#8B1A1A]/80 text-sm mt-1 group-hover:text-[#8B1A1A] transition-colors">
                          {item.description}
                        </p>
                        {item.stats !== undefined && (
                          <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#8B1A1A]/10 to-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-all duration-300">
                            <span className="text-[#8B1A1A] font-bold text-sm">
                              {item.stats} {item.title.toLowerCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gradient-to-br from-white to-[#FFF7EE] rounded-xl shadow-lg border-2 border-amber-100 hover:border-[#D4AF37] transition-all duration-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-[#FFF7EE] to-white">
            <h2 className="text-xl font-bold text-[#8B1A1A] flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
              Recent Orders
            </h2>
          </div>
          <div className="p-6">
            <RecentOrdersList />
          </div>
        </div>

      </div>
    </div>
  );
}

// Recent Orders Component
interface RecentOrder {
  orderNumber: string;
  customer?: {
    firstName?: string;
    lastName?: string;
  };
  totals?: {
    total?: number;
  };
  createdAt: string;
}

function RecentOrdersList() {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        const response = await fetch("/api/admin/orders?limit=5");
        if (response.ok) {
          const orders = await response.json();
          // Transform API orders to match component format
          const transformedOrders: RecentOrder[] = orders.slice(0, 5).map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customer: {
              name: order.addressName || "Customer",
              email: order.user?.email || "",
            },
            totals: {
              total: Number(order.totalAmount) || 0,
            },
            createdAt: order.createdAt,
          }));
          setRecentOrders(transformedOrders);
        } else {
          console.error("Failed to load recent orders");
        }
      } catch (error) {
        console.error("Error loading recent orders:", error);
      }
    };
    loadRecentOrders();
  }, []);

  if (recentOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="w-12 h-12 text-[#8B1A1A]/50 mx-auto mb-4" />
        <p className="text-[#8B1A1A]">No recent orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentOrders.map((order) => {
        const timeAgo = getTimeAgo(new Date(order.createdAt));
        return (
          <Link
            key={order.orderNumber}
            href={`/admin/orders`}
            className="group flex items-center p-4 bg-gradient-to-r from-[#FFF7EE] to-white hover:from-[#fff9e6] hover:to-[#FFF7EE] rounded-xl border-2 border-amber-100 hover:border-[#D4AF37] transition-all duration-300 transform hover:-translate-x-1 hover:shadow-md"
          >
            <div className="p-2.5 bg-gradient-to-br from-[#8B1A1A] to-[#D4AF37] rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold text-[#8B1A1A] group-hover:text-[#8B1A1A] transition-colors">
                Order #{order.orderNumber}
              </p>
              <p className="text-xs text-[#8B1A1A]/70 group-hover:text-[#8B1A1A] transition-colors">
                {order.customer?.firstName} {order.customer?.lastName} - {formatPrice(order.totals?.total || 0)}
              </p>
            </div>
            <div className="ml-auto text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">{timeAgo}</div>
          </Link>
        );
      })}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}
