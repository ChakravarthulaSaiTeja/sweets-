"use client";

/**
 * Admin Orders Management Page
 * 
 * Allows admins to:
 * - View all orders
 * - Filter orders by status
 * - Update order status
 * - View order details
 * - Search orders
 * - Export orders
 */

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, Package, X } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils";
import Image from "next/image";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

interface Order {
  orderNumber: string;
  items: OrderItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  delivery: {
    date: string;
    slot: string;
  };
  payment: {
    method: string;
  };
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  status?: string;
  createdAt: string;
}

const orderStatuses = [
  { value: "all", label: "All Orders", color: "#8B1A1A" },
  { value: "confirmed", label: "Confirmed", color: "#8B1A1A", icon: CheckCircle },
  { value: "packed", label: "Packed", color: "#D4AF37", icon: Package },
  { value: "shipped", label: "Shipped", color: "#D4AF37", icon: Truck },
  { value: "delivered", label: "Delivered", color: "#10b981", icon: CheckCircle },
  { value: "cancelled", label: "Cancelled", color: "#ef4444", icon: XCircle },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        // Add status if not present (for older orders)
        const ordersWithStatus = parsed.map((order: Order) => ({
          ...order,
          status: order.status || getOrderStatus(order),
        }));
        setOrders(ordersWithStatus);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = (order: Order): string => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceOrder < 1) return "confirmed";
    if (hoursSinceOrder < 2) return "packed";
    if (hoursSinceOrder < 24) return "shipped";
    return "delivered";
  };

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.phone.includes(searchQuery)
      );
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = (orderNumber: string, newStatus: string) => {
    const updated = orders.map((o) =>
      o.orderNumber === orderNumber ? { ...o, status: newStatus } : o
    );
    saveOrders(updated);
    if (selectedOrder?.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = orderStatuses.find((s) => s.value === status);
    return statusConfig?.color || "#8B1A1A";
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
              <h1 className="text-3xl font-bold text-[#8B1A1A] mt-2">Orders Management</h1>
              <p className="text-[#8B1A1A] mt-1">
                Manage customer orders ({orders.length} total orders)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8B1A1A]/60 group-focus-within:text-[#8B1A1A] w-5 h-5 transition-colors z-10" />
              <input
                type="text"
                placeholder="Search by order number, name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] placeholder:text-[#8B1A1A]/50 transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              />
            </div>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8B1A1A]/60 group-focus-within:text-[#8B1A1A] w-5 h-5 transition-colors z-10 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] appearance-none cursor-pointer transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              >
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
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

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200">
              <thead className="bg-[#FFF7EE]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#8B1A1A] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-200">
                {filteredOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-[#FFF7EE]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#8B1A1A]">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8B1A1A]">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="text-xs text-[#8B1A1A]/70">{order.customer.email}</div>
                      <div className="text-xs text-[#8B1A1A]/70">{order.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#8B1A1A]">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-[#8B1A1A]/70">
                        {order.items.map((item) => item.product.name).join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#8B1A1A]">
                        {formatPrice(order.totals.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status || "confirmed"}
                        onChange={(e) => updateOrderStatus(order.orderNumber, e.target.value)}
                        className="px-3 py-1 rounded-full text-xs font-semibold border-2 transition-colors focus:ring-2 focus:ring-[#8B1A1A]"
                        style={{
                          backgroundColor: `${getStatusColor(order.status || "confirmed")}20`,
                          color: getStatusColor(order.status || "confirmed"),
                          borderColor: getStatusColor(order.status || "confirmed"),
                        }}
                      >
                        {orderStatuses
                          .filter((s) => s.value !== "all")
                          .map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#8B1A1A]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-[#8B1A1A]/70">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#8B1A1A]/50 mx-auto mb-4" />
              <p className="text-[#8B1A1A]">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(newStatus) => {
            updateOrderStatus(selectedOrder.orderNumber, newStatus);
          }}
        />
      )}
    </div>
  );
}

// Order Detail Modal Component
function OrderDetailModal({
  order,
  onClose,
  onStatusUpdate,
}: {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-amber-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#8B1A1A]">Order Details - {order.orderNumber}</h2>
          <button
            onClick={onClose}
            className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Customer Information</h3>
            <div className="bg-[#FFF7EE] rounded-lg p-4 space-y-2">
              <p className="text-sm text-[#8B1A1A]">
                <span className="font-medium">Name:</span> {order.customer.firstName}{" "}
                {order.customer.lastName}
              </p>
              <p className="text-sm text-[#8B1A1A]">
                <span className="font-medium">Email:</span> {order.customer.email}
              </p>
              <p className="text-sm text-[#8B1A1A]">
                <span className="font-medium">Phone:</span> {order.customer.phone}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Delivery Address</h3>
            <div className="bg-[#FFF7EE] rounded-lg p-4">
              <p className="text-sm text-[#8B1A1A]">{order.address.street}</p>
              <p className="text-sm text-[#8B1A1A]">
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p className="text-sm text-[#8B1A1A] mt-2">
                <span className="font-medium">Delivery Date:</span>{" "}
                {new Date(order.delivery.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-[#8B1A1A]">
                <span className="font-medium">Time Slot:</span> {order.delivery.slot}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-[#FFF7EE] rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.images[0] || "/images/placeholder-product.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[#8B1A1A]">{item.product.name}</p>
                      <p className="text-sm text-[#8B1A1A]/70">
                        Quantity: {item.quantity} × {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#8B1A1A]">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Order Summary</h3>
            <div className="bg-[#FFF7EE] rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm text-[#8B1A1A]">
                <span>Subtotal:</span>
                <span>{formatPrice(order.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#8B1A1A]">
                <span>Tax (18%):</span>
                <span>{formatPrice(order.totals.tax)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#8B1A1A]">
                <span>Shipping:</span>
                <span>{formatPrice(order.totals.shipping)}</span>
              </div>
              <div className="border-t border-amber-200 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg text-[#8B1A1A]">
                  <span>Total:</span>
                  <span>{formatPrice(order.totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Payment Information</h3>
            <div className="bg-[#FFF7EE] rounded-lg p-4">
              <p className="text-sm text-[#8B1A1A]">
                <span className="font-medium">Payment Method:</span>{" "}
                {order.payment.method === "cod" ? "Cash on Delivery" : "Online Payment"}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4">Update Status</h3>
            <select
              value={order.status || "confirmed"}
              onChange={(e) => onStatusUpdate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] text-[#8B1A1A] font-semibold"
              style={{
                backgroundColor: `${getStatusColor(order.status || "confirmed")}20`,
                color: getStatusColor(order.status || "confirmed"),
                borderColor: getStatusColor(order.status || "confirmed"),
              }}
            >
              {orderStatuses
                .filter((s) => s.value !== "all")
                .map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  const statusConfig = orderStatuses.find((s) => s.value === status);
  return statusConfig?.color || "#8B1A1A";
}
