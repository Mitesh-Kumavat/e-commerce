import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartOfUser } from "@/api/cart";
import { checkoutOrder } from "@/api/order";
import { Loader2, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

interface Product {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
}

interface CartItem {
    product: Product;
    quantity: number;
    _id: string;
}


export const CheckoutPage = () => {
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: cartData, isLoading: isCartLoading, error: cartError } = useQuery({
        queryKey: ['cart'],
        queryFn: getCartOfUser,
    });

    const checkoutMutation = useMutation({
        mutationFn: checkoutOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast("Order Placed! 🎉", {
                description: "Your order has been successfully placed.",
            });
            navigate("/orders");
        },
        onError: () => {
            toast("Checkout failed", {
                description: "There was an error processing your order. Please try again.",
            });
        },
    });

    const cartItems: CartItem[] = cartData?.data?.items || [];
    const hasItems = cartItems.length > 0;

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) {
            toast.error("Address Required", {
                description: "Please provide a shipping address to place your order.",
            });
            return;
        }
        checkoutMutation.mutate(address);
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    };

    if (isCartLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (cartError) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-center text-destructive">
                <p>Failed to load cart data.</p>
            </div>
        );
    }

    if (!hasItems) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">You can't checkout with an empty cart. Please add some products first.</p>
                <Button asChild>
                    <Link to="/">Explore Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shipping Address Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <Label htmlFor="address" className="font-semibold my-2 py-2">Full Address</Label>
                                <Textarea
                                    id="address"
                                    placeholder="Enter your full shipping address..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={4}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={checkoutMutation.isPending}
                            >
                                {checkoutMutation.isPending ? (
                                    <Loader2 className="animate-spin mr-2" />
                                ) : (
                                    <CheckCircle2 className="mr-2" />
                                )}
                                Place Order
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2">
                            {cartItems.map((item) => (
                                <li key={item.product._id} className="flex justify-between items-center">
                                    <span>
                                        {item.product.name} x {item.quantity}
                                    </span>
                                    <span className="font-semibold">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <Separator />
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total Amount</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};