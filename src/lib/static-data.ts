/**
 * Static Product Data
 * 
 * This file contains static product data for the e-commerce website.
 * In a production environment, this would typically be fetched from a database or API.
 * 
 * Products are organized by category and include:
 * - Basic product information (name, description, price)
 * - Images and media
 * - Inventory and stock status
 * - SEO metadata
 * - Reviews and ratings
 */

// Static product data for demo/static export mode
export const staticProducts = [
  {
    id: "GJ001",
    name: "Gulab Jamun",
    slug: "gulab-jamun",
    description: "Soft, spongy milk-based dumplings soaked in rose-flavored sugar syrup.",
    shortDescription: "Soft milk dumplings in rose syrup",
    category: {
      id: "cat-1",
      name: "Sweets",
      slug: "sweets",
    },
    price: 280.00,
    originalPrice: null,
    sku: "GJ001",
    images: ["https://www.shutterstock.com/image-photo/gulab-jamun-beloved-dessert-indian-260nw-2536754249.jpg"],
    ingredients: ["Milk powder", "Flour", "Sugar", "Rose water"],
    shelfLife: 3,
    weight: "500g",
    packSize: "1 Box",
    taxPercent: 18.00,
    inventoryQty: 20,
    isPerishable: true,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Gulab Jamun - Traditional Indian Sweet",
    metaDescription: "Buy authentic Gulab Jamun online",
    averageRating: 4.8,
    reviewCount: 25,
  },
  {
    id: "KK001",
    name: "Kaju Katli",
    slug: "kaju-katli",
    description: "Rich, creamy cashew fudge with diamond-like appearance.",
    shortDescription: "Rich cashew fudge",
    category: {
      id: "cat-1",
      name: "Sweets",
      slug: "sweets",
    },
    price: 450.00,
    originalPrice: null,
    sku: "KK001",
    images: ["https://upload.wikimedia.org/wikipedia/commons/a/ac/Kaju_katli_sweet.jpg"],
    ingredients: ["Cashews", "Sugar", "Ghee", "Cardamom"],
    shelfLife: 7,
    weight: "250g",
    packSize: "1 Box",
    taxPercent: 18.00,
    inventoryQty: 15,
    isPerishable: true,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Kaju Katli - Premium Cashew Fudge",
    metaDescription: "Buy authentic Kaju Katli online",
    averageRating: 4.9,
    reviewCount: 18,
  },
  {
    id: "KKJ001",
    name: "Kakinada Kaja",
    slug: "kakinada-kaja",
    description: "Traditional Andhra Pradesh sweet made with maida flour, deep-fried and coated with sugar syrup.",
    shortDescription: "Traditional Andhra crispy sweet",
    category: {
      id: "cat-1",
      name: "Sweets",
      slug: "sweets",
    },
    price: 180.00,
    originalPrice: null,
    sku: "KKJ001",
    images: ["https://sitarafoods.com/wp-content/uploads/2022/07/04-2.jpg"],
    ingredients: ["Maida flour", "Sugar", "Ghee", "Cardamom"],
    shelfLife: 7,
    weight: "200g",
    packSize: "1 Box",
    taxPercent: 18.00,
    inventoryQty: 25,
    isPerishable: true,
    isBestSeller: true,
    isFeatured: true,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Kakinada Kaja - Traditional Andhra Sweet",
    metaDescription: "Buy authentic Kakinada Kaja online",
    averageRating: 4.9,
    reviewCount: 32,
  },
  {
    id: "RG001",
    name: "Rasagulla",
    slug: "rasagulla",
    description: "Soft and spongy cottage cheese balls soaked in light sugar syrup.",
    shortDescription: "Soft cottage cheese balls in light syrup",
    category: {
      id: "cat-1",
      name: "Sweets",
      slug: "sweets",
    },
    price: 320.00,
    originalPrice: null,
    sku: "RG001",
    images: ["https://t3.ftcdn.net/jpg/01/24/13/32/360_F_124133223_wT7dPKKkL83cdkZTascooO8REQISsY1f.jpg"],
    ingredients: ["Cottage cheese", "Sugar", "Cardamom", "Rose water"],
    shelfLife: 2,
    weight: "500g",
    packSize: "1 Box",
    taxPercent: 18.00,
    inventoryQty: 30,
    isPerishable: true,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Rasagulla - Traditional Bengali Sweet",
    metaDescription: "Buy authentic Rasagulla online",
    averageRating: 4.7,
    reviewCount: 22,
  },
  {
    id: "DGB001",
    name: "Diwali Gift Box",
    slug: "diwali-gift-box",
    description: "Beautifully curated gift box containing premium sweets for Diwali celebrations.",
    shortDescription: "Assorted sweets gift box",
    category: {
      id: "cat-5",
      name: "Gift Boxes",
      slug: "gift-boxes",
    },
    price: 1200.00,
    originalPrice: null,
    sku: "DGB001",
    images: ["https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&crop=center"],
    ingredients: ["Mixed sweets", "Gift packaging"],
    shelfLife: 7,
    weight: "1kg",
    packSize: "1 Box",
    taxPercent: 18.00,
    inventoryQty: 10,
    isPerishable: true,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Diwali Gift Box - Premium Assorted Sweets",
    metaDescription: "Buy authentic Diwali gift box online",
    averageRating: 4.8,
    reviewCount: 15,
  },
  {
    id: "SM001",
    name: "Samosa",
    slug: "samosa",
    description: "Crispy triangular pastries filled with spiced potatoes and peas.",
    shortDescription: "Crispy spiced potato pastries",
    category: {
      id: "cat-2",
      name: "Hot Snacks",
      slug: "hot-snacks",
    },
    price: 25.00,
    originalPrice: null,
    sku: "SM001",
    images: ["https://www.shutterstock.com/image-photo/selective-focus-samosa-spiced-potatofilled-260nw-2450430319.jpg"],
    ingredients: ["Potatoes", "Peas", "Flour", "Spices"],
    shelfLife: 1,
    weight: "100g",
    packSize: "1 Piece",
    taxPercent: 18.00,
    inventoryQty: 50,
    isPerishable: true,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Samosa - Crispy Spiced Pastries",
    metaDescription: "Buy authentic Samosa online",
    averageRating: 4.6,
    reviewCount: 28,
  },
  {
    id: "PK001",
    name: "Pakora",
    slug: "pakora",
    description: "Crispy fried fritters made with gram flour and mixed vegetables.",
    shortDescription: "Crispy vegetable fritters",
    category: {
      id: "cat-2",
      name: "Hot Snacks",
      slug: "hot-snacks",
    },
    price: 30.00,
    originalPrice: null,
    sku: "PK001",
    images: ["http://www.masala.tv/wp-content/uploads/2021/05/PAKORA-THALI-lazzat.jpg"],
    ingredients: ["Gram flour", "Onions", "Potatoes", "Spices"],
    shelfLife: 1,
    weight: "150g",
    packSize: "1 Plate",
    taxPercent: 18.00,
    inventoryQty: 40,
    isPerishable: true,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Pakora - Crispy Vegetable Fritters",
    metaDescription: "Buy authentic Pakora online",
    averageRating: 4.5,
    reviewCount: 20,
  },
  {
    id: "GM001",
    name: "Garam Masala",
    slug: "garam-masala",
    description: "Aromatic blend of ground spices used in Indian cooking.",
    shortDescription: "Aromatic spice blend",
    category: {
      id: "cat-4",
      name: "Powders",
      slug: "powders",
    },
    price: 120.00,
    originalPrice: null,
    sku: "GM001",
    images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop&crop=center"],
    ingredients: ["Cumin", "Coriander", "Cardamom", "Cinnamon", "Cloves"],
    shelfLife: 365,
    weight: "100g",
    packSize: "1 Bottle",
    taxPercent: 18.00,
    inventoryQty: 35,
    isPerishable: false,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Garam Masala - Aromatic Spice Blend",
    metaDescription: "Buy authentic Garam Masala online",
    averageRating: 4.7,
    reviewCount: 16,
  },
  {
    id: "CMP001",
    name: "Chana Masala Powder",
    slug: "chana-masala-powder",
    description: "Special spice blend for making authentic chana masala.",
    shortDescription: "Special spice blend for chana masala",
    category: {
      id: "cat-4",
      name: "Powders",
      slug: "powders",
    },
    price: 100.00,
    originalPrice: null,
    sku: "CMP001",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"],
    ingredients: ["Cumin", "Coriander", "Turmeric", "Red chili", "Garam masala"],
    shelfLife: 365,
    weight: "100g",
    packSize: "1 Bottle",
    taxPercent: 18.00,
    inventoryQty: 30,
    isPerishable: false,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Chana Masala Powder - Special Spice Blend",
    metaDescription: "Buy authentic Chana Masala Powder online",
    averageRating: 4.6,
    reviewCount: 12,
  },
  {
    id: "LP001",
    name: "Lemon Pickle",
    slug: "lemon-pickle",
    description: "Tangy and spicy lemon pickle with traditional flavors.",
    shortDescription: "Tangy and spicy lemon pickle",
    category: {
      id: "cat-3",
      name: "Pickles",
      slug: "pickles",
    },
    price: 150.00,
    originalPrice: null,
    sku: "LP001",
    images: ["https://chefsmandala.com/wp-content/uploads/2018/04/Indian-Lemon-Pickle.jpg"],
    ingredients: ["Lemons", "Salt", "Red chili", "Mustard seeds", "Oil"],
    shelfLife: 180,
    weight: "250g",
    packSize: "1 Jar",
    taxPercent: 18.00,
    inventoryQty: 25,
    isPerishable: false,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Lemon Pickle - Tangy and Spicy",
    metaDescription: "Buy authentic Lemon Pickle online",
    averageRating: 4.4,
    reviewCount: 14,
  },
  {
    id: "MP001",
    name: "Mango Pickle",
    slug: "mango-pickle",
    description: "Traditional mango pickle with authentic South Indian flavors.",
    shortDescription: "Traditional mango pickle",
    category: {
      id: "cat-3",
      name: "Pickles",
      slug: "pickles",
    },
    price: 180.00,
    originalPrice: null,
    sku: "MP001",
    images: ["https://media.istockphoto.com/id/1316583859/photo/mango-pickle-or-aam-ka-aachar-or-achar-in-a-bowl-on-wooden-background-theme-with-raw-mangos.jpg?s=612x612&w=0&k=20&c=dQqg5cBILEP-7WJB5LYLYdopSoqZ1ebc9cxXif80DJk="],
    ingredients: ["Raw mangoes", "Salt", "Red chili", "Mustard seeds", "Oil"],
    shelfLife: 180,
    weight: "300g",
    packSize: "1 Jar",
    taxPercent: 18.00,
    inventoryQty: 20,
    isPerishable: false,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    shippingRegions: ["500001", "500002"],
    metaTitle: "Mango Pickle - Traditional South Indian",
    metaDescription: "Buy authentic Mango Pickle online",
    averageRating: 4.5,
    reviewCount: 18,
  },
];

export const staticCategories = [
  {
    id: "cat-1",
    name: "Sweets",
    slug: "sweets",
    description: "Traditional Indian sweets made with authentic recipes",
    isActive: true,
  },
  {
    id: "cat-2",
    name: "Hot Snacks",
    slug: "hot-snacks",
    description: "Freshly prepared hot snacks and savories",
    isActive: true,
  },
  {
    id: "cat-3",
    name: "Pickles",
    slug: "pickles",
    description: "Traditional pickles and preserves",
    isActive: true,
  },
  {
    id: "cat-4",
    name: "Powders",
    slug: "powders",
    description: "Spice powders and masala mixes",
    isActive: true,
  },
  {
    id: "cat-5",
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Curated gift boxes for special occasions",
    isActive: true,
  },
];

/**
 * Helper Functions
 * Functions to query and filter product data
 */

/**
 * Product type definition for static data
 */
interface StaticProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  category?: {
    id?: string;
    name: string;
    slug: string;
  };
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isVisible?: boolean;
  [key: string]: unknown;
}

/**
 * Get products filtered by category slug
 * @param categorySlug - Category slug to filter by
 * @returns Array of products in the specified category
 */
export function getProductsByCategory(categorySlug: string) {
  const products = getAllProducts();
  return products.filter((product: StaticProduct) => product.category?.slug === categorySlug);
}

/**
 * Get all products marked as featured
 * @returns Array of featured products
 */
export function getFeaturedProducts() {
  const products = getAllProducts();
  return products.filter((product: StaticProduct) => product.isFeatured);
}

/**
 * Get all products marked as best sellers
 * @returns Array of best seller products
 */
export function getBestSellerProducts() {
  const products = getAllProducts();
  return products.filter((product: StaticProduct) => product.isBestSeller);
}

/**
 * Find a product by its slug
 * @param slug - Product slug identifier
 * @returns Product object or undefined if not found
 */
export function getProductBySlug(slug: string) {
  const products = getAllProducts();
  return products.find((product: StaticProduct) => product.slug === slug);
}

/**
 * Get all available products
 * Checks localStorage for admin-edited products first, then falls back to static data
 * @returns Array of all products
 */
export function getAllProducts() {
  if (typeof window !== "undefined") {
    try {
      const adminProducts = localStorage.getItem("adminProducts");
      if (adminProducts) {
        const parsed = JSON.parse(adminProducts);
        // Ensure all products default to visible if not set
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return parsed.map((p: any) => ({
          ...p,
          isVisible: p.isVisible !== undefined ? p.isVisible : true, // Default to visible
        }));
      }
    } catch (error) {
      console.error("Error loading admin products:", error);
    }
  }
  // Return static products with default visibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return staticProducts.map((p: any) => ({
    ...p,
    isVisible: p.isVisible !== undefined ? p.isVisible : true, // Default to visible
  }));
}

/**
 * Get all product categories
 * Checks localStorage for admin-edited categories first, then falls back to static data
 * @returns Array of all categories
 */
export function getAllCategories() {
  if (typeof window !== "undefined") {
    try {
      const adminCategories = localStorage.getItem("adminCategories");
      if (adminCategories) {
        return JSON.parse(adminCategories);
      }
    } catch (error) {
      console.error("Error loading admin categories:", error);
    }
  }
  return staticCategories;
}
