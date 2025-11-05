"use client";

/**
 * Shopping Cart Page
 * 
 * Displays cart items with:
 * - Product images and details
 * - Quantity controls (increment/decrement)
 * - Remove item functionality
 * - Order summary (subtotal, tax, shipping, total)
 * - Proceed to checkout button
 * 
 * Calculates totals including 18% tax and free shipping over ₹500
 */

import { useCart } from "@/contexts/cart-context";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const {
    state,
    removeFromCart,
    updateQuantity: updateCartQuantity,
  } = useCart();

  /**
   * Formats price in Indian Rupee format
   */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  /**
   * Updates item quantity or removes if quantity reaches 0
   */
  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
    } else {
      updateCartQuantity(variantId, quantity);
    }
  };

  /**
   * Removes an item from the cart
   */
  const handleRemoveItem = (variantId: string) => {
    removeFromCart(variantId);
  };

  const subtotal =
    state?.items?.reduce(
      (total, item) => total + (item.variant?.price || item.product.price) * item.quantity,
      0,
    ) || 0;
  const tax = subtotal * 0.18; // 18% tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const total = subtotal + tax + shipping;

  if (!state?.items || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF7EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-[#FFF7EE] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-[#8B1A1A]" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
              Your cart is empty
            </h1>
            <p className="text-[#8B1A1A] mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products/sweets"
              className="bg-[#8B1A1A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D4AF37] hover:text-[#8B1A1A] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-[#8B1A1A] hover:text-[#8B1A1A] transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#8B1A1A]">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#fff9e6]">
                <h2 className="text-xl font-semibold text-[#8B1A1A]">
                  Cart Items ({state.items.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-[#FFF7EE] rounded-lg overflow-hidden">
                          <Image
                            src={
                              item.product.images[0] ||
                              "/images/placeholder-product.svg"
                            }
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-[#8B1A1A]">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-[#8B1A1A]">
                          Product ID: {item.productId}
                        </p>
                        <div className="text-lg font-semibold text-[#8B1A1A] mt-1">
                          {formatPrice(item.product.price)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.variantId,
                              item.quantity - 1,
                            )
                          }
                          className="p-1 rounded-full hover:bg-[#FFF7EE] transition-colors"
                        >
                          <Minus className="h-4 w-4 text-[#8B1A1A]" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.variantId,
                              item.quantity + 1,
                            )
                          }
                          className="p-1 rounded-full hover:bg-[#FFF7EE] transition-colors"
                        >
                          <Plus className="h-4 w-4 text-[#8B1A1A]" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-lg font-semibold text-[#8B1A1A]">
                        {formatPrice((item.variant?.price || item.product.price) * item.quantity)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.variantId)}
                        className="p-2 text-[#FFB347] hover:bg-[#fee2e2] rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-[#8B1A1A] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#8B1A1A]">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8B1A1A]">Tax (18%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8B1A1A]">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-[#8B1A1A]">
                    Add {formatPrice(500 - subtotal)} more for free shipping
                  </div>
                )}

                <div className="border-t border-[#fff9e6] pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-[#8B1A1A]">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-[#8B1A1A]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-[#8B1A1A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#D4AF37] hover:text-[#8B1A1A] transition-colors mt-6 block text-center"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4 text-center">
                <Link
                  href="/products/sweets"
                  className="text-sm text-[#8B1A1A] hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
