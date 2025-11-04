import { Metadata } from "next";
import { RotateCcw, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy - Kotaiah's Foods",
  description: "Learn about our refund policy for Kotaiah's Foods. Easy refunds within 24 hours of delivery.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#D4AF37]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] bg-clip-text text-transparent mb-6">
            Refund Policy
          </h1>
          <p className="text-xl text-[#8B1A1A] max-w-2xl mx-auto">
            Our commitment to your satisfaction with transparent refund policies
          </p>
          <p className="text-sm text-[#8B1A1A] mt-4">
            Last updated: December 2024
          </p>
        </div>

        {/* Refund Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <div className="text-center mb-8">
            <RotateCcw className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
              Our Refund Promise
            </h2>
            <p className="text-[#8B1A1A]">
              We stand behind the quality of our products and your satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#fff9e6] border border-[#fff3cc] rounded-xl p-6 text-center">
              <CheckCircle className="h-12 w-12 text-[#8B1A1A] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#8B1A1A] mb-2">24-Hour Window</h3>
              <p className="text-[#8B1A1A] text-sm">Full refunds within 24 hours of delivery</p>
            </div>
            <div className="bg-[#ffedd5] border border-[#fed7aa] rounded-xl p-6 text-center">
              <Clock className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">Quick Processing</h3>
              <p className="text-[#D4AF37] text-sm">Refunds processed within 24-48 hours</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <AlertCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">No Questions Asked</h3>
              <p className="text-purple-700 text-sm">Simple and hassle-free refund process</p>
            </div>
          </div>
        </div>

        {/* Refund Policy Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-8">
            Refund Policy Details
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-[#8B1A1A] mb-4">Eligible for Refund</h3>
              <div className="bg-[#fff9e6] border border-[#fff3cc] rounded-xl p-6">
                <ul className="space-y-3 text-[#8B1A1A]">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#8B1A1A] mt-0.5 flex-shrink-0" />
                    <span>Quality issues or product defects</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#8B1A1A] mt-0.5 flex-shrink-0" />
                    <span>Wrong items delivered</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#8B1A1A] mt-0.5 flex-shrink-0" />
                    <span>Damaged packaging affecting product quality</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#8B1A1A] mt-0.5 flex-shrink-0" />
                    <span>Late delivery beyond promised time</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#8B1A1A] mt-0.5 flex-shrink-0" />
                    <span>Change of mind within 24 hours</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#8B1A1A] mb-4">Refund Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[#D4AF37] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                  <h4 className="text-lg font-semibold text-[#8B1A1A] mb-2">Contact Us</h4>
                  <p className="text-[#8B1A1A] text-sm">Call or email us within 24 hours</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#D4AF37] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                  <h4 className="text-lg font-semibold text-[#8B1A1A] mb-2">Verification</h4>
                  <p className="text-[#8B1A1A] text-sm">We verify the issue and arrange pickup</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#D4AF37] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                  <h4 className="text-lg font-semibold text-[#8B1A1A] mb-2">Refund</h4>
                  <p className="text-[#8B1A1A] text-sm">Money credited to original payment method</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#8B1A1A] mb-4">Refund Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FFF7EE] rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-[#8B1A1A] mb-3">Online Payments</h4>
                  <ul className="space-y-2 text-[#8B1A1A] text-sm">
                    <li>• Credit/Debit Cards - 3-5 business days</li>
                    <li>• UPI Payments - 24-48 hours</li>
                    <li>• Net Banking - 3-5 business days</li>
                    <li>• Digital Wallets - 24-48 hours</li>
                  </ul>
                </div>
                <div className="bg-[#FFF7EE] rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-[#8B1A1A] mb-3">Cash on Delivery</h4>
                  <ul className="space-y-2 text-[#8B1A1A] text-sm">
                    <li>• Bank Transfer - 2-3 business days</li>
                    <li>• UPI Transfer - 24-48 hours</li>
                    <li>• Store Credit - Instant</li>
                    <li>• Cash Pickup - Next day</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#8B1A1A] mb-4">Non-Refundable Items</h3>
              <div className="bg-[#fee2e2] border border-[#fecaca] rounded-xl p-6">
                <ul className="space-y-2 text-[#b91c1c]">
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-[#FFB347] mt-0.5 flex-shrink-0" />
                    <span>Custom orders and personalized items</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-[#FFB347] mt-0.5 flex-shrink-0" />
                    <span>Bulk orders for events and weddings</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-[#FFB347] mt-0.5 flex-shrink-0" />
                    <span>Festival special orders</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-[#FFB347] mt-0.5 flex-shrink-0" />
                    <span>Items damaged due to customer handling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact for Refunds */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Need a Refund?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Contact us immediately for the fastest refund processing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="bg-white text-[#8B1A1A] px-8 py-3 rounded-xl font-semibold hover:bg-[#FFF7EE] transition-colors duration-300"
              >
                Call for Refund
              </a>
              <a
                href="mailto:refunds@kotaiahsweets.com"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#8B1A1A] transition-all duration-300"
              >
                Email Refund Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
