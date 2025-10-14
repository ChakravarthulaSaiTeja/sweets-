"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Sweets", href: "/products/sweets" },
  { name: "Hot Snacks", href: "/products/hot-snacks" },
  { name: "Pickles", href: "/products/pickles" },
  { name: "Powders", href: "/products/powders" },
  { name: "Gift Boxes", href: "/products/gift-boxes" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm"
            : "bg-[#FFF7EE]",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - Far Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div
                  className={cn(
                    "font-heading font-bold transition-all duration-300",
                    isScrolled ? "text-xl" : "text-2xl",
                  )}
                >
                  <span className="text-[#7B1E2D] group-hover:text-[#9F7B22] transition-colors duration-300">
                    Kotaiah's
                  </span>
                  <span className="text-[#C79A2A] ml-1 group-hover:text-[#E2BB62] transition-colors duration-300">
                    Sweets & Foods
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Truly Centered */}
            <div className="hidden md:flex flex-1 justify-center">
              <nav className="flex items-center space-x-6 lg:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#7B1E2D] hover:text-[#B71C1C] px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F39C12] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Auth Buttons - Far Right */}
            <div className="hidden md:flex items-center space-x-3 ml-auto">
              <Link
                href="/auth/signin"
                className="text-[#7B1E2D] hover:text-[#B71C1C] px-4 py-2 text-sm font-medium border border-[#7B1E2D] rounded-lg hover:bg-[#7B1E2D] hover:text-white transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-white bg-[#7B1E2D] hover:bg-[#B71C1C] px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-auto">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#7B1E2D] hover:text-[#B71C1C] p-2 rounded-lg hover:bg-[#7B1E2D]/10 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#7B1E2D] hover:text-[#B71C1C] block px-4 py-3 text-base font-medium hover:bg-[#7B1E2D]/10 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  href="/auth/signin"
                  className="text-[#7B1E2D] hover:text-[#B71C1C] block px-4 py-3 text-base font-medium border-2 border-[#7B1E2D] rounded-lg hover:bg-[#7B1E2D] hover:text-white transition-all duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-white bg-[#7B1E2D] hover:bg-[#B71C1C] block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 text-center shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
