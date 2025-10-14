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
    console.log("Form submitted:", formData);
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
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B1E2D] focus:border-transparent hover:border-[#7B1E2D]/50 transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B1E2D] focus:border-transparent hover:border-[#7B1E2D]/50 transition-colors"
            placeholder="Your phone number"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B1E2D] focus:border-transparent"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 mb-2"
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
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B1E2D] focus:border-transparent appearance-none bg-white cursor-pointer hover:border-[#7B1E2D]/50 transition-colors"
          >
            <option value="" disabled className="text-gray-400">
              Choose a topic...
            </option>
            <option value="order" className="text-gray-900">
              🛒 Order Inquiry
            </option>
            <option value="product" className="text-gray-900">
              🍯 Product Question
            </option>
            <option value="delivery" className="text-gray-900">
              🚚 Delivery Information
            </option>
            <option value="feedback" className="text-gray-900">
              💬 Feedback
            </option>
            <option value="complaint" className="text-gray-900">
              ⚠️ Complaint
            </option>
            <option value="partnership" className="text-gray-900">
              🤝 Partnership
            </option>
            <option value="other" className="text-gray-900">
              📝 Other
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
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
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B1E2D] focus:border-transparent"
          placeholder="Tell us how we can help you..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#7B1E2D] to-[#C79A2A] text-white py-3 px-6 rounded-lg font-medium hover:from-[#C79A2A] hover:to-[#7B1E2D] hover:text-[#7B1E2D] transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
