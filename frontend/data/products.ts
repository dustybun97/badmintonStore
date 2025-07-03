// data/products.ts
import { Product } from "@/types/product";

// URL ของ backend API
const API_URL = "http://localhost:8080"; // หรือ URL ที่ deploy แล้ว
//process.env.NEXT_PUBLIC_API_URL ||
/**
 * ดึงข้อมูลสินค้าทั้งหมดจาก backend
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log("Making request to:", `${API_URL}/products`);
    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable caching to ensure fresh data
    });

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      throw new Error("Failed to fetch products");
    }

    const products: Product[] = await response.json();
    console.log("API Response:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * ดึงสินค้าตาม id
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

/**
 * ดึงสินค้าตาม category (ถ้า backend มี endpoint)
 */
export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products?category=${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }
    const products: Product[] = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}
