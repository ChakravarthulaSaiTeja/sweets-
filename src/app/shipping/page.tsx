import { Metadata } from "next";
import { Truck, Clock, Shield, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information - Kotaiah's Sweets & Foods",
  description: "Learn about our shipping policies, delivery areas, and estimated delivery times for Kotaiah's Sweets & Foods orders.",
};

export default function ShippingPage() {
  const shippingInfo = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free delivery on orders above ₹500 within Hyderabad city limits"
    },
    {
      icon: Clock,
      title: "Same Day Delivery",
      description: "Orders placed before 2 PM are delivered the same day (subject to availability)"
    },
    {
      icon: Shield,
      title: "Secure Packaging",
      description: "All orders are carefully packaged to maintain freshness and prevent damage"
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      description: "We deliver across Hyderabad and surrounding areas with reasonable delivery charges"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-6">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our delivery and shipping policies
          </p>
        </div>

        {/* Shipping Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {shippingInfo.map((item, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30 text-center">
              <item.icon className="h-16 w-16 text-[#C79A2A] mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-[#7B1E2D] mb-4">
                {item.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-6">
                Delivery Areas & Charges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-3">Within Hyderabad City</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Free delivery on orders above ₹500</li>
                    <li>• ₹50 delivery charge for orders below ₹500</li>
                    <li>• Same day delivery available</li>
                    <li>• Delivery time: 2-4 hours</li>
                  </ul>
                </div>
                <div className="bg-gray-100 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#7B1E2D] mb-3">Surrounding Areas</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• ₹100 delivery charge</li>
                    <li>• Next day delivery</li>
                    <li>• Secunderabad, Cyberabad included</li>
                    <li>• Delivery time: 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-6">
                Delivery Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[#C79A2A] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                  <h3 className="text-lg font-semibold text-[#7B1E2D] mb-2">Order Confirmation</h3>
                  <p className="text-gray-600 text-sm">We confirm your order and prepare it fresh</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#C79A2A] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                  <h3 className="text-lg font-semibold text-[#7B1E2D] mb-2">Packaging</h3>
                  <p className="text-gray-600 text-sm">Carefully package your sweets for safe delivery</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#C79A2A] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                  <h3 className="text-lg font-semibold text-[#7B1E2D] mb-2">Delivery</h3>
                  <p className="text-gray-600 text-sm">Deliver to your doorstep with tracking updates</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-6">
                Important Notes
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>All sweets are made fresh daily and delivered in temperature-controlled packaging</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>Delivery times may vary during festivals and peak seasons</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>We require a valid phone number for delivery coordination</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>Someone must be available to receive the order at the delivery address</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact for Delivery Issues */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Need Help with Delivery?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Contact us for any delivery-related questions or issues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="bg-white text-[#7B1E2D] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Call Delivery Team
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
