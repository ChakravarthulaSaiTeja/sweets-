import { Metadata } from "next";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center - Kotaiah's Sweets & Foods",
  description: "Get help with your orders, find answers to common questions, and contact our support team at Kotaiah's Sweets & Foods.",
};

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our products online, adding items to your cart, and proceeding to checkout. We also accept phone orders at +91 9876543210."
    },
    {
      question: "What are your delivery areas?",
      answer: "We deliver across Hyderabad and surrounding areas. Delivery charges may apply based on distance. Contact us for specific area coverage."
    },
    {
      question: "How long do sweets stay fresh?",
      answer: "Our sweets are made fresh daily and stay fresh for 3-7 days when stored properly in a cool, dry place. Refrigeration may extend shelf life for some items."
    },
    {
      question: "Do you offer bulk orders?",
      answer: "Yes! We offer special pricing for bulk orders and can customize packaging for events, weddings, and corporate orders. Contact us for quotes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, credit/debit cards, UPI, net banking, and digital wallets. All online payments are secure and encrypted."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled or modified within 30 minutes of placement. For urgent changes, please call us immediately at +91 9876543210."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-6">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions or get in touch with our support team
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 text-center">
            <Phone className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#7B1E2D] mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Speak directly with our team</p>
            <a
              href="tel:+919876543210"
              className="text-[#7B1E2D] font-semibold hover:text-[#C79A2A] transition-colors duration-200"
            >
              +91 9876543210
            </a>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 text-center">
            <Mail className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#7B1E2D] mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Send us your queries</p>
            <a
              href="mailto:support@kotaiahsweets.com"
              className="text-[#7B1E2D] font-semibold hover:text-[#C79A2A] transition-colors duration-200"
            >
              support@kotaiahsweets.com
            </a>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 text-center">
            <MessageCircle className="h-12 w-12 text-[#C79A2A] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#7B1E2D] mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with us online</p>
            <button className="text-[#7B1E2D] font-semibold hover:text-[#C79A2A] transition-colors duration-200">
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="text-center mb-8">
            <HelpCircle className="h-16 w-16 text-[#C79A2A] mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-[#7B1E2D] mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-heading font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Our support team is here to assist you with any questions or concerns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-[#7B1E2D] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Contact Support
              </a>
              <a
                href="tel:+919876543210"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#7B1E2D] transition-all duration-300"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
