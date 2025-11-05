"use client";

/**
 * Order Tracking Page
 * 
 * Allows users to track their orders by:
 * - Order number search
 * - Phone number search
 * 
 * Displays order status with timeline:
 * - Order Confirmed
 * - Order Packed
 * - Out for Delivery
 * - Delivered
 * 
 * Status is calculated based on time elapsed since order creation.
 * Loads order data from API endpoint.
 */

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Package, Search, MapPin, Phone, Home } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils";

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
  createdAt: string;
}

/**
 * Order status timeline configuration
 * Each status has a label, icon, and color scheme
 */
const orderStatuses = [
  { id: "confirmed", label: "Order Confirmed", icon: "✓", color: "#8B1A1A", bg: "#fff9e6" },
  { id: "packed", label: "Order Packed", icon: "📦", color: "#D4AF37", bg: "#ffedd5" },
  { id: "shipped", label: "Out for Delivery", icon: "🚚", color: "#D4AF37", bg: "#fff7ed" },
  { id: "delivered", label: "Delivered", icon: "✓", color: "#8B1A1A", bg: "#FFF7EE" },
];

/**
 * Calculates current order status based on time elapsed since order creation
 * @param order - Order object with createdAt timestamp
 * @returns Current status ID
 */
function getOrderStatus(order: Order): string {
  const orderDate = new Date(order.createdAt);
  const now = new Date();
  const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

  // Status progression based on time
  if (hoursSinceOrder < 1) return "confirmed";
  if (hoursSinceOrder < 2) return "packed";
  if (hoursSinceOrder < 24) return "shipped";
  return "delivered";
}

/**
 * Track Page Content Component
 * Handles order search and display logic
 */
function TrackPageContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  /**
   * Searches for order by order number or phone number
   * Fetches order from API
   */
  const handleSearch = async () => {
    setError("");
    if (!orderNumber && !phoneNumber) {
      setError("Please enter an order number or phone number");
      return;
    }

    try {
      const params = new URLSearchParams();
      if (orderNumber) params.append("orderNumber", orderNumber);
      if (phoneNumber) params.append("phone", phoneNumber);

      const response = await fetch(`/api/orders/track?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch order");
      }

      const orders = await response.json();
      
      if (orders && orders.length > 0) {
        // Use the first order (most recent if multiple)
        const foundOrder = orders[0];
        // Transform API response to match expected format
        setOrder({
          orderNumber: foundOrder.orderNumber,
          items: foundOrder.orderItems.map((item: any) => ({
            product: {
              id: item.product.id,
              name: item.product.name,
              price: item.price,
              images: item.product.images || [],
              slug: item.product.slug,
            },
            quantity: item.quantity,
          })),
          customer: {
            firstName: foundOrder.addressName.split(" ")[0] || "",
            lastName: foundOrder.addressName.split(" ").slice(1).join(" ") || "",
            email: "",
            phone: foundOrder.addressPhone,
          },
          address: {
            street: foundOrder.addressStreet,
            city: foundOrder.addressCity,
            state: foundOrder.addressState,
            pincode: foundOrder.addressPincode,
          },
          delivery: {
            date: foundOrder.deliveryDate ? new Date(foundOrder.deliveryDate).toISOString().split("T")[0] : "",
            slot: foundOrder.deliverySlot || "",
          },
          payment: {
            method: foundOrder.paymentMethod || "COD",
          },
          totals: {
            subtotal: foundOrder.subtotal,
            tax: foundOrder.taxAmount,
            shipping: foundOrder.shippingAmount,
            total: foundOrder.totalAmount,
          },
          status: foundOrder.status || "PENDING",
          createdAt: foundOrder.createdAt,
        });
      } else {
        setError("Order not found. Please check your order number or phone number.");
        setOrder(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
      setOrder(null);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const currentStatus = order ? getOrderStatus(order) : "";
  const currentStatusIndex = orderStatuses.findIndex((s) => s.id === currentStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#D4AF37]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] bg-clip-text text-transparent mb-6">
            Track Your Order
          </h1>
          <p className="text-xl text-[#8B1A1A] max-w-2xl mx-auto">
            Stay updated on your order status and delivery progress
          </p>
        </div>

        {/* Order Tracking Form */}
        {!order && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
            <div className="text-center mb-8">
              <Package className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
              <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                Enter Your Order Details
              </h2>
              <p className="text-[#8B1A1A]">
                Track your order using your order number or phone number
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-semibold text-[#8B1A1A] mb-3">
                    Order Number
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Enter your order number"
                      className="w-full px-5 py-4 border-2 border-amber-200 rounded-2xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium text-[#8B1A1A] shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Package className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-amber-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-[#8B1A1A] font-semibold">OR</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-[#8B1A1A] mb-3">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-5 py-4 border-2 border-amber-200 rounded-2xl focus:ring-4 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium text-[#8B1A1A] shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-[#D4AF37] group-focus-within:text-[#8B1A1A] transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-[#D4AF37] hover:to-[#8B1A1A] transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    <Search className="h-6 w-6 mr-3 animate-pulse group-hover:animate-spin" />
                    <span className="text-lg font-bold">Track My Order</span>
                  </div>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Order Status */}
        {order && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-[#8B1A1A]">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-sm text-[#8B1A1A] mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOrder(null);
                    setOrderNumber("");
                    setPhoneNumber("");
                  }}
                  className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
                >
                  Search Another Order
                </button>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-[#8B1A1A] mb-6">Order Status</h3>
            <div className="space-y-4">
              {orderStatuses.map((status, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div
                    key={status.id}
                    className={`flex items-center space-x-4 p-4 border rounded-xl transition-all ${
                      isActive
                        ? `bg-[${status.bg}] border-[${status.color}]`
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                    style={{
                      backgroundColor: isActive ? status.bg : "#f9fafb",
                      borderColor: isActive ? status.color : "#e5e7eb",
                    }}
                  >
                    <div
                      className={`text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold`}
                      style={{ backgroundColor: isActive ? status.color : "#9ca3af" }}
                    >
                      {status.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isActive ? "text-[#8B1A1A]" : "text-gray-500"}`}>
                        {status.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs text-[#D4AF37]">(Current)</span>
                        )}
                      </h4>
                      {isCurrent && (
                        <p className="text-sm text-[#8B1A1A] mt-1">
                          Expected delivery: {new Date(order.delivery.date).toLocaleDateString()} ({order.delivery.slot})
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Details */}
            <div className="mt-8 pt-8 border-t border-amber-200">
              <h3 className="text-xl font-semibold text-[#8B1A1A] mb-4">Order Details</h3>
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-amber-100">
                    <div className="flex-1">
                      <div className="font-medium text-[#8B1A1A]">{item.product.name}</div>
                      <div className="text-sm text-[#8B1A1A]">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-[#8B1A1A] font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-amber-200">
                <div className="flex justify-between text-lg font-bold text-[#8B1A1A]">
                  <span>Total</span>
                  <span>{formatPrice(order.totals.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-6 pt-6 border-t border-amber-200">
              <h3 className="text-xl font-semibold text-[#8B1A1A] mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-[#D4AF37]" />
                Delivery Address
              </h3>
              <div className="text-[#8B1A1A]">
                <div className="font-medium">{order.customer.firstName} {order.customer.lastName}</div>
                <div className="mt-1">{order.address.street}</div>
                <div>{order.address.city}, {order.address.state} - {order.address.pincode}</div>
                <div className="mt-2">Phone: {order.customer.phone}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {order && (
          <div className="flex justify-center">
            <Link
              href="/"
              className="bg-[#8B1A1A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-[#8B1A1A] transition-colors flex items-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="text-[#8B1A1A]">Loading...</div>
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  );
}
