import { Metadata } from "next";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Store Locator - Kotaiah's Sweets & Foods",
  description: "Find Kotaiah's Sweets & Foods stores near you. Visit our locations across Hyderabad and experience authentic Indian sweets.",
};

export default function StoresPage() {
  const stores = [
    {
      id: 1,
      name: "Heritage Street Store",
      address: "123 Heritage Street, Old City, Hyderabad, Telangana 500001",
      phone: "+91 9876543210",
      email: "heritage@kotaiahsweets.com",
      hours: "Mon-Sun: 8:00 AM - 10:00 PM",
      isMain: true,
    },
    {
      id: 2,
      name: "Secunderabad Branch",
      address: "456 MG Road, Secunderabad, Telangana 500003",
      phone: "+91 9876543211",
      email: "secunderabad@kotaiahsweets.com",
      hours: "Mon-Sun: 9:00 AM - 9:00 PM",
      isMain: false,
    },
    {
      id: 3,
      name: "HITEC City Outlet",
      address: "789 Cyber Towers, HITEC City, Hyderabad, Telangana 500081",
      phone: "+91 9876543212",
      email: "hitec@kotaiahsweets.com",
      hours: "Mon-Sat: 10:00 AM - 8:00 PM",
      isMain: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7EE] via-white to-[#C79A2A]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] bg-clip-text text-transparent mb-6">
            Store Locator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find our stores near you and experience the authentic taste of Kotaiah's Sweets & Foods
          </p>
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div
              key={store.id}
              className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 transform hover:scale-105 transition-all duration-300 ${
                store.isMain ? "ring-2 ring-[#C79A2A]" : ""
              }`}
            >
              {store.isMain && (
                <div className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                  Main Store
                </div>
              )}
              
              <h3 className="text-2xl font-heading font-bold text-[#7B1E2D] mb-4">
                {store.name}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-[#C79A2A] mt-1 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {store.address}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-[#C79A2A] flex-shrink-0" />
                  <a
                    href={`tel:${store.phone}`}
                    className="text-gray-700 hover:text-[#7B1E2D] transition-colors duration-200"
                  >
                    {store.phone}
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-[#C79A2A] flex-shrink-0" />
                  <a
                    href={`mailto:${store.email}`}
                    className="text-gray-700 hover:text-[#7B1E2D] transition-colors duration-200"
                  >
                    {store.email}
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-[#C79A2A] flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    {store.hours}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white py-3 px-6 rounded-xl font-semibold hover:from-[#C79A2A] hover:to-[#7B1E2D] transition-all duration-300 text-center block"
                >
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-[#7B1E2D] mb-6">
              Can't Find a Store Near You?
            </h2>
            <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
              Don't worry! We offer home delivery across Hyderabad and surrounding areas. 
              Order online and get fresh sweets delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#C79A2A] hover:to-[#7B1E2D] transition-all duration-300"
              >
                Order Online
              </a>
              <a
                href="/contact"
                className="border-2 border-[#7B1E2D] text-[#7B1E2D] px-8 py-3 rounded-xl font-semibold hover:bg-[#7B1E2D] hover:text-white transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
