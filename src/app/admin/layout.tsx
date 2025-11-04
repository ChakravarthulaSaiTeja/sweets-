"use client";

/**
 * Admin Layout
 * 
 * Separate layout for admin panel that doesn't include
 * the main website navigation and footer.
 * Provides admin-specific navigation sidebar.
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Gift,
  BarChart3,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  Home,
  FolderTree,
} from "lucide-react";

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Promotions",
    href: "/admin/promotions",
    icon: Gift,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF7EE] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-amber-200 flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-amber-200">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#8B1A1A]">Admin Panel</h1>
              <p className="text-xs text-[#8B1A1A]/60">Kotaiah&apos;s Foods</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white shadow-md"
                    : "text-[#8B1A1A] hover:bg-[#FFF7EE]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-amber-200 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#8B1A1A] hover:bg-[#FFF7EE] transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-amber-200 flex flex-col z-50">
            {/* Mobile Header */}
            <div className="p-6 border-b border-amber-200 flex items-center justify-between">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#8B1A1A]">Admin Panel</h1>
                  <p className="text-xs text-[#8B1A1A]/60">Kotaiah&apos;s Foods</p>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[#8B1A1A] hover:text-[#D4AF37]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white shadow-md"
                        : "text-[#8B1A1A] hover:bg-[#FFF7EE]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-amber-200">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#8B1A1A] hover:bg-[#FFF7EE] transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Back to Website</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Mobile Menu */}
        <div className="lg:hidden bg-white border-b border-amber-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#8B1A1A] hover:text-[#D4AF37] p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[#8B1A1A]">Admin</span>
          </Link>
          <Link
            href="/"
            className="text-[#8B1A1A] hover:text-[#D4AF37] p-2"
            title="Back to Website"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

