# Admin Dashboard Documentation

## Overview

The Badminton Shop Admin Dashboard provides comprehensive management tools for store administrators. It includes product management, category management, and real-time revenue analytics.

## Features

### 🏪 Product Management

- **Add Products**: Create new products with name, description, price, stock, image URL, and category
- **Edit Products**: Update existing product information
- **Delete Products**: Remove products from inventory
- **View Products**: See all products in a table format with stock status indicators
- **Stock Management**: Track inventory levels with visual indicators (In Stock, Low Stock, Out of Stock)

### 📂 Category Management

- **Add Categories**: Create new product categories
- **Edit Categories**: Update category names
- **Delete Categories**: Remove categories (with warning about affecting products)
- **Organize Products**: Categorize products for better organization

### 📊 Revenue Dashboard

- **Real-time Analytics**: View actual revenue data from your database
- **Revenue Overview**: Monthly revenue charts with customizable time ranges
- **Category Sales**: Pie chart showing sales distribution by category
- **Order Trends**: Line chart comparing orders and revenue over time
- **Key Metrics**:
  - Total Revenue
  - Total Orders
  - Product Count
  - Average Order Value
  - Growth percentages

## Setup Instructions

### 1. Database Setup

First, ensure your database is properly configured and the Prisma schema is up to date:

```bash
cd server
npm run generate
npx prisma db push
```

### 2. Seed the Database

Populate your database with sample data for testing:

```bash
cd server
npm run seed
```

This will create:

- 5 product categories (Rackets, Shuttlecocks, Shoes, Apparel, Accessories)
- 11 sample products with realistic badminton equipment
- 5 sample orders for revenue analytics

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

### 4. Start the Frontend

```bash
# From the root directory
npm run dev
```

### 5. Access Admin Dashboard

Navigate to `/admin` in your browser. You must be logged in as an admin user to access the dashboard.

## API Endpoints

The admin dashboard uses the following API endpoints:

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories

- `GET /categories` - Get all categories
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Orders

- `GET /orders` - Get all orders (for revenue analytics)

## Usage Guide

### Managing Products

1. **Adding a Product**:

   - Go to the "Products" tab
   - Click "Add Product"
   - Fill in the product details:
     - Name (required)
     - Description
     - Price (required)
     - Stock quantity (required)
     - Image URL
     - Category (select from dropdown)
   - Click "Add Product"

2. **Editing a Product**:

   - Find the product in the table
   - Click the edit icon (pencil)
   - Modify the information
   - Click "Update Product"

3. **Deleting a Product**:
   - Find the product in the table
   - Click the delete icon (trash)
   - Confirm the deletion

### Managing Categories

1. **Adding a Category**:

   - Go to the "Categories" tab
   - Click "Add Category"
   - Enter the category name
   - Click "Add Category"

2. **Editing a Category**:

   - Find the category in the table
   - Click the edit icon
   - Update the name
   - Click "Update Category"

3. **Deleting a Category**:
   - Find the category in the table
   - Click the delete icon
   - Confirm the deletion (warning will appear about affecting products)

### Viewing Analytics

1. **Revenue Overview**:

   - Go to the "Overview" tab
   - View the revenue dashboard
   - Use the time range selector to change the period (3, 6, or 12 months)

2. **Key Metrics**:

   - Total Revenue: Sum of all paid orders
   - Total Orders: Count of paid/shipped orders
   - Products: Total number of products in catalog
   - Average Order Value: Revenue divided by order count

3. **Charts**:
   - Revenue Overview: Bar chart showing monthly revenue
   - Sales by Category: Pie chart showing category distribution
   - Orders & Revenue Trend: Line chart comparing orders and revenue

## Security

- Only users with `admin` role can access the dashboard
- All API endpoints should be protected with authentication
- Admin privileges are checked on both frontend and backend

## Troubleshooting

### Common Issues

1. **"Access Denied" message**:

   - Ensure you're logged in as an admin user
   - Check that your user account has the `admin` role in the database

2. **Products not loading**:

   - Check that the backend server is running
   - Verify the API URL in your environment variables
   - Check browser console for error messages

3. **Revenue data not showing**:

   - Ensure you have orders in the database with `paid` or `shipped` status
   - Run the seed script to create sample data
   - Check that the orders API endpoint is working

4. **Categories not appearing in dropdown**:
   - Run the seed script to create categories
   - Check that the categories API endpoint is working

### Environment Variables

Make sure these environment variables are set:

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend (.env)
DATABASE_URL="postgresql://username:password@localhost:5432/badminton_shop"
```

## Customization

### Adding New Features

To add new features to the admin dashboard:

1. Create new components in `components/admin/`
2. Add new API endpoints in `server/src/routes/`
3. Update the main admin page to include new tabs
4. Add any necessary database schema changes

### Styling

The dashboard uses Tailwind CSS and shadcn/ui components. You can customize the styling by:

1. Modifying the component classes
2. Updating the theme in `tailwind.config.ts`
3. Creating custom CSS in `globals.css`

## Support

For issues or questions about the admin dashboard:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the database is properly seeded
4. Check that all API endpoints are responding correctly

## Future Enhancements

Potential improvements for the admin dashboard:

- [ ] Order management interface
- [ ] Customer management
- [ ] Inventory alerts for low stock
- [ ] Export functionality for reports
- [ ] Advanced filtering and search
- [ ] Bulk operations for products
- [ ] Image upload functionality
- [ ] Sales reports and analytics
- [ ] User activity logs
- [ ] Backup and restore functionality
