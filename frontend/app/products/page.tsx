import { fetchProducts } from "@/data/products";
import { Product } from "@/fron@/frontend/data/productsuct";
import ProductsClient from "./products-client";
import { Suspense } from "react";

async function ProductsList() {
  try {
    console.log("Fetching products...");
    const products = await fetchProducts();
    console.log("Fetched products:", products);

    if (!products || products.length === 0) {
      console.log("No products found");
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">No Products Available</h2>
          <p className="text-muted-foreground">
            There are no products available at the moment.
          </p>
        </div>
      );
    }

    return <ProductsClient initialProducts={products} />;
  } catch (error) {
    console.error("Error loading products:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
        <p className="text-muted-foreground">
          There was an error loading the products. Please try again later.
        </p>
      </div>
    );
  }
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Loading Products...</h2>
          <p className="text-muted-foreground">
            Please wait while we load the products.
          </p>
        </div>
      }
    >
      <ProductsList />
    </Suspense>
  );
}
