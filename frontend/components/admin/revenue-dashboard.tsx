"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
} from "lucide-react";

interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

interface CategorySales {
  category: string;
  sales: number;
  percentage: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
  });
  const [timeRange, setTimeRange] = useState("6months");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders data
      const ordersResponse = await fetch(`${API_URL}/orders`);
      const orders = (await ordersResponse.ok)
        ? await ordersResponse.json()
        : [];

      // Fetch products data
      const productsResponse = await fetch(`${API_URL}/products`);
      const products = (await productsResponse.ok)
        ? await productsResponse.json()
        : [];

      // Process revenue data
      const processedRevenueData = processRevenueData(orders, timeRange);
      setRevenueData(processedRevenueData);

      // Process category sales
      const processedCategorySales = processCategorySales(orders, products);
      setCategorySales(processedCategorySales);

      // Calculate stats
      const calculatedStats = calculateStats(
        orders,
        products,
        processedRevenueData
      );
      setStats(calculatedStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (orders: any[], range: string): RevenueData[] => {
    const months = getMonthsArray(range);
    const monthlyData = new Map<string, { revenue: number; orders: number }>();

    // Initialize months with zero values
    months.forEach((month) => {
      monthlyData.set(month, { revenue: 0, orders: 0 });
    });

    // Process orders
    orders.forEach((order) => {
      if (order.status === "paid" || order.status === "shipped") {
        const orderDate = new Date(order.created_at);
        const monthKey = orderDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        });

        if (monthlyData.has(monthKey)) {
          const current = monthlyData.get(monthKey)!;
          current.revenue += parseFloat(order.total_price);
          current.orders += 1;
        }
      }
    });

    return months.map((month) => {
      const data = monthlyData.get(month)!;
      return {
        month,
        revenue: data.revenue,
        orders: data.orders,
      };
    });
  };

  const processCategorySales = (
    orders: any[],
    products: any[]
  ): CategorySales[] => {
    const categoryMap = new Map<string, number>();
    let totalSales = 0;

    // Create product map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate sales by category
    orders.forEach((order) => {
      if (order.status === "paid" || order.status === "shipped") {
        order.order_items?.forEach((item: any) => {
          const product = productMap.get(item.product_id);
          if (product && product.category?.name) {
            const categoryName = product.category.name;
            const itemTotal = parseFloat(item.unit_price) * item.quantity;
            categoryMap.set(
              categoryName,
              (categoryMap.get(categoryName) || 0) + itemTotal
            );
            totalSales += itemTotal;
          }
        });
      }
    });

    // Convert to array and calculate percentages
    return Array.from(categoryMap.entries())
      .map(([category, sales]) => ({
        category,
        sales,
        percentage: totalSales > 0 ? (sales / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.sales - a.sales);
  };

  const calculateStats = (
    orders: any[],
    products: any[],
    revenueData: RevenueData[]
  ): DashboardStats => {
    const paidOrders = orders.filter(
      (order) => order.status === "paid" || order.status === "shipped"
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_price),
      0
    );

    const totalOrders = paidOrders.length;
    const totalProducts = products.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth (comparing last 2 periods)
    const recentPeriods = revenueData.slice(-2);
    const revenueGrowth =
      recentPeriods.length >= 2 && recentPeriods[0].revenue > 0
        ? ((recentPeriods[1].revenue - recentPeriods[0].revenue) /
            recentPeriods[0].revenue) *
          100
        : 0;

    const orderGrowth =
      recentPeriods.length >= 2 && recentPeriods[0].orders > 0
        ? ((recentPeriods[1].orders - recentPeriods[0].orders) /
            recentPeriods[0].orders) *
          100
        : 0;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      averageOrderValue,
      revenueGrowth,
      orderGrowth,
    };
  };

  const getMonthsArray = (range: string): string[] => {
    const months = [];
    const now = new Date();

    let count = 6; // default
    switch (range) {
      case "3months":
        count = 3;
        break;
      case "6months":
        count = 6;
        break;
      case "12months":
        count = 12;
        break;
    }

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        })
      );
    }

    return months;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 mx-auto mb-4 animate-spin" />
          <p>Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
          <p className="text-muted-foreground">
            Track your store's performance and revenue metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description={`${
            stats.revenueGrowth >= 0 ? "+" : ""
          }${stats.revenueGrowth.toFixed(1)}% from last period`}
          icon={<DollarSign className="h-5 w-5" />}
          trend={stats.revenueGrowth >= 0 ? "up" : "down"}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          description={`${
            stats.orderGrowth >= 0 ? "+" : ""
          }${stats.orderGrowth.toFixed(1)}% from last period`}
          icon={<ShoppingCart className="h-5 w-5" />}
          trend={stats.orderGrowth >= 0 ? "up" : "down"}
        />
        <StatsCard
          title="Products"
          value={stats.totalProducts.toString()}
          description="Total products in catalog"
          icon={<Package className="h-5 w-5" />}
          trend="neutral"
        />
        <StatsCard
          title="Average Order Value"
          value={formatCurrency(stats.averageOrderValue)}
          description="Per completed order"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="neutral"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [
                    typeof value === "number" ? formatCurrency(value) : value,
                    "Revenue",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--chart-1))"
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Distribution of sales across product categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) =>
                      `${category} (${percentage.toFixed(1)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sales"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(value), "Sales"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No sales data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders and Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Orders & Revenue Trend</CardTitle>
          <CardDescription>
            Monthly orders and revenue comparison
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: any, name: string) => [
                  name === "revenue" ? formatCurrency(value) : value,
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--chart-3))"
                name="Orders"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-4))"
                name="Revenue"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {categorySales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Detailed breakdown of sales by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySales.map((category, index) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.percentage.toFixed(1)}% of total sales
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(category.sales)}
                    </div>
                    <Badge variant="secondary">
                      {category.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
            {icon}
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold">{value}</div>
            <div
              className={`text-xs ${
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                  ? "text-red-500"
                  : "text-muted-foreground"
              }`}
            >
              {description}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm font-medium">{title}</div>
      </CardContent>
    </Card>
  );
}
