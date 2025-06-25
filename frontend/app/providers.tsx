"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "../lib/cart-context";
import { AuthProvider } from "../lib/auth-context";
import { Toaster } from "../components/ui/toaster";
import { TooltipProvider } from "../components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
