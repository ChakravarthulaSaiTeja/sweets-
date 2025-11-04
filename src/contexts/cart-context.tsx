"use client";

/**
 * Cart Context Provider
 * 
 * Manages shopping cart state and operations using React Context API.
 * Handles cart persistence in localStorage for guest users (static export mode).
 * Provides cart operations: add, remove, update quantity, and clear cart.
 * 
 * Features:
 * - localStorage persistence for guest users
 * - Real-time cart calculations (totals, item count)
 * - Product data fetching from static data source
 */

import { createContext, useContext, useReducer, useEffect } from "react";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
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
      payload: { productId: string; quantity: number };
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
        (sum, item) => sum + item.product.price * item.quantity,
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
        (item) => item.productId !== action.payload,
      );
      const totalItemsAfterRemove = filteredItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPriceAfterRemove = filteredItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
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
          payload: action.payload.productId,
        });
      }
      const updatedQuantityItems = state.items.map((item) =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
      const totalItemsAfterUpdate = updatedQuantityItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalPriceAfterUpdate = updatedQuantityItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
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
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /**
   * Fetches cart from localStorage and loads it into state
   * Called on component mount to restore cart for guest users
   */
  const fetchCart = async () => {
    // Load from localStorage for static export mode (guest users)
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: "SET_CART", payload: cartItems });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  };

  /**
   * Adds a product to the cart
   * Fetches product details from static data and updates localStorage
   * @param productId - Product ID or slug to add
   * @param quantity - Quantity to add (defaults to incrementing if item exists)
   */
  const addToCart = async (productId: string, quantity: number) => {
    // For static export mode, fetch product from static data
    try {
      const { staticProducts } = await import("@/lib/static-data");
      const product = staticProducts.find((p) => p.id === productId || p.slug === productId);
      
      if (product) {
        const newItem = {
          id: `guest-${productId}`,
          productId: product.id,
          quantity,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images || [],
            slug: product.slug,
          },
        };

        // Load existing cart from localStorage
        const savedCart = localStorage.getItem("cart");
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        const existingItemIndex = cartItems.findIndex(
          (item: CartItem) => item.productId === product.id,
        );

        // Update quantity if item exists, otherwise add new item
        if (existingItemIndex >= 0) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push(newItem);
        }

        // Persist to localStorage and update state
        localStorage.setItem("cart", JSON.stringify(cartItems));
        dispatch({ type: "SET_CART", payload: cartItems });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  /**
   * Removes a product from the cart
   * @param productId - Product ID to remove
   */
  const removeFromCart = async (productId: string) => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart).filter(
        (item: CartItem) => item.productId !== productId,
      );
      localStorage.setItem("cart", JSON.stringify(cartItems));
      dispatch({ type: "SET_CART", payload: cartItems });
    }
  };

  /**
   * Updates the quantity of a cart item
   * @param productId - Product ID to update
   * @param quantity - New quantity (if 0, item will be removed)
   */
  const updateQuantity = async (productId: string, quantity: number) => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems = JSON.parse(savedCart).map((item: CartItem) =>
        item.productId === productId ? { ...item, quantity } : item,
      );
      localStorage.setItem("cart", JSON.stringify(cartItems));
      dispatch({ type: "SET_CART", payload: cartItems });
    }
  };

  /**
   * Clears all items from the cart
   */
  const clearCart = async () => {
    localStorage.removeItem("cart");
    dispatch({ type: "CLEAR_CART" });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
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
