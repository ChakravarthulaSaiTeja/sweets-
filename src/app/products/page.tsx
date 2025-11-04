import { Metadata } from "next";
import ProductsPageClient from "./page-client";

export const metadata: Metadata = {
  title: "All Products - Kotaiah's Foods",
  description: "Browse our complete collection of authentic Indian sweets, snacks, pickles, spice powders, and gift boxes.",
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}