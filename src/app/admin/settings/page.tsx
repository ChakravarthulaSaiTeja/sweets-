"use client";

/**
 * Admin Settings Page
 * 
 * Allows admins to:
 * - Configure store information
 * - Manage shipping settings
 * - Configure tax rates
 * - Set delivery slots
 * - Manage email templates
 * - General site settings
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, Store, Truck, Clock, Globe } from "lucide-react";

interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  deliverySlots: string[];
  currency: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    storeName: "Kotaiah's Foods",
    storeEmail: "info@kotaiahsweets.com",
    storePhone: "+91 9876543210",
    storeAddress: "123 Heritage Street, Old City, Hyderabad, Telangana 500001",
    taxRate: 18,
    shippingCost: 50,
    freeShippingThreshold: 500,
    deliverySlots: ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"],
    currency: "INR",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings({
          storeName: data.storeName || "Kotaiah's Foods",
          storeEmail: data.storeEmail || "info@kotaiahsweets.com",
          storePhone: data.storePhone || "+91 9876543210",
          storeAddress: data.storeAddress || "123 Heritage Street, Old City, Hyderabad, Telangana 500001",
          taxRate: data.taxRate || 18,
          shippingCost: data.shippingCost || 50,
          freeShippingThreshold: data.freeShippingThreshold || 500,
          deliverySlots: data.deliverySlots || ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"],
          currency: data.currency || "INR",
        });
      } else {
        console.error("Failed to load settings");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to save settings (${response.status})`;
        console.error("Settings save error:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save settings";
      alert(errorMessage);
    }
  };

  const handleChange = (field: keyof Settings, value: string | number | string[]) => {
    setSettings({ ...settings, [field]: value });
  };

  const addDeliverySlot = () => {
    setSettings({
      ...settings,
      deliverySlots: [...settings.deliverySlots, "09:00-12:00"],
    });
  };

  const removeDeliverySlot = (index: number) => {
    setSettings({
      ...settings,
      deliverySlots: settings.deliverySlots.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF7EE]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#fff9e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-[#8B1A1A] mt-2">Settings</h1>
              <p className="text-[#8B1A1A] mt-1">Configure your store settings</p>
            </div>
            <button
              onClick={saveSettings}
              className="bg-gradient-to-r from-[#8B1A1A] to-[#D4AF37] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
          {saved && (
            <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm">
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Store Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Store className="w-6 h-6 text-[#8B1A1A]" />
              <h2 className="text-xl font-semibold text-[#8B1A1A]">Store Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Store Email
                </label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleChange("storeEmail", e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Store Phone
                </label>
                <input
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => handleChange("storePhone", e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Store Address
                </label>
                <textarea
                  value={settings.storeAddress}
                  onChange={(e) => handleChange("storeAddress", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Shipping & Tax */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-[#8B1A1A]" />
              <h2 className="text-xl font-semibold text-[#8B1A1A]">Shipping & Tax</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) => handleChange("taxRate", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Shipping Cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.shippingCost}
                  onChange={(e) => handleChange("shippingCost", parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    handleChange("freeShippingThreshold", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Delivery Slots */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#8B1A1A]" />
                <h2 className="text-xl font-semibold text-[#8B1A1A]">Delivery Time Slots</h2>
              </div>
              <button
                onClick={addDeliverySlot}
                className="px-4 py-2 bg-[#8B1A1A] text-white rounded-lg hover:bg-[#7A1515] transition-colors text-sm"
              >
                Add Slot
              </button>
            </div>
            <div className="space-y-2">
              {settings.deliverySlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => {
                      const newSlots = [...settings.deliverySlots];
                      newSlots[index] = e.target.value;
                      handleChange("deliverySlots", newSlots);
                    }}
                    placeholder="09:00-12:00"
                    className="flex-1 px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-[#8B1A1A] text-[#8B1A1A]"
                  />
                  <button
                    onClick={() => removeDeliverySlot(index)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="bg-white rounded-lg shadow p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-[#8B1A1A]" />
              <h2 className="text-xl font-semibold text-[#8B1A1A]">Currency Settings</h2>
            </div>
            <div className="relative group">
              <label className="block text-sm font-medium text-[#8B1A1A] mb-2">
                Currency Code
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-[#FFF7EE] border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] text-[#8B1A1A] appearance-none cursor-pointer transition-all duration-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md focus:shadow-lg"
              >
                <option value="INR" className="bg-white text-[#8B1A1A]">INR - Indian Rupee (₹)</option>
                <option value="USD" className="bg-white text-[#8B1A1A]">USD - US Dollar ($)</option>
                <option value="EUR" className="bg-white text-[#8B1A1A]">EUR - Euro (€)</option>
                <option value="GBP" className="bg-white text-[#8B1A1A]">GBP - British Pound (£)</option>
                <option value="AED" className="bg-white text-[#8B1A1A]">AED - UAE Dirham (د.إ)</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-[2.75rem] transform -translate-y-1/2 pointer-events-none z-10">
                <svg className="w-5 h-5 text-[#8B1A1A]/60 group-hover:text-[#8B1A1A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#8B1A1A]/70">
              Select the default currency for displaying prices throughout the website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
