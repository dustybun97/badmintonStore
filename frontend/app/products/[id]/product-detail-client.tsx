"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  RefreshCcw,
  MinusCircle,
  PlusCircle,
  ShoppingCart,
  Star,
  Package,
} from "lucide-react";
import { Product } from "@/types/product";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(parseFloat(product.price.toString()));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="mb-4 pl-0 hover:bg-transparent"
        >
          <Link
            href="/products"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <nav className="flex text-sm text-muted-foreground mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <span>/</span>
              <Link href="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <span>/</span>
              <Link
                href={`/products/category/${
                  typeof product.category === "string"
                    ? product.category
                    : product.category_name || "uncategorized"
                }`}
                className="hover:text-foreground capitalize"
              >
                {product.category_name}
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <span>/</span>
              <span className="truncate max-w-[200px]">{product.name}</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {product.image_url && (
            <div className="flex space-x-2 overflow-auto py-2">
              <button
                onClick={() => setActiveImage(0)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                  activeImage === 0
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <Image
                  src={product.image_url}
                  alt={`${product.name} - view 1`}
                  fill
                  className="object-cover"
                />
              </button>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="text-sm text-muted-foreground">
                SKU: {product.id.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="text-2xl font-bold">{formattedPrice}</div>

          <div className="prose dark:prose-invert max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${
                product.stock > 10
                  ? "bg-green-500"
                  : product.stock > 0
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {product.stock > 10
                ? "In Stock"
                : product.stock > 0
                ? `Low Stock (${product.stock} left)`
                : "Out of Stock"}
            </span>
          </div>

          {/* Quantity Selector and Add to Cart */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    disabled={quantity === product.stock}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button
                  className="sm:flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  className="sm:flex-1"
                  variant="secondary"
                  size="lg"
                  asChild
                >
                  <Link href="/cart">Buy Now</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Product Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">2 Year Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCcw className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">30 Day Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Original Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="specifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent
            value="specifications"
            className="mt-6 p-6 border rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4">
              Technical Specifications
            </h3>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.description).map(([key, value]) => (
                <div key={key} className="flex border-b pb-2">
                  <span className="w-1/2 font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="w-1/2">{value}</span>
                </div>
              ))}
            </div> */}
          </TabsContent>

          <TabsContent value="shipping" className="mt-6 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Delivery Options</p>
                  <p className="text-sm text-muted-foreground">
                    Standard Shipping (3-5 business days): Free on orders over
                    $50, $4.99 for orders under $50
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Express Shipping (1-2 business days): $9.99
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">International Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    We ship to over 100 countries worldwide. International
                    shipping rates and delivery times vary by location.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RefreshCcw className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Returns & Exchanges</p>
                  <p className="text-sm text-muted-foreground">
                    If you're not completely satisfied with your purchase, you
                    can return it within 30 days for a full refund or exchange.
                    Items must be unused and in original packaging with tags
                    attached.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 p-6 border rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <Button variant="outline">Write a Review</Button>
            </div>

            <div className="flex flex-col space-y-6">
              {/* This would be a map of actual reviews in a real project */}
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="border-b pb-6 last:border-0">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {["JD", "SM", "AK"][idx - 1]}
                        </span>
                      </div>
                      <span className="font-medium">
                        {["John D.", "Sarah M.", "Alex K."][idx - 1]}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {["2 weeks ago", "1 month ago", "3 months ago"][idx - 1]}
                    </span>
                  </div>

                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < [5, 4, 5][idx - 1]
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>

                  <h4 className="font-medium mb-2">
                    {
                      [
                        "Excellent quality and performance",
                        "Great value for the price",
                        "Exactly as described, very happy",
                      ][idx - 1]
                    }
                  </h4>

                  <p className="text-muted-foreground">
                    {
                      [
                        "I've been using this racket for a few weeks now and I'm very impressed with its performance. The balance is perfect for my playing style and it has improved my smash power significantly.",
                        "This is my second purchase from Ace Badminton and I'm once again very satisfied with the quality. The shoes are comfortable and provide great support during quick movements.",
                        "The shuttlecocks are extremely durable compared to other brands I've used. They maintain their flight stability even after many hits. Will definitely buy again.",
                      ][idx - 1]
                    }
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
