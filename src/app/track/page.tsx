import { Metadata } from "next";
import { Package, Search, Clock, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Your Order - Kotaiah's Sweets & Foods",
  description: "Track your Kotaiah's Sweets & Foods order in real-time. Get updates on your delivery status and estimated arrival time.",
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-6">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated on your order status and delivery progress
          </p>
        </div>

        {/* Order Tracking Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <div className="text-center mb-8">
            <Package className="h-16 w-16 text-[#C79A2A] mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
              Enter Your Order Details
            </h2>
            <p className="text-gray-600">
              Track your order using your order number or phone number
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                  Order Number
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="orderNumber"
                    placeholder="Enter your order number"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#7B1E2D]/20 focus:border-[#7B1E2D] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-[#C79A2A] group-focus-within:text-[#7B1E2D] transition-colors duration-300" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-semibold">OR</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                  Phone Number
                </label>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#7B1E2D]/20 focus:border-[#7B1E2D] transition-all duration-300 bg-white/70 backdrop-blur-sm text-lg font-medium shadow-inner hover:shadow-lg group-focus-within:shadow-xl"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-[#C79A2A] group-focus-within:text-[#7B1E2D] transition-colors duration-300" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:from-[#C79A2A] hover:to-[#7B1E2D] transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden group"
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

        {/* Order Status Example */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-8 text-center">
            Order Status Updates
          </h2>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800">Order Confirmed</h3>
                <p className="text-green-600 text-sm">Your order has been confirmed and is being prepared</p>
                <p className="text-green-500 text-xs">Today at 10:30 AM</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                📦
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800">Order Packed</h3>
                <p className="text-blue-600 text-sm">Your sweets are packed and ready for delivery</p>
                <p className="text-blue-500 text-xs">Today at 11:15 AM</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                🚚
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800">Out for Delivery</h3>
                <p className="text-yellow-600 text-sm">Your order is on its way to you</p>
                <p className="text-yellow-500 text-xs">Today at 12:00 PM</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-50">
              <div className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-600">Delivered</h3>
                <p className="text-gray-500 text-sm">Order delivered successfully</p>
                <p className="text-gray-400 text-xs">Estimated: Today at 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 text-center">
            <Clock className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#7B1E2D] mb-2">Delivery Time</h3>
            <p className="text-gray-600 text-sm">
              Same day delivery for orders placed before 2 PM
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 text-center">
            <MapPin className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#7B1E2D] mb-2">Live Tracking</h3>
            <p className="text-gray-600 text-sm">
              Real-time location updates via SMS
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 text-center">
            <Package className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#7B1E2D] mb-2">Safe Delivery</h3>
            <p className="text-gray-600 text-sm">
              Temperature-controlled packaging
            </p>
          </div>
        </div>

        {/* Contact for Tracking Issues */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Having Trouble Tracking?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Contact us for immediate assistance with your order
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="bg-white text-[#7B1E2D] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Call Support
              </a>
              <a
                href="/help"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#7B1E2D] transition-all duration-300"
              >
                Get Help
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
