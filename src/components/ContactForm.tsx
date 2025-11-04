"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    // Form submitted - in production, this would send data to API endpoint
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-[#fff9e6]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#8B1A1A] mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#fff9e6] rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent hover:border-[#8B1A1A]/50 transition-colors text-[#8B1A1A]"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[#8B1A1A] mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#fff9e6] rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent hover:border-[#8B1A1A]/50 transition-colors text-[#8B1A1A]"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#8B1A1A] mb-2"
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[#fff9e6] rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent text-[#8B1A1A]"
          placeholder="Enter your email address"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-[#8B1A1A] mb-2"
        >
          Subject *
        </label>
        <div className="relative">
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-10 border border-[#fff9e6] rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent appearance-none bg-white cursor-pointer hover:border-[#8B1A1A]/50 transition-colors text-[#8B1A1A]"
          >
            <option value="" disabled className="text-[#8B1A1A]">
              Choose a topic...
            </option>
            <option value="order" className="text-[#8B1A1A]">
              🛒 Order Inquiry
            </option>
            <option value="product" className="text-[#8B1A1A]">
              🍯 Product Question
            </option>
            <option value="delivery" className="text-[#8B1A1A]">
              🚚 Delivery Information
            </option>
            <option value="feedback" className="text-[#8B1A1A]">
              💬 Feedback
            </option>
            <option value="complaint" className="text-[#8B1A1A]">
              ⚠️ Complaint
            </option>
            <option value="partnership" className="text-[#8B1A1A]">
              🤝 Partnership
            </option>
            <option value="other" className="text-[#8B1A1A]">
              📝 Other
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-[#8B1A1A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[#8B1A1A] mb-2"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-[#fff9e6] rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent text-[#8B1A1A]"
          placeholder="Enter your message here..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white py-3 px-6 rounded-lg font-medium hover:from-[#D4AF37] hover:to-[#8B1A1A] transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Send Message
        </span>
      </button>
    </form>
  );
}
