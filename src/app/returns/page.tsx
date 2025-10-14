import { Metadata } from "next";
import { RotateCcw, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refunds - Kotaiah's Sweets & Foods",
  description: "Learn about our return and refund policy for Kotaiah's Sweets & Foods. Easy returns within 24 hours of delivery.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-6">
            Returns & Refunds
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our commitment to your satisfaction with easy returns and quick refunds
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <div className="text-center mb-8">
            <RotateCcw className="h-16 w-16 text-[#C79A2A] mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
              Our Return Policy
            </h2>
            <p className="text-gray-600">
              We want you to be completely satisfied with your purchase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-3">Easy Returns</h3>
              <ul className="space-y-2 text-green-700">
                <li>• 24-hour return window from delivery</li>
                <li>• No questions asked policy</li>
                <li>• Free return pickup</li>
                <li>• Full refund or replacement</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Quick Processing</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Refunds processed within 24 hours</li>
                <li>• Money back to original payment method</li>
                <li>• Instant replacement for quality issues</li>
                <li>• SMS/Email confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-8">
            Detailed Return Policy
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-[#7B1E2D] mb-4">Return Conditions</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Returns accepted within 24 hours of delivery</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Product must be in original packaging</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>At least 50% of the product must remain</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Quality issues are covered regardless of consumption</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#7B1E2D] mb-4">Refund Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[#C79A2A] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                  <h4 className="text-lg font-semibold text-[#7B1E2D] mb-2">Contact Us</h4>
                  <p className="text-gray-600 text-sm">Call or email us to initiate return</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#C79A2A] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                  <h4 className="text-lg font-semibold text-[#7B1E2D] mb-2">Pickup</h4>
                  <p className="text-gray-600 text-sm">We arrange free pickup of returned items</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#C79A2A] text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                  <h4 className="text-lg font-semibold text-[#7B1E2D] mb-2">Refund</h4>
                  <p className="text-gray-600 text-sm">Money credited within 24 hours</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#7B1E2D] mb-4">Important Exceptions</h3>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
                <ul className="space-y-2 text-red-700">
                  <li>• Custom orders cannot be returned</li>
                  <li>• Bulk orders have different return policies</li>
                  <li>• Festival special orders are non-returnable</li>
                  <li>• Damaged packaging due to customer handling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact for Returns */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Need to Return Something?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Contact us immediately for the fastest return processing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="bg-white text-[#7B1E2D] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Call for Returns
              </a>
              <a
                href="mailto:returns@kotaiahsweets.com"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#7B1E2D] transition-all duration-300"
              >
                Email Returns Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
