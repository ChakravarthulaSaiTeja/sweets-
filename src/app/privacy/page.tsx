import { Metadata } from "next";
import { Shield, Eye, Lock, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Kotaiah's Sweets & Foods",
  description: "Read our privacy policy to understand how Kotaiah's Sweets & Foods collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and use your information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: December 2024
          </p>
        </div>

        {/* Privacy Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-[#C79A2A] mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
              Our Commitment to Privacy
            </h2>
            <p className="text-gray-600">
              We are committed to protecting your privacy and ensuring the security of your personal information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Eye className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#7B1E2D] mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">Clear information about data collection and usage</p>
            </div>
            <div className="text-center">
              <Lock className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#7B1E2D] mb-2">Security</h3>
              <p className="text-gray-600 text-sm">Advanced encryption and security measures</p>
            </div>
            <div className="text-center">
              <Database className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#7B1E2D] mb-2">Control</h3>
              <p className="text-gray-600 text-sm">You control your data and preferences</p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  Information We Collect
                </h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#7B1E2D] mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Name, email address, and phone number</li>
                    <li>• Delivery address and billing information</li>
                    <li>• Order history and preferences</li>
                    <li>• Payment information (securely processed)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  How We Use Your Information
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Order Processing</h3>
                    <p className="text-blue-700">To process and deliver your orders, send confirmations, and provide customer support.</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Service Improvement</h3>
                    <p className="text-green-700">To improve our products, services, and customer experience based on your feedback.</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Communication</h3>
                    <p className="text-purple-700">To send you updates about your orders, promotions, and important service announcements.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  Data Security
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <ul className="space-y-3 text-yellow-800">
                    <li className="flex items-start space-x-3">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span>All data is encrypted using industry-standard SSL/TLS protocols</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span>Payment information is processed securely through PCI-compliant systems</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span>Regular security audits and updates to protect against threats</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-yellow-600 font-bold">•</span>
                      <span>Limited access to personal data on a need-to-know basis</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  Your Rights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#7B1E2D] mb-3">Access & Update</h3>
                    <p className="text-gray-700 text-sm">You can access and update your personal information at any time through your account.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#7B1E2D] mb-3">Data Deletion</h3>
                    <p className="text-gray-700 text-sm">You can request deletion of your personal data, subject to legal requirements.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#7B1E2D] mb-3">Opt-out</h3>
                    <p className="text-gray-700 text-sm">You can opt-out of marketing communications while keeping essential service messages.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#7B1E2D] mb-3">Data Portability</h3>
                    <p className="text-gray-700 text-sm">You can request a copy of your data in a portable format.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
                  Contact Us
                </h2>
                <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-xl p-6 text-white">
                  <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@kotaiahsweets.com</p>
                    <p><strong>Phone:</strong> +91 9876543210</p>
                    <p><strong>Address:</strong> 123 Heritage Street, Old City, Hyderabad, Telangana 500001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
