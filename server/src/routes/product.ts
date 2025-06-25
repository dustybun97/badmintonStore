// src/routes/product.ts
//ดึงคิวรีข้อมูลสินค้าจากฐานข้อมูลและส่งกลับเป็น JSON
// src/routes/product.ts

import { FastifyInstance } from "fastify";
import prisma from "../prisma";

export async function productRoutes(server: FastifyInstance) {
  // Get all products
  server.get("/products", async (request, reply) => {
    try {
      // 🟢 ใช้ include เพื่อดึงข้อมูล category.name มาด้วย
      const products = await prisma.products.findMany({
        include: {
          category: {
            select: { name: true }, // ดึงแค่ name ของ category
          },
        },
      });

      // 🟢 แปลง price (string) → number
      const formattedProducts = products.map((product) => ({
        ...product,
        price: parseFloat(product.price as any),
        categoryName: product.category?.name || null, // เพิ่มชื่อ category ใน field categoryName
      }));

      return formattedProducts;
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch products" });
    }
  });

  // Get product by ID
  server.get("/products/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      let product;

      // ตรวจสอบรูปแบบว่าเป็นตัวเลขหรือ UUID
      if (/^\d+$/.test(id)) {
        // Numeric id
        product = await prisma.products.findUnique({
          where: { numeric_id: Number(id) },
          include: {
            category: {
              select: { name: true }, // ดึงแค่ name ของ category
            },
          },
        });
      } else if (
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
          id
        )
      ) {
        // UUID
        product = await prisma.products.findUnique({
          where: { id: id },
          include: {
            category: {
              select: { name: true }, // ดึงแค่ name ของ category
            },
          },
        });
      } else {
        return reply
          .status(400)
          .send({ error: "Invalid id format. Must be numeric id or uuid." });
      }

      if (!product) {
        return reply.status(404).send({ error: "Product not found" });
      }

      // แปลง price (Decimal) → number และเพิ่ม categoryName
      const formattedProduct = {
        ...product,
        price: parseFloat(product.price as any),
        categoryName: product.category?.name || null, // เพิ่มชื่อ category ใน field categoryName
      };

      return formattedProduct;
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  // Create new product
  server.post("/products", async (request, reply) => {
    try {
      const { name, description, price, image_url, stock, category_id } =
        request.body as {
          name: string;
          description?: string;
          price: number;
          image_url?: string;
          stock: number;
          category_id?: number;
        };

      const product = await prisma.products.create({
        data: {
          name,
          description,
          price,
          image_url,
          stock,
          category_id,
        },
        include: {
          category: {
            select: { name: true },
          },
        },
      });

      const formattedProduct = {
        ...product,
        price: parseFloat(product.price as any),
        categoryName: product.category?.name || null,
      };

      return reply.status(201).send(formattedProduct);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to create product" });
    }
  });

  // Update product
  server.put("/products/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const { name, description, price, image_url, stock, category_id } =
        request.body as {
          name: string;
          description?: string;
          price: number;
          image_url?: string;
          stock: number;
          category_id?: number;
        };

      let product;

      if (/^\d+$/.test(id)) {
        // Numeric id
        product = await prisma.products.update({
          where: { numeric_id: Number(id) },
          data: {
            name,
            description,
            price,
            image_url,
            stock,
            category_id,
          },
          include: {
            category: {
              select: { name: true },
            },
          },
        });
      } else {
        // UUID
        product = await prisma.products.update({
          where: { id },
          data: {
            name,
            description,
            price,
            image_url,
            stock,
            category_id,
          },
          include: {
            category: {
              select: { name: true },
            },
          },
        });
      }

      const formattedProduct = {
        ...product,
        price: parseFloat(product.price as any),
        categoryName: product.category?.name || null,
      };

      return formattedProduct;
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to update product" });
    }
  });

  // Delete product
  server.delete("/products/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      if (/^\d+$/.test(id)) {
        // Numeric id
        await prisma.products.delete({
          where: { numeric_id: Number(id) },
        });
      } else {
        // UUID
        await prisma.products.delete({
          where: { id },
        });
      }

      return reply.status(204).send();
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to delete product" });
    }
  });

  // Get all categories
  server.get("/categories", async (request, reply) => {
    try {
      const categories = await prisma.categories.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return categories;
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch categories" });
    }
  });

  // Create new category
  server.post("/categories", async (request, reply) => {
    try {
      const { name } = request.body as { name: string };

      const category = await prisma.categories.create({
        data: { name },
      });

      return reply.status(201).send(category);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to create category" });
    }
  });

  // Update category
  server.put("/categories/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const { name } = request.body as { name: string };

      const category = await prisma.categories.update({
        where: { id: Number(id) },
        data: { name },
      });

      return category;
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to update category" });
    }
  });

  // Delete category
  server.delete("/categories/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.categories.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to delete category" });
    }
  });

  // Get all orders for admin dashboard
  server.get("/orders", async (request, reply) => {
    try {
      const orders = await prisma.orders.findMany({
        include: {
          order_items: {
            include: {
              products: {
                include: {
                  category: {
                    select: { name: true },
                  },
                },
              },
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const formattedOrders = orders.map((order) => ({
        ...order,
        total_price: parseFloat(order.total_price as any),
        order_items: order.order_items.map((item) => ({
          ...item,
          unit_price: parseFloat(item.unit_price as any),
        })),
      }));

      return formattedOrders;
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({ error: "Failed to fetch orders" });
    }
  });
}
