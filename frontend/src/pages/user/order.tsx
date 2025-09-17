// src/pages/OrdersPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrdersOfUser, cancelOrder } from "@/api/order";
import { Loader2, Package, XCircle, Calendar, MapPin, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderProduct {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
}

interface OrderItem {
    product: OrderProduct;
    quantity: number;
    _id: string;
}

interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    totalAmount: number;
    address: string;
    status: "pending" | "delivered" | "cancelled" | "shipped";
    deliveryDate?: string;
    createdAt: string;
}

const OrdersPage = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrdersOfUser,
    });

    const orders: Order[] = data?.data || [];
    const hasOrders = orders.length > 0;

    const cancelMutation = useMutation({
        mutationFn: cancelOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Order Cancelled", {
                description: "Your order has been successfully cancelled.",
            });
        },
        onError: () => {
            toast.error("Cancellation Failed", {
                description: "There was an error cancelling your order. Please try again.",
            });
        },
    });

    const getBadgeClass = (status: Order['status']) => {
        switch (status) {
            case "pending":
                return "bg-yellow-300 text-black";
            case "delivered":
                return "bg-green-500 text-white";
            case "cancelled":
                return "bg-red-600 text-white";
            default:
                return "bg-gray-500 text-white";
        }
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
                <p>Failed to load orders. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
            {!hasOrders ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
                    <Package className="w-16 h-16 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold">No orders found</h2>
                    <p className="text-muted-foreground">It seems you haven't placed any orders yet.</p>
                    <Button asChild>
                        <Link to="/explore">Explore Products</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="bg-muted/30 p-4 flex flex-col md:flex-row justify-between md:items-center">
                                <div className="flex items-center gap-2">
                                    <Landmark className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg font-bold">
                                        Order #{order._id.slice(-6).toUpperCase()}
                                    </CardTitle>
                                </div>
                                <div className="flex items-center gap-2 mt-2 md:mt-0">
                                    <p className="text-sm text-muted-foreground hidden md:block">
                                        Placed on: {format(new Date(order.createdAt), "PPP")}
                                    </p>
                                    <Badge className={cn("font-semibold px-3 py-1.5", getBadgeClass(order.status))}>
                                        {order.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Product List */}
                                <div className="lg:col-span-2 space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item._id} className="flex items-center space-x-4">
                                            <img
                                                src={item.product.images[0]?.url || 'https://via.placeholder.com/60'}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                            />
                                            <div className="flex-grow">
                                                <h4 className="font-semibold text-base">{item.product.name}</h4>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-primary flex-shrink-0">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {/* Order Summary & Actions */}
                                <div className="lg:col-span-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 space-y-4">
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center justify-between text-lg font-bold">
                                            <span>Total Amount:</span>
                                            <span>${order.totalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="font-bold text-foreground">Shipping Address:</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm pl-6">{order.address}</p>
                                        {order.deliveryDate && (
                                            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                <span className="font-bold text-foreground"> Delivery Date:</span>
                                                <span className="text-muted-foreground">
                                                    {format(new Date(order.deliveryDate), "PPP")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {order.status === "pending" && (
                                        <Button
                                            variant="destructive"
                                            className="w-full mt-4"
                                            onClick={() => cancelMutation.mutate(order._id)}
                                            disabled={cancelMutation.isPending}
                                        >
                                            {cancelMutation.isPending ? (
                                                <Loader2 className="animate-spin mr-2" />
                                            ) : (
                                                <XCircle className="mr-2 h-4 w-4" />
                                            )}
                                            Cancel Order
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;