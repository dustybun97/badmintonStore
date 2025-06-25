"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "../hooks/use-toast";
import { Product } from "../../frontend/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const { toast } = useToast();

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse stored cart:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Update localStorage and calculate subtotal whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }

    // Calculate subtotal
    const newSubtotal = cartItems.reduce(
      (total, item) => total + Number(item.product.price) * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cartItems]);

  // Add to cart function
  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if the product is already in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id
      );

      // If it exists, update the quantity
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;

        toast({
          title: "Cart updated",
          description: `${product.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        });

        return updatedItems;
      }

      // Otherwise, add it as a new item
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });

      return [...prevItems, { product, quantity }];
    });
  };

  // Remove from cart function
  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => item.product.id !== productId
      );

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });

      return updatedItems;
    });
  };

  // Update quantity function
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart function
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
