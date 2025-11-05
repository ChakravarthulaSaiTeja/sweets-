"use client";

/**
 * Checkout Page
 * 
 * Complete checkout flow for placing orders:
 * - Customer information form
 * - Delivery address form
 * - Delivery date and time slot selection
 * - Payment method selection (COD/Online)
 * - Order summary with totals
 * - Form validation
 * 
 * On successful order, redirects to order confirmation page
 */

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Truck } from "lucide-react";

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    deliveryDate: "",
    deliverySlot: "09:00-12:00",
    paymentMethod: "cod",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (!state?.items || state.items.length === 0) {
      router.push("/cart");
    }
  }, [state, router]);

  /**
   * Handles input field changes and clears associated errors
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Validates all form fields and returns validation status
   * @returns True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";
    if (!formData.deliveryDate) newErrors.deliveryDate = "Delivery date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission and order creation
   * Creates order object via API, clears cart, and redirects to confirmation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Calculate totals
    const subtotal = state?.items?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0;
    const tax = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 50;
    const total = subtotal + tax + shipping;

    // Prepare order data for API
    const orderData = {
      items: state?.items || [],
      addressName: `${formData.firstName} ${formData.lastName}`.trim(),
      addressPhone: (formData.phone || "").replace(/\D/g, ""), // Normalize phone number
      addressStreet: formData.address,
      addressCity: formData.city,
      addressState: formData.state,
      addressPincode: formData.pincode,
      deliveryDate: formData.deliveryDate,
      deliverySlot: formData.deliverySlot,
      paymentMethod: formData.paymentMethod === "cod" ? "COD" : "RAZORPAY",
      subtotal,
      taxAmount: tax,
      shippingAmount: shipping,
      discountAmount: 0,
      totalAmount: total,
      notes: formData.notes || null,
    };

    try {
      // Create order via API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }

      const order = await response.json();

      // Clear cart
      await clearCart();

      // If payment method is online, initiate Razorpay payment
      if (formData.paymentMethod === "online") {
        try {
          // Create Razorpay order
          const paymentResponse = await fetch("/api/payments/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId: order.id }),
          });

          if (!paymentResponse.ok) {
            throw new Error("Failed to create payment order");
          }

          const paymentData = await paymentResponse.json();

          // Load Razorpay script dynamically
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => {
            // Initialize Razorpay checkout
            const options = {
              key: paymentData.key,
              amount: paymentData.amount,
              currency: paymentData.currency,
              order_id: paymentData.orderId,
              name: "Kotaiah's Sweets & Foods",
              description: `Order ${order.orderNumber}`,
              handler: async function (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
              }) {
                // Verify payment
                try {
                  const verifyResponse = await fetch("/api/payments/verify", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                    }),
                  });

                  if (verifyResponse.ok) {
                    // Payment verified, redirect to confirmation
                    router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
                  } else {
                    throw new Error("Payment verification failed");
                  }
                } catch (error) {
                  console.error("Payment verification error:", error);
                  alert("Payment verification failed. Please contact support.");
                }
              },
              prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
              },
              theme: {
                color: "#8B1A1A",
              },
              modal: {
                ondismiss: function () {
                  // User closed the payment modal
                  alert("Payment cancelled. Your order has been created but payment is pending.");
                  router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
                },
              },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
          };
          script.onerror = () => {
            alert("Failed to load payment gateway. Please try again.");
          };
          document.body.appendChild(script);
        } catch (error) {
          console.error("Error initiating payment:", error);
          alert("Failed to initiate payment. Please try again.");
        }
      } else {
        // Redirect to order confirmation for COD
        router.push(`/order-confirmation?orderNumber=${order.orderNumber}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error instanceof Error ? error.message : "Failed to create order. Please try again.");
    }
  };

  if (!state?.items || state.items.length === 0) {
    return null;
  }

  const subtotal = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  // Get tomorrow's date for minimum delivery date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-[#8B1A1A] hover:text-[#D4AF37] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#8B1A1A] mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                        errors.firstName ? "border-red-500" : "border-amber-200"
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                        errors.lastName ? "border-red-500" : "border-amber-200"
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                        errors.email ? "border-red-500" : "border-amber-200"
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                        errors.phone ? "border-red-500" : "border-amber-200"
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#8B1A1A] mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                        errors.address ? "border-red-500" : "border-amber-200"
                      }`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                          errors.city ? "border-red-500" : "border-amber-200"
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                          errors.state ? "border-red-500" : "border-amber-200"
                        }`}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        maxLength={6}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                          errors.pincode ? "border-red-500" : "border-amber-200"
                        }`}
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#8B1A1A] mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  Delivery Options
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      min={minDate}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] ${
                        errors.deliveryDate ? "border-red-500" : "border-amber-200"
                      }`}
                    />
                    {errors.deliveryDate && <p className="text-red-500 text-xs mt-1">{errors.deliveryDate}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                      Delivery Slot
                    </label>
                    <select
                      name="deliverySlot"
                      value={formData.deliverySlot}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
                    >
                      <option value="09:00-12:00">09:00 AM - 12:00 PM</option>
                      <option value="12:00-15:00">12:00 PM - 03:00 PM</option>
                      <option value="15:00-18:00">03:00 PM - 06:00 PM</option>
                      <option value="18:00-21:00">06:00 PM - 09:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-[#8B1A1A] mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-[#D4AF37]" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-amber-200 rounded-lg cursor-pointer hover:border-[#8B1A1A] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-[#8B1A1A] font-medium">Cash on Delivery (COD)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-amber-200 rounded-lg cursor-pointer hover:border-[#8B1A1A] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-[#8B1A1A] font-medium">Online Payment (Coming Soon)</span>
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A]"
                  placeholder="Any special instructions for delivery..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B1A1A] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#D4AF37] hover:text-[#8B1A1A] transition-colors shadow-lg"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-[#8B1A1A] mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-[#8B1A1A]">{item.product.name}</div>
                      <div className="text-sm text-[#8B1A1A]">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-[#8B1A1A] font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-amber-200 pt-4 space-y-2">
                <div className="flex justify-between text-[#8B1A1A]">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#8B1A1A]">
                  <span>Tax (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-[#8B1A1A]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-sm text-[#8B1A1A]">
                    Add {formatPrice(500 - subtotal)} more for free shipping
                  </div>
                )}
                <div className="border-t border-amber-200 pt-2 flex justify-between">
                  <span className="text-lg font-bold text-[#8B1A1A]">Total</span>
                  <span className="text-lg font-bold text-[#8B1A1A]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

