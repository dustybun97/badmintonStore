"use client";
import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ดึง category ให้เป็น string ล้วนๆ ไม่ว่าจะเป็น string หรือ object
  const categories = [
    "all",
    ...Array.from(
      new Set(
        initialProducts
          .map((product) => {
            if (typeof product.category === "string") {
              return product.category;
            } else if (
              product.category &&
              typeof product.category === "object" &&
              "name" in product.category
            ) {
              return product.category_name;
            }
            return "";
          })
          .filter(Boolean)
      )
    ),
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, category, priceRange, sortBy);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    applyFilters(searchTerm, value, priceRange, sortBy);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    applyFilters(searchTerm, category, newRange, sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(searchTerm, category, priceRange, value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("featured");
    setFilteredProducts(initialProducts);
  };

  const applyFilters = (
    search: string,
    cat: string,
    price: { min: string; max: string },
    sort: string
  ) => {
    let filtered = [...initialProducts];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter
    if (cat && cat !== "all") {
      filtered = filtered.filter((product) => {
        if (typeof product.category === "string") {
          return product.category === cat;
        } else if (
          product.category &&
          typeof product.category === "object" &&
          "name" in product.category
        ) {
          return product.category_name === cat;
        }
        return false;
      });
    }

    // Apply price filter
    if (price.min) {
      filtered = filtered.filter(
        (product) =>
          parseFloat(product.price.toString()) >= parseFloat(price.min)
      );
    }
    if (price.max) {
      filtered = filtered.filter(
        (product) =>
          parseFloat(product.price.toString()) <= parseFloat(price.max)
      );
    }

    // Apply sorting
    switch (sort) {
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
        // In a real app, this would sort by date
        break;
      // case "rating":
      //   filtered.sort((a, b) => b.rating - a.rating);
      //   break;
      default: // 'featured'
        filtered.sort((a, b) =>
          a.featured === b.featured ? 0 : a.featured ? -1 : 1
        );
        break;
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <nav className="flex text-sm text-muted-foreground">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4" />
                <span>Products</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="md:w-[300px]"
          />
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Desktop */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Filters</h2>
              {(searchTerm ||
                category !== "all" ||
                priceRange.min ||
                priceRange.max) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-0 text-primary hover:text-primary/90"
                >
                  Clear All
                </Button>
              )}
            </div>

            <Accordion type="multiple" defaultValue={["category", "price"]}>
              <AccordionItem value="category">
                <AccordionTrigger className="py-2">Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {categories.map((cat) => {
                      if (!cat) return null; // ⛔ skip ถ้า undefined
                      return (
                        <div key={cat} className="flex items-center">
                          <Button
                            variant="ghost"
                            className={`justify-start h-auto py-1 px-2 text-sm font-normal ${
                              category === cat
                                ? "text-primary font-medium"
                                : "text-foreground"
                            }`}
                            onClick={() => handleCategoryChange(cat)}
                          >
                            {cat === "all"
                              ? "All Categories"
                              : cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price">
                <AccordionTrigger className="py-2">
                  Price Range
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Min Price
                        </span>
                        <Input
                          type="number"
                          placeholder="$0"
                          value={priceRange.min}
                          onChange={(e) =>
                            handlePriceChange("min", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                          Max Price
                        </span>
                        <Input
                          type="number"
                          placeholder="$999"
                          value={priceRange.max}
                          onChange={(e) =>
                            handlePriceChange("max", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Mobile Filters Sheet */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 right-0 w-[300px] bg-background shadow-lg p-6 overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {(searchTerm ||
                category !== "all" ||
                priceRange.min ||
                priceRange.max) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mb-4 w-full"
                >
                  Clear All Filters
                </Button>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Category</h3>
                  <div className="space-y-2">
                    {categories
                      .filter((cat): cat is string => typeof cat === "string")
                      .map((cat) => (
                        <div key={cat} className="flex items-center">
                          <Button
                            variant="ghost"
                            className={`justify-start h-auto py-1 px-2 text-sm font-normal ${
                              category === cat
                                ? "text-primary font-medium"
                                : "text-foreground"
                            }`}
                            onClick={() => handleCategoryChange(cat)}
                          >
                            {cat === "all"
                              ? "All Categories"
                              : cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Min Price
                      </span>
                      <Input
                        type="number"
                        placeholder="$0"
                        value={priceRange.min}
                        onChange={(e) =>
                          handlePriceChange("min", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Max Price
                      </span>
                      <Input
                        type="number"
                        placeholder="$999"
                        value={priceRange.max}
                        onChange={(e) =>
                          handlePriceChange("max", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-bold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
