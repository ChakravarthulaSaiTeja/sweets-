"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";

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
  | { type: "ADD_ITEM"; payload: { productId: string; quantity: number } }
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

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_CART":
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

    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );
        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
        return { ...state, items: updatedItems, totalItems, totalPrice };
      }
      // If item doesn't exist, we need to fetch product details
      return state;

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
  const { data: session } = useSession();

  const fetchCart = async () => {
    if (!session) {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: "SET_CART", payload: cartItems });
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const cartItems = await response.json();
        dispatch({ type: "SET_CART", payload: cartItems });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!session) {
      // For guest users, we need to fetch product details first
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const product = await response.json();
          const newItem = {
            id: `guest-${productId}`,
            productId,
            quantity,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images,
              slug: product.slug,
            },
          };

          const savedCart = localStorage.getItem("cart");
          const cartItems = savedCart ? JSON.parse(savedCart) : [];
          const existingItemIndex = cartItems.findIndex(
            (item: CartItem) => item.productId === productId,
          );

          if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += quantity;
          } else {
            cartItems.push(newItem);
          }

          localStorage.setItem("cart", JSON.stringify(cartItems));
          dispatch({ type: "SET_CART", payload: cartItems });
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cartItems = JSON.parse(savedCart).filter(
          (item: CartItem) => item.productId !== productId,
        );
        localStorage.setItem("cart", JSON.stringify(cartItems));
        dispatch({ type: "SET_CART", payload: cartItems });
      }
      return;
    }

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session) {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cartItems = JSON.parse(savedCart).map((item: CartItem) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
        localStorage.setItem("cart", JSON.stringify(cartItems));
        dispatch({ type: "SET_CART", payload: cartItems });
      }
      return;
    }

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const clearCart = async () => {
    if (!session) {
      localStorage.removeItem("cart");
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({ type: "CLEAR_CART" });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [session]);

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
