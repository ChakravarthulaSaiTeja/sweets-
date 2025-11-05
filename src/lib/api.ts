/**
 * API Client Utility
 * 
 * Helper functions for making API calls to Next.js API routes
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Fetch products with optional filters
 */
export async function fetchProducts(params?: {
  category?: string;
  search?: string;
  featured?: boolean;
  bestSeller?: boolean;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ products: unknown[] }>> {
  const searchParams = new URLSearchParams();
  
  if (params?.category) searchParams.append("category", params.category);
  if (params?.search) searchParams.append("search", params.search);
  if (params?.featured) searchParams.append("featured", "true");
  if (params?.bestSeller) searchParams.append("bestSeller", "true");
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());

  const url = `${API_BASE_URL}/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  
  try {
    const response = await fetch(url, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch products" };
  }
}

/**
 * Fetch single product by slug
 */
export async function fetchProductBySlug(slug: string): Promise<ApiResponse<unknown>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${slug}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Product not found" };
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    return { data: await response.json() };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch product" };
  }
}

/**
 * Fetch variants for a product
 */
export async function fetchProductVariants(slug: string): Promise<ApiResponse<unknown[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${slug}/variants`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch variants: ${response.statusText}`);
    }
    
    return { data: await response.json() };
  } catch (error) {
    console.error("Error fetching variants:", error);
    return { error: error instanceof Error ? error.message : "Failed to fetch variants" };
  }
}

