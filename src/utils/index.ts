/**
 * Utility Functions
 * 
 * Collection of helper functions used throughout the application
 * for formatting, validation, and data manipulation.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes, resolving conflicts intelligently
 * @param inputs - Class names or conditional class objects
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Indian Rupee currency
 * @param price - Price value to format
 * @returns Formatted price string (e.g., "₹280.00")
 */
export function formatPrice(price: number): string {
  // Use consistent format that works on both server and client
  return `₹${price.toFixed(2)}`;
}

/**
 * Formats a date in Indian locale format
 * @param date - Date object to format
 * @returns Formatted date string (e.g., "15 January 2024")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formats a date with time in Indian locale format
 * @param date - Date object to format
 * @returns Formatted date-time string (e.g., "15 Jan 2024, 10:30 AM")
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Generates a unique order number using timestamp and random string
 * @returns Order number string (e.g., "KS123456ABC")
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `KS${timestamp}${random}`;
}

/**
 * Converts text to URL-friendly slug format
 * @param text - Text to slugify
 * @returns Slug string (e.g., "gulab-jamun")
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum character length
 * @returns Truncated text with "..." if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Validates email address format
 * @param email - Email string to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates Indian phone number format (10 digits, starting with 6-9)
 * @param phone - Phone string to validate
 * @returns True if phone format is valid
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

/**
 * Validates Indian pincode format (6 digits, first digit 1-9)
 * @param pincode - Pincode string to validate
 * @returns True if pincode format is valid
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}
