import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Kotaiah's Sweets & Foods - A Tradition of Sweetness Since 1900",
  description:
    "Premium Indian sweets, snacks, pickles, and gift boxes. Authentic recipes passed down through generations. Fresh delivery available.",
  keywords:
    "Indian sweets, traditional sweets, gulab jamun, kaju katli, samosa, pickles, gift boxes, Hyderabad sweets",
  authors: [{ name: "Kotaiah's Sweets & Foods" }],
  creator: "Kotaiah's Sweets & Foods",
  publisher: "Kotaiah's Sweets & Foods",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Kotaiah's Sweets & Foods - A Tradition of Sweetness Since 1900",
    description:
      "Premium Indian sweets, snacks, pickles, and gift boxes. Authentic recipes passed down through generations.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Kotaiah's Sweets & Foods",
    images: [
      {
        url: "/images/hero-sweets.svg",
        width: 1200,
        height: 630,
        alt: "Kotaiah's Sweets & Foods",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kotaiah's Sweets & Foods - A Tradition of Sweetness Since 1900",
    description:
      "Premium Indian sweets, snacks, pickles, and gift boxes. Authentic recipes passed down through generations.",
    images: ["/images/hero-sweets.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body antialiased bg-background text-text-primary">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
