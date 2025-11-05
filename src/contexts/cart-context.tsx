"use client";

/**
 * Cart Context Provider
 * 
 * Manages shopping cart state and operations using React Context API.
 * Uses API routes for cart persistence (requires authentication).
 * Provides cart operations: add, remove, update quantity, and clear cart.
 * 
 * Features:
 * - API-based cart storage (requires login)
 * - Real-time cart calculations (totals, item count)
 * - Shows "Please sign in" message if user not authenticated
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
 * Cart Reducer
 * 
 * Manages cart state transitions based on action types.
 * Handles: loading state, setting cart, removing items, updating quantities, and clearing cart.
 * 
 * Note: ADD_ITEM action is handled directly in addToCart function to fetch product data.
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_CART":
      // Calculate totals when setting cart items
      const totalItems = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPrice = action.payload.reduce(
        (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
        0,
      );
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        isLoading: false,
      };

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter(
        (item) => item.variantId !== action.payload,
      );
      const totalItemsAfterRemove = filteredItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPriceAfterRemove = filteredItems.reduce(
        (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
        0,
      );
      return {
        ...state,
        items: filteredItems,
        totalItems: totalItemsAfterRemove,
        totalPrice: totalPriceAfterRemove,
      };

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: action.payload.variantId,
        });
      }
      const updatedQuantityItems = state.items.map((item) =>
        item.variantId === action.payload.variantId
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
      const totalItemsAfterUpdate = updatedQuantityItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPriceAfterUpdate = updatedQuantityItems.reduce(
        (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
        0,
      );
      return {
        ...state,
        items: updatedQuantityItems,
        totalItems: totalItemsAfterUpdate,
        totalPrice: totalPriceAfterUpdate,
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
   * Fetches cart from API and loads it into state
   * Called on component mount and when authenticated
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
   * Adds a variant to the cart via API
   * @param variantId - Variant ID to add
   * @param quantity - Quantity to add
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
   * Removes a variant from the cart via API
   * @param variantId - Variant ID to remove
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
   * Updates the quantity of a cart item via API
   * @param variantId - Variant ID to update
   * @param quantity - New quantity (if 0, item will be removed)
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
   * Clears all items from the cart via API
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart if not authenticated
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

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
