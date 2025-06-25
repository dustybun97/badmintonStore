"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Lock, CreditCard, Truck } from "lucide-react";
import { Address } from "@/types/order";

const checkoutSchema = z.object ({
  // Shipping info@/frontend/hooks/use-toast
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(5, "Phone number is required"),

  // Payment info
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string().min(13, "Valid card number is required"),
  cardExpiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Expiry date should be in MM/YY format"),
  cardCvc: z.string().min(3, "CVC is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "paypal">(
    "credit_card"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      phone: "",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some products to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Create shipping address from form data
    const shippingAddress: Address = {
      firstName: data.firstName,
      lastName: data.lastName,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
    };

    // Mock API call to create order
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful order
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      // Clear the cart
      clearCart();

      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been confirmed.`,
      });

      // Redirect to confirmation page
      router.push(`/order-confirmation?id=${orderId}`);
    } catch (error) {
      toast({
        title: "Error processing order",
        description:
          "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect to cart if empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-8">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Button asChild>
          <a href="/products">Browse Products</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your purchase by providing shipping and payment details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue="shipping" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="shipping"
                      className="flex items-center gap-2"
                    >
                      <Truck className="h-4 w-4" /> Shipping
                    </TabsTrigger>
                    <TabsTrigger
                      value="payment"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" /> Payment
                    </TabsTrigger>
                    <TabsTrigger
                      value="review"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> Review
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="shipping" className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Shipping Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address1"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Address Line 1</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address2"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Address Line 2 (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Apt 4B" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="US">
                                    United States
                                  </SelectItem>
                                  <SelectItem value="CA">Canada</SelectItem>
                                  <SelectItem value="UK">
                                    United Kingdom
                                  </SelectItem>
                                  <SelectItem value="AU">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(123) 456-7890"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="payment" className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Payment Method
                      </h2>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div
                          className={`border rounded-lg p-4 cursor-pointer ${
                            paymentMethod === "credit_card"
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          onClick={() => setPaymentMethod("credit_card")}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-5 w-5" />
                              <span className="font-medium">Credit Card</span>
                            </div>
                            <div
                              className={`h-4 w-4 rounded-full border ${
                                paymentMethod === "credit_card"
                                  ? "border-primary"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {paymentMethod === "credit_card" && (
                                <div className="h-2 w-2 m-1 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`border rounded-lg p-4 cursor-pointer ${
                            paymentMethod === "paypal"
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          onClick={() => setPaymentMethod("paypal")}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <svg
                                className="h-5 w-5 text-blue-600"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.352-.024.15a.8.8 0 0 1-.79.679h-3.728a.483.483 0 0 1-.477-.558l.134-.902.648-4.164.041-.23a.802.802 0 0 1 .792-.681h.5c3.238 0 5.774-1.314 6.514-5.12.173-.9.173-1.684 0-2.334a1.205 1.205 0 0 0-.031-.08 5.829 5.829 0 0 1 3.949-.459zM8.684 3.574a7.348 7.348 0 0 1 3.334-.574l2.35-.004c2.952 0 5.263 1.3 5.89 4.895.1.265.298 1.073.298 1.073-.18-2.523-1.434-3.647-2.94-4.306-1.277-.56-2.786-.647-3.755-.647h-6.555a.804.804 0 0 0-.796.692l-2.04 12.693a.487.487 0 0 0 .48.572h3.714L8.684 3.574z" />
                              </svg>
                              <span className="font-medium">PayPal</span>
                            </div>
                            <div
                              className={`h-4 w-4 rounded-full border ${
                                paymentMethod === "paypal"
                                  ? "border-primary"
                                  : "border-muted-foreground"
                              }`}
                            >
                              {paymentMethod === "paypal" && (
                                <div className="h-2 w-2 m-1 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === "credit_card" && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="4242 4242 4242 4242"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="cardExpiry"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cardCvc"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVC</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {paymentMethod === "paypal" && (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground mb-4">
                            You will be redirected to PayPal to complete your
                            payment.
                          </p>
                          <Button
                            type="button"
                            className="bg-[#0070ba] hover:bg-[#003087] text-white"
                          >
                            Continue with PayPal
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="review" className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Order Review
                      </h2>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">
                            Items ({cartItems.length})
                          </h3>
                          <div className="space-y-2">
                            {cartItems.map((item) => (
                              <div
                                key={item.product.id}
                                className="flex justify-between"
                              >
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {item.product.name}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {" "}
                                    × {item.quantity}
                                  </span>
                                </div>
                                <div className="font-medium">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                  }).format(
                                    Number(item.product.price) * item.quantity
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">Shipping Address</h3>
                          <p className="text-muted-foreground">
                            {form.watch("firstName")} {form.watch("lastName")}
                            <br />
                            {form.watch("address1")}
                            {form.watch("address2") && (
                              <>
                                <br />
                                {form.watch("address2")}
                              </>
                            )}
                            <br />
                            {form.watch("city")}, {form.watch("state")}{" "}
                            {form.watch("postalCode")}
                            <br />
                            {form.watch("country") === "US"
                              ? "United States"
                              : form.watch("country")}
                            <br />
                            {form.watch("phone")}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">Payment Method</h3>
                          <p className="text-muted-foreground">
                            {paymentMethod === "credit_card"
                              ? "Credit Card ending in " +
                                form.watch("cardNumber").slice(-4)
                              : "PayPal"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <CardFooter className="flex justify-between border-t p-6">
                  <Button type="button" variant="outline">
                    Back to Cart
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="min-w-[120px]"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0
                    ? "Free"
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (7%)</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(tax)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(total)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 rounded-b-lg flex items-center justify-center py-4 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              Secure checkout powered by Stripe
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
