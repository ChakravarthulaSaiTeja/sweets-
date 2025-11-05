/**
 * Cart API Route
 * 
 * This file handles all cart-related API operations.
 * 
 * Endpoints:
 * - GET /api/cart - Retrieve the current user's shopping cart
 * - POST /api/cart - Add a new item to the cart or update existing item quantity
 * 
 * Authentication:
 * - Both endpoints require the user to be authenticated (logged in)
 * - If user is not authenticated, returns 401 Unauthorized
 * 
 * Database:
 * - Uses Prisma ORM to interact with PostgreSQL database
 * - Cart items are stored in the `cart_items` table
 * - Each cart item is linked to a user and a product variant
 * 
 * Flow:
 * 1. User must be authenticated
 * 2. For GET: Fetch all cart items for the user from database
 * 3. For POST: Validate variant exists, check inventory, create/update cart item
 * 4. Return formatted cart data to frontend
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * GET /api/cart
 * 
 * Retrieves all items in the current user's shopping cart.
 * 
 * Steps:
 * 1. Check if user is authenticated
 * 2. Query database for all cart items belonging to this user
 * 3. Include product and variant details (name, price, images, etc.)
 * 4. Transform database format to frontend-friendly format
 * 5. Return cart items array
 * 
 * @param _request - NextRequest object (not used, but required by Next.js API route signature)
 * @returns JSON response with cart items array or error message
 * 
 * Response Format (Success):
 * {
 *   items: [
 *     {
 *       id: "cart_item_id",
 *       productId: "product_id",
 *       variantId: "variant_id",
 *       quantity: 2,
 *       product: { id, name, price, images, slug },
 *       variant: { id, name, price, sku, inventoryQty }
 *     }
 *   ]
 * }
 */
export async function GET(_request: NextRequest) {
  try {
    // Step 1: Get current authenticated user from session
    const user = await getCurrentUser();
    
    // Step 2: Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to view your cart" },
        { status: 401 }
      );
    }

    // Step 3: Query database for all cart items belonging to this user
    // We use Prisma's `include` to fetch related data (variant, product, category)
    // This is called "eager loading" - we get all related data in one query
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: user.id, // Only get cart items for this specific user
      },
      include: {
        // Include variant details (e.g., 500g, 1kg)
        variant: {
          include: {
            // Include product details (name, price, images)
            product: {
              include: {
                // Include category details (Sweets, Hot Snacks, etc.)
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recently added items first
      },
    });

    // Step 4: Transform database format to frontend-friendly format
    // The database returns nested objects, but frontend expects a flatter structure
    // Example transformation:
    // Database: { variant: { product: { name: "Gulab Jamun" } } }
    // Frontend: { product: { name: "Gulab Jamun" } }
    const formattedCartItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.variant.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        price: item.variant.price,
        images: item.variant.product.images,
        slug: item.variant.product.slug,
      },
      variant: {
        id: item.variant.id,
        name: item.variant.name,
        price: item.variant.price,
        sku: item.variant.sku,
        inventoryQty: item.variant.inventoryQty,
      },
    }));

    return NextResponse.json({ items: formattedCartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * 
 * Adds a new item to the cart or updates the quantity of an existing item.
 * 
 * Steps:
 * 1. Authenticate user
 * 2. Parse request body (variantId, quantity)
 * 3. Validate input data
 * 4. Check if variant exists and is available (active, visible, in stock)
 * 5. Check if item already exists in user's cart
 * 6. Calculate total quantity (existing + new)
 * 7. Verify inventory is sufficient
 * 8. Create new cart item OR update existing cart item quantity
 * 9. Return formatted cart item
 * 
 * @param request - NextRequest object containing the request body
 * @returns JSON response with created/updated cart item or error message
 * 
 * Request Body Format:
 * {
 *   variantId: "variant_id_string",  // Required: Which product variant to add (e.g., "500g" or "1kg")
 *   quantity: 2                      // Required: How many units to add (must be >= 1)
 * }
 * 
 * Response Format (Success):
 * {
 *   id: "cart_item_id",
 *   productId: "product_id",
 *   variantId: "variant_id",
 *   quantity: 2,
 *   product: { id, name, price, images, slug },
 *   variant: { id, name, price, sku, inventoryQty }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Get current authenticated user from session
    const user = await getCurrentUser();
    
    // Step 2: Verify user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in to add items to cart" },
        { status: 401 }
      );
    }

    // Step 3: Verify user ID exists in session (required for database operations)
    // This can happen if session was created before user.id was added to session
    if (!user.id) {
      console.error("User ID is missing from session. User may need to sign out and sign in again.");
      return NextResponse.json(
        { error: "Session error - Please sign out and sign in again" },
        { status: 401 }
      );
    }

    // Step 4: Parse request body to get variantId and quantity
    const body = await request.json();
    const { variantId, quantity } = body;

    // Step 5: Validate input data
    // Both variantId and quantity are required, and quantity must be at least 1
    if (!variantId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid request - variantId and quantity (>=1) required" },
        { status: 400 }
      );
    }

    // Step 6: Check if the variant exists in database and is available for purchase
    // We need to verify:
    // - Variant exists
    // - Variant is active (not disabled)
    // - Product is active (not disabled)
    // - Product is visible (not hidden from customers)
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            slug: true,
            isActive: true,
            isVisible: true,
          },
        },
      },
    });

    if (!variant || !variant.isActive || !variant.product.isActive || !variant.product.isVisible) {
      return NextResponse.json(
        { error: "Product variant not found or not available" },
        { status: 404 }
      );
    }

    // Step 7: Check if this item already exists in the user's cart
    // We use a unique constraint: one cart item per user per variant
    // This means if user already has "500g Gulab Jamun" in cart, we update quantity instead of creating duplicate
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        // Using compound unique key: userId + variantId
        // This ensures one cart entry per user per variant
        userId_variantId: {
          userId: user.id,
          variantId: variantId,
        },
      },
    });

    // Step 8: Calculate total quantity that will be in cart after this operation
    // If item already exists: add new quantity to existing quantity
    // If item doesn't exist: use the new quantity
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    // Step 9: Verify inventory is sufficient for the total quantity
    // We check against the total quantity (existing + new) to prevent overselling
    // Example: User has 5 in cart, tries to add 3 more, inventory must be >= 8
    if (variant.inventoryQty < totalQuantity) {
      return NextResponse.json(
        { 
          error: `Insufficient inventory. Only ${variant.inventoryQty} units available. You already have ${existingItem?.quantity || 0} in your cart.` 
        },
        { status: 400 }
      );
    }

    // Step 10: Create or update cart item
    let cartItem;
    if (existingItem) {
      // Item already exists in cart - update the quantity
      // This prevents duplicate cart entries for the same variant
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: totalQuantity,
        },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    } else {
      // Item doesn't exist in cart - create a new cart entry
      // This creates a new row in the cart_items table
      cartItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          variantId: variantId,
          quantity: quantity,
        },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    // Step 11: Transform database response to frontend-friendly format
    // We extract the nested product/variant data and flatten it
    const formattedItem = {
      id: cartItem.id,
      productId: cartItem.variant.productId,
      variantId: cartItem.variantId,
      quantity: cartItem.quantity,
      product: {
        id: cartItem.variant.product.id,
        name: cartItem.variant.product.name,
        price: cartItem.variant.price,
        images: cartItem.variant.product.images,
        slug: cartItem.variant.product.slug,
      },
      variant: {
        id: cartItem.variant.id,
        name: cartItem.variant.name,
        price: cartItem.variant.price,
        sku: cartItem.variant.sku,
        inventoryQty: cartItem.variant.inventoryQty,
      },
    };

    return NextResponse.json(formattedItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

