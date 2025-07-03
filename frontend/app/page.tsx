/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import Image from "next/image";
import { Button } from "../../frontend/components/ui/button";
import { fetchProducts } from "../data/products";
import ProductCard from "../../frontend/components/product/product-card";
import { ArrowRight, BadgeCheck, Package, Shield, Truck } from "lucide-react";

export default async function Home() {
  const featuredProducts = await fetchProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Elevate Your <span className="text-primary">Badminton</span>{" "}
                Game
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
                Premium equipment for players of all levels. From
                professional-grade rackets to comfortable apparel, we have
                everything you need to dominate the court.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/guides">Buying Guides</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 relative w-full h-[300px] md:h-[400px]">
              <Image
                src="https://res.cloudinary.com/dxqpfefkv/image/upload/v1748500389/irish83-sxwRpLJTuXc-unsplash_xoams0.jpg"
                alt="Badminton Equipment"
                fill
                className="object-cover object-[90%_10%] rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {["Rackets", "Shuttlecocks", "Shoes", "Apparel", "Accessories"].map(
              (category) => (
                <Link
                  href={`/products/category/${category.toLowerCase()}`}
                  key={category}
                  className="bg-muted rounded-lg p-6 text-center hover:bg-muted/80 transition-colors group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {/* Simple icon placeholder - in a real project you'd use specific icons */}
                      <span className="text-2xl font-bold text-primary">
                        {category.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-medium">{category}</h3>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Our Products</h2>
            <Button variant="outline" asChild className="mt-4 md:mt-0">
              <Link href="/products" className="flex items-center gap-2">
                View All Products <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
              <BadgeCheck size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-muted-foreground">
                All our products are 100% authentic with manufacturer warranty.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
              <Truck size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $50 with quick delivery options.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
              <Shield size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">
                Multiple secure payment methods for your convenience.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
              <Package size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">
                30-day hassle-free return policy for all purchases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah K.",
                role: "Professional Player",
                quote:
                  "The quality of rackets I purchased has significantly improved my game. Fast shipping and excellent customer service!",
              },
              {
                name: "David L.",
                role: "Club Player",
                quote:
                  "I've been shopping here for years. Always great products at competitive prices. The size guide was especially helpful.",
              },
              {
                name: "Emma W.",
                role: "Badminton Coach",
                quote:
                  "I recommend Ace Badminton to all my students. Their selection of training shuttlecocks is unmatched in quality and value.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals,
              and badminton tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md bg-primary-foreground text-primary border border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
