"use client";

/**
 * Cart Context Provider
 * 
 * This file manages the shopping cart state for the entire application using React Context API.
 * 
 * What is React Context?
 * - Context allows you to share state across components without prop drilling
 * - Any component can access cart data using `useCart()` hook
 * - Cart state is stored in React state, synced with database via API
 * 
 * Architecture:
 * - Frontend: React Context + useReducer (manages local state)
 * - Backend: API routes in `/api/cart` (persists to PostgreSQL database)
 * - Authentication: Required - users must sign in to add items to cart
 * 
 * Features:
 * 1. API-based cart storage (requires login)
 *    - Cart items are stored in PostgreSQL database
 *    - Each user has their own cart
 *    - Cart persists across browser sessions
 * 
 * 2. Real-time cart calculations
 *    - Automatically calculates total items count
 *    - Automatically calculates total price
 *    - Updates when items are added/removed/updated
 * 
 * 3. User-friendly messages
 *    - Shows "Please sign in" if user not authenticated
 *    - Shows error messages if API calls fail
 *    - Shows loading state during API operations
 * 
 * How to Use:
 * ```tsx
 * import { useCart } from "@/contexts/cart-context";
 * 
 * function MyComponent() {
 *   const { state, addToCart, removeFromCart } = useCart();
 *   
 *   // Access cart items
 *   console.log(state.items); // Array of cart items
 *   console.log(state.totalItems); // Total quantity
 *   console.log(state.totalPrice); // Total price
 *   
 *   // Add item to cart
 *   await addToCart("variant_id", 2);
 * }
 * ```
 */

import { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
  variant?: {
    id: string;
    name: string;
    price: number;
    sku: string;
    inventoryQty: number;
  };
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "REMOVE_ITEM"; payload: string }
    | {
      type: "UPDATE_QUANTITY";
      payload: { variantId: string; quantity: number };
    }
  | { type: "CLEAR_CART" };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
};

/**
 * Cart Reducer Function
 * 
 * This is a "reducer" function used with React's useReducer hook.
 * 
 * What is a Reducer?
 * - A reducer is a pure function that takes current state and an action
 * - It returns the new state based on the action type
 * - This pattern is commonly used for managing complex state
 * 
 * How It Works:
 * 1. Receives current state and an action (type + payload)
 * 2. Uses switch statement to handle different action types
 * 3. Returns new state object (never mutates original state)
 * 
 * Action Types:
 * - SET_LOADING: Shows/hides loading spinner
 * - SET_CART: Replaces entire cart with new items (from API)
 * - REMOVE_ITEM: Removes one item from cart
 * - UPDATE_QUANTITY: Updates quantity of one item
 * - CLEAR_CART: Removes all items from cart
 * 
 * Why Reducer Pattern?
 * - All state updates go through one function (easier to debug)
 * - Predictable state changes
 * - Easy to add new action types
 * 
 * @param state - Current cart state (items, totals, loading)
 * @param action - Action object with type and optional payload
 * @returns New cart state
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_CART":
      // This action is called when cart is fetched from API
      // We need to calculate totals from the cart items
      
      // Calculate total number of items (sum of all quantities)
      // Example: [2x Gulab Jamun, 3x Jalebi] = 5 total items
      const totalItems = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      
      // Calculate total price (sum of price × quantity for each item)
      // Use variant price if available, otherwise use product price
      // Example: (280 × 2) + (300 × 3) = 560 + 900 = 1460
      const totalPrice = action.payload.reduce(
        (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
        0,
      );
      
      // Return new state with updated cart items and calculated totals
      return {
        ...state,
        items: action.payload, // New cart items from API
        totalItems, // Calculated total quantity
        totalPrice, // Calculated total price
        isLoading: false, // Stop showing loading spinner
      };

    case "REMOVE_ITEM":
      // Remove item from cart by filtering out the item with matching variantId
      // Filter creates a new array without the removed item
      const filteredItems = state.items.filter(
        (item) => item.variantId !== action.payload, // Keep items that don't match the variantId to remove
      );
      
      // Recalculate totals after removing item
      const totalItemsAfterRemove = filteredItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPriceAfterRemove = filteredItems.reduce(
        (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
        0,
      );
      
      // Return new state with item removed and updated totals
      return {
        ...state,
        items: filteredItems, // Cart without the removed item
        totalItems: totalItemsAfterRemove, // Updated total quantity
        totalPrice: totalPriceAfterRemove, // Updated total price
      };

    case "UPDATE_QUANTITY":
      // If quantity is 0 or negative, remove the item instead
      // This handles edge case where user sets quantity to 0
      if (action.payload.quantity <= 0) {
        // Recursively call reducer with REMOVE_ITEM action
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: action.payload.variantId,
        });
      }
      
      // Update quantity of specific item by mapping over all items
      // Map creates a new array with updated quantity for matching item
      const updatedQuantityItems = state.items.map((item) =>
        // If this is the item to update, create new object with updated quantity
        // Otherwise, return the item unchanged
        item.variantId === action.payload.variantId
          ? { ...item, quantity: action.payload.quantity } // Spread operator copies all properties, updates quantity
          : item, // Keep other items unchanged
      );
      
      // Recalculate totals after updating quantity
      const totalItemsAfterUpdate = updatedQuantityItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPriceAfterUpdate = updatedQuantityItems.reduce(
        (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
        0,
      );
      
      // Return new state with updated quantity and recalculated totals
      return {
        ...state,
        items: updatedQuantityItems, // Cart with updated quantity
        totalItems: totalItemsAfterUpdate, // Updated total quantity
        totalPrice: totalPriceAfterUpdate, // Updated total price
      };

    case "CLEAR_CART":
      return { ...state, items: [], totalItems: 0, totalPrice: 0 };

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  /**
   * Fetches cart from API and loads it into React state
   * 
   * This function:
   * 1. Checks if user is authenticated
   * 2. Calls GET /api/cart to fetch cart items from database
   * 3. Updates React state with fetched cart items
   * 4. Automatically calculates totals (handled by reducer)
   * 
   * When is this called?
   * - When component first mounts (useEffect)
   * - After adding/removing/updating items
   * - When user signs in
   * 
   * @returns Promise that resolves when cart is fetched
   */
  const fetchCart = async () => {
    if (!isAuthenticated) {
      // Show message that login is required
      dispatch({ type: "SET_CART", payload: [] });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "SET_CART", payload: data.items || [] });
      } else if (response.status === 401) {
        // Not authenticated
        dispatch({ type: "SET_CART", payload: [] });
      } else {
        console.error("Error fetching cart:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  /**
   * Adds a product variant to the cart
   * 
   * Flow:
   * 1. Check if user is authenticated (if not, show sign-in message)
   * 2. Show loading spinner
   * 3. Call POST /api/cart with variantId and quantity
   * 4. If successful, refresh cart from API (to get updated totals)
   * 5. If error, show error message to user
   * 6. Hide loading spinner
   * 
   * Example Usage:
   * ```tsx
   * await addToCart("variant_500g_gulab_jamun", 2); // Add 2 units of 500g Gulab Jamun
   * ```
   * 
   * @param variantId - The ID of the product variant to add (e.g., "500g" or "1kg")
   * @param quantity - How many units to add (must be >= 1)
   * @returns Promise that resolves when item is added (or rejects on error)
   */
  const addToCart = async (variantId: string, quantity: number) => {
    if (!isAuthenticated) {
      alert("Please sign in to add items to cart");
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId, quantity }),
      });

      if (response.ok) {
        // Refresh cart after adding
        await fetchCart();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to add to cart (${response.status})`;
        console.error("Cart API error:", errorMessage, response.status);
        alert(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart";
      alert(errorMessage);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  /**
   * Removes a product variant from the cart
   * 
   * Flow:
   * 1. Check if user is authenticated
   * 2. Call DELETE /api/cart/[variantId] to remove from database
   * 3. Update local state immediately (optimistic update for better UX)
   * 4. Refresh cart from API to ensure consistency
   * 
   * Optimistic Update:
   * - We update local state immediately before API call completes
   * - This makes the UI feel faster and more responsive
   * - If API call fails, we refresh from server to get correct state
   * 
   * @param variantId - The ID of the variant to remove from cart
   * @returns Promise that resolves when item is removed
   */
  const removeFromCart = async (variantId: string) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await fetch(`/api/cart/${variantId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update local state immediately for better UX
        dispatch({ type: "REMOVE_ITEM", payload: variantId });
        // Then refresh from server
        await fetchCart();
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item from cart");
    }
  };

  /**
   * Updates the quantity of a cart item
   * 
   * Flow:
   * 1. Check if user is authenticated
   * 2. If quantity is 0 or less, remove item instead
   * 3. Call PUT /api/cart/[variantId] with new quantity
   * 4. Update local state immediately (optimistic update)
   * 5. Refresh cart from API to ensure consistency
   * 
   * Example Usage:
   * ```tsx
   * await updateQuantity("variant_id", 5); // Change quantity to 5
   * await updateQuantity("variant_id", 0); // Remove item (quantity 0)
   * ```
   * 
   * @param variantId - The ID of the variant to update
   * @param quantity - New quantity (must be >= 1, or 0 to remove)
   * @returns Promise that resolves when quantity is updated
   */
  const updateQuantity = async (variantId: string, quantity: number) => {
    if (!isAuthenticated) {
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(variantId);
      return;
    }

    try {
      const response = await fetch(`/api/cart/${variantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        // Update local state immediately
        dispatch({ type: "UPDATE_QUANTITY", payload: { variantId, quantity } });
        // Then refresh from server
        await fetchCart();
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || `Failed to update quantity (${response.status})`;
        console.error("Cart update API error:", errorMessage, response.status);
        alert(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update quantity";
      alert(errorMessage);
    }
  };

  /**
   * Clears all items from the cart
   * 
   * Flow:
   * 1. Check if user is authenticated
   * 2. Call DELETE /api/cart/clear to remove all items from database
   * 3. Update local state to empty cart
   * 
   * When is this called?
   * - After successful order placement
   * - When user manually clears cart
   * 
   * @returns Promise that resolves when cart is cleared
   */
  const clearCart = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await fetch("/api/cart/clear", {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({ type: "CLEAR_CART" });
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart");
    }
  };

  /**
   * useEffect Hook - Auto-fetch cart when authentication status changes
   * 
   * This hook runs whenever `isAuthenticated` changes:
   * - When user signs in: Fetch their cart from database
   * - When user signs out: Clear cart from local state
   * 
   * Why useEffect?
   * - Automatically syncs cart with authentication state
   * - No need to manually call fetchCart() when user signs in
   * - Ensures cart is always up-to-date with user's session
   * 
   * Dependency Array: [isAuthenticated]
   * - Hook only runs when isAuthenticated value changes
   * - Prevents infinite loops (doesn't run on every render)
   */
  useEffect(() => {
    if (isAuthenticated) {
      // User is signed in - fetch their cart from database
      fetchCart();
    } else {
      // User is signed out - clear cart from local state
      // This prevents showing previous user's cart to new user
      dispatch({ type: "SET_CART", payload: [] });
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart Hook
 * 
 * Custom React hook to access cart state and operations.
 * 
 * Usage:
 * ```tsx
 * import { useCart } from "@/contexts/cart-context";
 * 
 * function MyComponent() {
 *   const { state, addToCart, removeFromCart } = useCart();
 *   
 *   return (
 *     <div>
 *       <p>Items in cart: {state.totalItems}</p>
 *       <button onClick={() => addToCart("variant_id", 1)}>
 *         Add to Cart
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * Returns:
 * - state: Cart state object (items, totalItems, totalPrice, isLoading)
 * - addToCart: Function to add item to cart
 * - removeFromCart: Function to remove item from cart
 * - updateQuantity: Function to update item quantity
 * - clearCart: Function to clear all items
 * - fetchCart: Function to manually refresh cart from API
 * - isAuthenticated: Boolean indicating if user is logged in
 * 
 * @throws Error if used outside of CartProvider
 * @returns CartContextType with cart state and operations
 */
export function useCart() {
  // Get cart context from React Context API
  const context = useContext(CartContext);
  
  // Safety check: Ensure hook is used within CartProvider
  // This prevents confusing errors if someone forgets to wrap component with CartProvider
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}
