import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import MapPlaceholder from "@/components/MapPlaceholder";

export const metadata: Metadata = {
  title: "Contact Us - Kotaiah's Sweets & Foods",
  description:
    "Get in touch with us for orders, inquiries, or to visit our store. We're here to serve you with the best Indian sweets and snacks.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
              We'd love to hear from you. Get in touch for orders, inquiries, or
              just to say hello!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              {/* Store Address */}
              <div className="flex items-start space-x-4">
                <div className="bg-[#7B1E2D]/10 rounded-full p-3">
                  <MapPin className="h-6 w-6 text-[#7B1E2D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Visit Our Store
                  </h3>
                  <p className="text-gray-600">
                    123 Main Street
                    <br />
                    Downtown Area
                    <br />
                    City, State 12345
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-[#C79A2A]/10 rounded-full p-3">
                  <Phone className="h-6 w-6 text-[#C79A2A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="tel:+1234567890"
                      className="hover:text-[#7B1E2D] transition-colors"
                    >
                      +1 (234) 567-8900
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-[#7B1E2D]/10 rounded-full p-3">
                  <Mail className="h-6 w-6 text-[#7B1E2D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:info@kotaiahsweets.com"
                      className="hover:text-[#7B1E2D] transition-colors"
                    >
                      info@kotaiahsweets.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="bg-[#C79A2A]/10 rounded-full p-3">
                  <Clock className="h-6 w-6 text-[#C79A2A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Store Hours
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p>Saturday: 9:00 AM - 9:00 PM</p>
                    <p>Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Coming Soon */}
            <div className="mt-8">
              <MapPlaceholder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
