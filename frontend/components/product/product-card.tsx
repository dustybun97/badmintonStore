"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "../../types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(Number(product.price));

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-md group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              isHovered && product.image_url.length > 1
                ? "opacity-0"
                : "opacity-100"
            )}
          />
          {product.image_url.length > 1 && (
            <Image
              src={product.image_url}
              alt={`${product.name} - alternate view`}
              fill
              className={cn(
                "object-cover transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </Link>
        {product.featured && (
          <Badge className="absolute top-2 left-2 z-10 bg-primary">
            Featured
          </Badge>
        )}
        {product.stock <= 5 && (
          <Badge variant="secondary" className="absolute top-2 right-2 z-10">
            Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground capitalize">
            {product.categoryName || "Uncategorized"}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="block group-hover:text-primary transition-colors"
        >
          <h3 className="font-semibold truncate">{product.name}</h3>
        </Link>

        <div className="mt-2 font-semibold">{formattedPrice}</div>
      </CardContent>

      {showAddToCart && (
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={() => addToCart(product, 1)}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
