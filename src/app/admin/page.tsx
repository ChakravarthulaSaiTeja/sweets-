"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  Gift,
  BarChart3,
  Calendar,
  AlertCircle
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  activePromotions: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activePromotions: 0,
  });
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Implement actual API endpoints for dashboard stats
      // For now, using placeholder data
      setStats({
        totalProducts: 24,
        totalOrders: 156,
        totalUsers: 89,
        totalRevenue: 125000,
        activePromotions: 3,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B1E2D]"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  const adminMenuItems = [
    {
      title: "Products",
      description: "Manage product catalog",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500",
      stats: stats.totalProducts,
    },
    {
      title: "Orders",
      description: "View and manage orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-500",
      stats: stats.totalOrders,
    },
    {
      title: "Customers",
      description: "Manage customer accounts",
      icon: Users,
      href: "/admin/customers",
      color: "bg-purple-500",
      stats: stats.totalUsers,
    },
    {
      title: "Promotions",
      description: "Create and manage promotions",
      icon: Gift,
      href: "/admin/promotions",
      color: "bg-orange-500",
      stats: stats.activePromotions,
    },
    {
      title: "Analytics",
      description: "View sales and performance data",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-indigo-500",
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {session.user?.name || "Admin"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-[#7B1E2D]">
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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Gift className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Promotions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePromotions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Menu */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Admin Tools</h2>
            <p className="text-gray-600 mt-1">
              Manage your e-commerce platform
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start">
                      <div className={`p-3 ${item.color} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#7B1E2D] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.description}
                        </p>
                        {item.stats !== undefined && (
                          <p className="text-[#7B1E2D] font-bold text-sm mt-2">
                            {item.stats} {item.title.toLowerCase()}
                          </p>
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
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New order received</p>
                  <p className="text-xs text-gray-500">Order #12345 - ₹2,500</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">2 hours ago</div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Product updated</p>
                  <p className="text-xs text-gray-500">Gulab Jamun - Price updated</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">4 hours ago</div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Gift className="h-4 w-4 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Promotion created</p>
                  <p className="text-xs text-gray-500">Diwali Special - 20% OFF</p>
                </div>
                <div className="ml-auto text-xs text-gray-500">1 day ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Development Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Development Mode
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                This admin dashboard is currently in development. Some features may not be fully implemented yet. 
                The promotions management is available at <Link href="/admin/promotions" className="underline font-medium">/admin/promotions</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
