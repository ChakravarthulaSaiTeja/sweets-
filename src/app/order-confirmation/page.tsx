"use client";

/**
 * Order Confirmation Page
 * 
 * Displays order confirmation details after successful checkout:
 * - Order number and date
 * - Ordered items with quantities and prices
 * - Delivery information (address, date, time slot)
 * - Payment summary (totals, payment method)
 * - Links to track order or continue shopping
 * 
 * Loads order data from localStorage using order number from URL query parameter
 */

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home, Receipt } from "lucide-react";
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

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderNumber) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const foundOrder = orders.find((o: Order) => o.orderNumber === orderNumber);
      setOrder(foundOrder || null);
    }
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#8B1A1A] mb-4">Order Not Found</h1>
          <p className="text-[#8B1A1A] mb-8">Unable to find your order details.</p>
          <Link
            href="/"
            className="bg-[#8B1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#D4AF37] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B1A1A] rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-[#8B1A1A] mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-[#8B1A1A]">
            Thank you for your order. We&apos;ve received your order and will begin processing it right away.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-200">
            <div>
              <h2 className="text-2xl font-semibold text-[#8B1A1A]">Order Details</h2>
              <p className="text-sm text-[#8B1A1A] mt-1">Order Number: {order.orderNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#8B1A1A]">Order Date</div>
              <div className="font-medium text-[#8B1A1A]">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-[#D4AF37]" />
              Items Ordered
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-amber-100">
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
          </div>

          {/* Delivery Information */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-3 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-[#D4AF37]" />
              Delivery Information
            </h3>
            <div className="space-y-2 text-[#8B1A1A]">
              <div>
                <span className="font-medium">Name:</span> {order.customer.firstName} {order.customer.lastName}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {order.customer.phone}
              </div>
              <div>
                <span className="font-medium">Email:</span> {order.customer.email}
              </div>
              <div className="mt-2">
                <span className="font-medium">Address:</span>
                <div className="ml-20">
                  {order.address.street}
                  <br />
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium">Delivery Date:</span> {new Date(order.delivery.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Delivery Slot:</span> {order.delivery.slot}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-amber-200 pt-4">
            <h3 className="text-lg font-semibold text-[#8B1A1A] mb-4 flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-[#D4AF37]" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-[#8B1A1A]">
                <span>Subtotal</span>
                <span>{formatPrice(order.totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#8B1A1A]">
                <span>Tax (18%)</span>
                <span>{formatPrice(order.totals.tax)}</span>
              </div>
              <div className="flex justify-between text-[#8B1A1A]">
                <span>Shipping</span>
                <span>{order.totals.shipping === 0 ? "Free" : formatPrice(order.totals.shipping)}</span>
              </div>
              <div className="border-t border-amber-200 pt-2 flex justify-between">
                <span className="text-lg font-bold text-[#8B1A1A]">Total</span>
                <span className="text-lg font-bold text-[#8B1A1A]">{formatPrice(order.totals.total)}</span>
              </div>
              <div className="mt-2 text-sm text-[#8B1A1A]">
                Payment Method: {order.payment.method === "cod" ? "Cash on Delivery" : "Online Payment"}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/track?orderNumber=${order.orderNumber}`}
            className="bg-[#8B1A1A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-[#8B1A1A] transition-colors text-center"
          >
            Track Your Order
          </Link>
          <Link
            href="/"
            className="bg-white text-[#8B1A1A] border-2 border-[#8B1A1A] px-8 py-3 rounded-lg font-semibold hover:bg-[#8B1A1A] hover:text-white transition-colors text-center flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7EE]">
        <div className="text-[#8B1A1A]">Loading...</div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}

