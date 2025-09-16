import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartOfUser, deleteItemFromCart } from "@/api/cart";
import { Loader2, ShoppingCartIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

// Define interfaces based on the API response
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

interface CartData {
    items: CartItem[];
    user: string;
    _id: string;
}

const CartPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['cart'],
        queryFn: getCartOfUser,
    });

    const cart: CartData | null = data?.data || null;
    const cartItems = cart?.items || [];
    const hasItems = cartItems.length > 0;

    const deleteMutation = useMutation({
        mutationFn: deleteItemFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast("Item removed", {
                description: "Product has been removed from your cart.",
            });
        },
        onError: () => {
            toast.error("Item can't removed", {
                description: "Failed to remove item. Please try again.",
            });
        },
    });

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-center text-destructive">
                <p>Failed to load cart. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {!hasItems ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
                    <ShoppingCartIcon className="w-16 h-16 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                    <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                    <Button asChild>
                        <Link to="/">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <Card key={item.product._id}>
                                <CardContent className="p-4 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                                        <img
                                            src={item.product.images[0]?.url || 'https://via.placeholder.com/100x100.png?text=No+Image'}
                                            alt={item.product.name}
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                    </Link>
                                    <div className="flex-grow flex flex-col text-center sm:text-left">
                                        <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                        <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                        <span className="text-lg font-bold">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteMutation.mutate(item.product._id)}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="h-5 w-5 text-destructive" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h2 className="text-2xl font-bold">Order Summary</h2>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                                    <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-semibold text-primary">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total</span>
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <Button className="w-full mt-4" size="lg" onClick={() => navigate('/checkout')}>
                                    Proceed to Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;