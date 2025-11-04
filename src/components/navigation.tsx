"use client";

/**
 * Navigation Component
 * 
 * Two-tier navigation bar with:
 * - Top bar: Logo and authentication buttons (Sign In, Sign Up)
 * - Bottom bar: Rounded navigation menu with category links
 * 
 * Features:
 * - Sticky positioning with scroll effects
 * - Responsive mobile menu
 * - Smooth animations and hover effects
 * - Dynamic shadow and backdrop blur on scroll
 */

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/utils";
import { useCart } from "@/contexts/cart-context";
import { ShoppingCart } from "lucide-react";

// Navigation menu items - excludes "Sweets" as per requirements
const navigation = [
  { name: "Home", href: "/" },
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
  const { state } = useCart();
  const cartItemCount = state?.totalItems || 0;

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
          "sticky top-0 z-50 transition-all duration-500 ease-out w-full",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
            : "bg-white",
        )}
      >
        {/* Top Bar - Logo and Auth Buttons */}
        <div className={cn(
          "bg-white border-b w-full transition-all duration-300",
          isScrolled ? "border-amber-200/50" : "border-amber-200"
        )}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 w-full">
              {/* Logo - Left */}
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center group">
                  <div className="font-heading font-bold text-2xl lg:text-3xl tracking-tight transform transition-transform duration-300 group-hover:scale-105">
                    <span className="transition-colors duration-300 inline-block" style={{color: '#8B1A1A', marginRight: '16px'}}>
                      Kotaiah&apos;s
                    </span>
                    <span className="transition-colors duration-300 inline-block" style={{color: '#D4AF37'}}>
                      Foods
                    </span>
                  </div>
                </Link>
              </div>

                  {/* Auth Buttons and Cart - Right */}
                  <div className="hidden md:flex items-center space-x-3">
                    {/* Cart Icon with Badge */}
                    <Link
                      href="/cart"
                      className="relative px-4 py-2.5 text-sm font-semibold border-2 rounded transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden group bg-white"
                      style={{
                        color: '#8B1A1A',
                        borderColor: '#8B1A1A',
                        borderRadius: '6px'
                      }}
                      aria-label="Shopping Cart"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="hidden lg:inline">Cart</span>
                        {cartItemCount > 0 && (
                          <span 
                            className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                            style={{minWidth: '20px', padding: '0 4px'}}
                          >
                            {cartItemCount > 99 ? '99+' : cartItemCount}
                          </span>
                        )}
                      </span>
                    </Link>
                    
                    <Link
                      href="/auth/signin"
                      className="relative px-6 py-2.5 text-sm font-semibold border-2 rounded transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden signin-button-link"
                      style={{
                        borderColor: '#8B1A1A',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#8B1A1A'
                      }}
                    >
                      {/* Text and Icon */}
                      <span className="relative z-20 flex items-center gap-2 signin-button-content">
                        <span>Sign In</span>
                        <svg className="w-4 h-4 signin-button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                    
                    <Link
                      href="/auth/signup"
                      className="relative text-white px-6 py-2.5 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden group"
                      style={{
                        background: 'linear-gradient(to right, #8B1A1A, #D4AF37)',
                        boxShadow: '0 2px 8px rgba(139, 26, 26, 0.25)',
                        borderRadius: '6px'
                      }}
                    >
                      {/* Hover effect */}
                      <span 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{background: 'linear-gradient(to right, #7A1515, #B8941F)', borderRadius: '6px'}}
                      ></span>
                      
                      {/* Text */}
                      <span className="relative z-10 flex items-center gap-2">
                        Sign Up
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </span>
                    </Link>
                  </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-[#8B1A1A] hover:text-[#D4AF37] p-2.5 rounded-xl hover:bg-[#8B1A1A]/10 transition-all duration-300 transform hover:rotate-90"
                  aria-label="Toggle mobile menu"
                >
                  <svg
                    className="h-6 w-6 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Rounded Navigation Links */}
        <div className={cn(
          "pt-4 pb-4 px-4 sm:px-6 lg:px-8 w-full transition-all duration-500 ease-out",
          isScrolled && "pt-3 pb-3"
        )}>
          <div className="w-full max-w-7xl mx-auto">
            <div className={cn(
              "bg-white/95 backdrop-blur-xl rounded-3xl px-4 sm:px-6 lg:px-8 py-4 w-full transition-all duration-500 border relative overflow-hidden nav-container-group",
              isScrolled 
                ? "shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-amber-200/70"
                : "shadow-[0_6px_25px_rgba(0,0,0,0.1)] border-amber-200/60"
            )}>
              {/* Subtle animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B1A1A]/0 via-[#D4AF37]/5 to-[#FFB347]/0 rounded-3xl opacity-0 nav-container-group:hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Shine sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full nav-container-group:hover:translate-x-full transition-transform duration-1000 ease-in-out rounded-3xl pointer-events-none"></div>
              
              <div className="flex items-center justify-center h-14 w-full relative z-10">
                <nav className="flex items-center justify-center w-full gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 sm:px-4">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="nav-link px-4 sm:px-5 lg:px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 relative whitespace-nowrap rounded-full flex-shrink-0 text-center transform hover:scale-110 hover:-translate-y-1 active:scale-95"
                      style={{
                        color: '#8B1A1A',
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Background glow effect */}
                      <span className="nav-link-glow absolute inset-0 rounded-full bg-gradient-to-r from-[#8B1A1A]/0 via-[#D4AF37]/0 to-[#FFB347]/0 blur-sm transition-all duration-500 opacity-0"></span>
                      
                      {/* Main background */}
                      <span className="nav-link-bg absolute inset-0 rounded-full bg-gradient-to-r from-[#8B1A1A]/0 to-[#D4AF37]/0 transition-all duration-300 scale-0"></span>
                      
                      {/* Text */}
                      <span className="relative z-10 transition-all duration-300 font-semibold nav-link-text">{item.name}</span>
                      
                      {/* Animated underline - only shows on hover */}
                      <span className="nav-link-underline absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFB347] to-[#D4AF37] rounded-full transition-all duration-500 origin-center opacity-0 shadow-[0_2px_8px_rgba(212,175,55,0.4)]"></span>
                      
                      {/* Top highlight */}
                      <span className="nav-link-highlight absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-500 rounded-full"></span>
                      
                      {/* Pulse effect */}
                      <span className="nav-link-pulse absolute inset-0 rounded-full bg-[#8B1A1A]/20 scale-0 opacity-0 transition-all duration-700"></span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 backdrop-blur-md border-t border-amber-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#8B1A1A] hover:text-white block px-4 py-3 text-base font-semibold hover:bg-gradient-to-r hover:from-[#8B1A1A] hover:to-[#D4AF37] rounded-xl transition-all duration-300 transform hover:translate-x-2 hover:scale-[1.02] shadow-sm hover:shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
                  {/* Mobile Cart and Auth Buttons */}
                  <div className="pt-4 border-t border-amber-200/50 space-y-3">
                    <Link
                      href="/cart"
                      className="relative block px-4 py-3 text-base font-semibold border-2 transition-all duration-300 text-center shadow-sm hover:shadow-md overflow-hidden group bg-white"
                      style={{
                        color: '#8B1A1A',
                        borderColor: '#8B1A1A',
                        borderRadius: '6px'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Cart
                        {cartItemCount > 0 && (
                          <span 
                            className="bg-[#D4AF37] text-white text-xs font-bold rounded-full px-2 py-0.5"
                          >
                            {cartItemCount}
                          </span>
                        )}
                      </span>
                    </Link>
                    <Link
                      href="/auth/signin"
                      className="relative block px-4 py-3 text-base font-semibold border-2 border-[#8B1A1A] transition-all duration-300 text-center shadow-sm hover:shadow-md overflow-hidden signin-button-link"
                      style={{
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        color: '#8B1A1A'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="relative z-20 flex items-center justify-center gap-2 signin-button-content">
                        <span>Sign In</span>
                        <svg className="w-4 h-4 signin-button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </Link>
                <Link
                  href="/auth/signup"
                  className="relative text-white block px-4 py-3 text-base font-semibold transition-all duration-300 text-center shadow-md hover:shadow-lg overflow-hidden group"
                  style={{
                    background: 'linear-gradient(to right, #8B1A1A, #D4AF37)',
                    boxShadow: '0 2px 8px rgba(139, 26, 26, 0.25)',
                    borderRadius: '6px'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'linear-gradient(to right, #7A1515, #B8941F)', borderRadius: '6px'}}></span>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Sign Up
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
