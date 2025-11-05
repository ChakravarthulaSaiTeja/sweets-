import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const footerLinks = {
  products: [
    { name: "Sweets", href: "/products/sweets" },
    { name: "Hot Snacks", href: "/products/hot-snacks" },
    { name: "Pickles", href: "/products/pickles" },
    { name: "Powders", href: "/products/powders" },
    { name: "Gift Boxes", href: "/products/gift-boxes" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Contact", href: "/contact" },
    { name: "Store Locator", href: "/stores" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Track Order", href: "/track" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#8B1A1A] text-white w-full" style={{backgroundColor: '#8B1A1A', color: '#ffffff'}}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-heading font-bold" style={{color: '#D4AF37'}}>
                Kotaiah&apos;s Foods
              </h3>
              <p className="mt-2" style={{color: '#ffffff'}}>
                A Tradition of Sweetness Since 1900
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" style={{color: '#D4AF37'}} />
                <span className="text-sm" style={{color: '#ffffff'}}>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" style={{color: '#D4AF37'}} />
                <span className="text-sm" style={{color: '#ffffff'}}>info@kotaiahsweets.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5" style={{color: '#D4AF37'}} />
                <span className="text-sm" style={{color: '#ffffff'}}>
                  123 Heritage Street, Old City
                  <br />
                  Hyderabad, Telangana 500001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4" style={{color: '#D4AF37'}} />
                <span className="text-sm" style={{color: '#ffffff'}}>Mon-Sun: 8:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{color: '#ffffff'}}>Products</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-[#D4AF37]"
                    style={{color: '#ffffff', opacity: 0.9}}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4" style={{color: '#ffffff'}}>Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-[#D4AF37]"
                    style={{color: '#ffffff', opacity: 0.9}}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{color: '#ffffff'}}>Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-200 hover:text-[#D4AF37]"
                      style={{color: '#ffffff', opacity: 0.9}}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" style={{color: '#ffffff'}}>Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-200 hover:text-[#D4AF37]"
                      style={{color: '#ffffff', opacity: 0.9}}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t mt-8 pt-8" style={{borderColor: 'rgba(255, 255, 255, 0.2)'}}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-center md:text-left" style={{color: '#ffffff', opacity: 0.7}}>
              © 2024 Kotaiah&apos;s Foods. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm transition-colors duration-200 hover:text-[#D4AF37]"
                style={{color: '#ffffff', opacity: 0.7}}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm transition-colors duration-200 hover:text-[#D4AF37]"
                style={{color: '#ffffff', opacity: 0.7}}
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-xs" style={{color: '#ffffff', opacity: 0.5, fontSize: '12px'}}>
              Order Kotaiah Foods sweets online with delivery in Hyderabad. Authentic handmade sweets since 125 years.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
