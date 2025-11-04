import { Metadata } from "next";
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Kotaiah's Foods",
  description: "Read our terms of service for Kotaiah's Foods. Understand your rights and responsibilities when using our services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#D4AF37]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] bg-clip-text text-transparent mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-[#8B1A1A] max-w-2xl mx-auto">
            Please read these terms carefully before using our services
          </p>
          <p className="text-sm text-[#8B1A1A] mt-4">
            Last updated: December 2024
          </p>
        </div>

        {/* Terms Overview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 mb-16">
          <div className="text-center mb-8">
            <FileText className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
              Agreement to Terms
            </h2>
            <p className="text-[#8B1A1A]">
              By using our services, you agree to be bound by these terms and conditions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Scale className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#8B1A1A] mb-2">Legal Binding</h3>
              <p className="text-[#8B1A1A] text-sm">These terms form a legally binding agreement</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#8B1A1A] mb-2">Acceptance</h3>
              <p className="text-[#8B1A1A] text-sm">Using our services constitutes acceptance</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#8B1A1A] mb-2">Updates</h3>
              <p className="text-[#8B1A1A] text-sm">Terms may be updated periodically</p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  Service Description
                </h2>
                <div className="bg-[#FFF7EE] rounded-xl p-6">
                  <p className="text-[#8B1A1A] leading-relaxed">
                    Kotaiah&apos;s Foods provides authentic Indian sweets, snacks, pickles, and gift boxes 
                    through our online platform and physical stores. We offer home delivery services across 
                    Hyderabad and surrounding areas.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  User Responsibilities
                </h2>
                <div className="space-y-4">
                  <div className="bg-[#ffedd5] border border-[#fed7aa] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">Accurate Information</h3>
                    <p className="text-[#D4AF37]">Provide accurate and complete information when placing orders, including delivery address and contact details.</p>
                  </div>
                  <div className="bg-[#fff9e6] border border-[#fff3cc] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#8B1A1A] mb-2">Account Security</h3>
                    <p className="text-[#8B1A1A]">Maintain the security of your account credentials and notify us immediately of any unauthorized access.</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Compliance</h3>
                    <p className="text-purple-700">Use our services in compliance with applicable laws and regulations.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  Order Terms
                </h2>
                <div className="bg-[#D4AF37] border border--[#D4AF37] rounded-xl p-6">
                  <ul className="space-y-3 text-[#D4AF37]">
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D4AF37] font-bold">•</span>
                      <span>All orders are subject to product availability and confirmation</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D4AF37] font-bold">•</span>
                      <span>Prices are subject to change without notice</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D4AF37] font-bold">•</span>
                      <span>Delivery times are estimates and may vary</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D4AF37] font-bold">•</span>
                      <span>We reserve the right to refuse or cancel orders</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  Payment Terms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#FFF7EE] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#8B1A1A] mb-3">Payment Methods</h3>
                    <ul className="space-y-2 text-[#8B1A1A] text-sm">
                      <li>• Credit/Debit Cards</li>
                      <li>• UPI Payments</li>
                      <li>• Net Banking</li>
                      <li>• Cash on Delivery</li>
                    </ul>
                  </div>
                  <div className="bg-[#FFF7EE] rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#8B1A1A] mb-3">Payment Security</h3>
                    <ul className="space-y-2 text-[#8B1A1A] text-sm">
                      <li>• SSL encrypted transactions</li>
                      <li>• PCI compliant processing</li>
                      <li>• Secure payment gateways</li>
                      <li>• No storage of card details</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  Limitation of Liability
                </h2>
                <div className="bg-[#fee2e2] border border-[#fecaca] rounded-xl p-6">
                  <p className="text-[#b91c1c] leading-relaxed">
                    Kotaiah&apos;s Foods shall not be liable for any indirect, incidental, special, 
                    or consequential damages arising from the use of our services. Our total liability 
                    shall not exceed the amount paid for the specific order in question.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  Intellectual Property
                </h2>
                <div className="bg-[#FFF7EE] rounded-xl p-6">
                  <p className="text-[#8B1A1A] leading-relaxed">
                    All content, trademarks, logos, and intellectual property on our website and 
                    materials are owned by Kotaiah&apos;s Foods and are protected by applicable 
                    intellectual property laws.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  Governing Law
                </h2>
                <div className="bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] rounded-xl p-6 text-white">
                  <p className="mb-4">These terms are governed by the laws of India and the state of Telangana.</p>
                  <p>Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-heading font-bold text-[#8B1A1A] mb-4">
                  Contact Information
                </h2>
                <div className="bg-[#FFF7EE] rounded-xl p-6">
                  <p className="text-[#8B1A1A] mb-4">For questions about these Terms of Service, please contact us:</p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> legal@kotaiahsweets.com</p>
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
