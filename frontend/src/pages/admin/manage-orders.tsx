import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllOrders, updateOrderStatus } from "@/api/order"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock, MapPin, User, Mail, Calendar } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface OrderItem {
    _id: string
    product: {
        _id: string
        name: string
        price: number
        images?: { url: string }[]
    }
    quantity: number
}

interface Order {
    _id: string
    user: {
        _id: string
        name: string
        email: string
    }
    items: OrderItem[]
    totalAmount: number
    address: string
    status: string
    createdAt: string
    updatedAt: string
}

export default function ManageOrdersPage() {
    const [updateOrderId, setUpdateOrderId] = useState<string | null>(null)
    const [newStatus, setNewStatus] = useState<string>("")
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ["all-orders"],
        queryFn: getAllOrders,
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-orders"] })
            toast.success("Order status updated successfully")
            setUpdateOrderId(null)
            setNewStatus("")
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update order status")
        },
    })

    const handleStatusUpdate = (orderId: string, status: string) => {
        setUpdateOrderId(orderId)
        setNewStatus(status)
    }

    const confirmStatusUpdate = () => {
        if (updateOrderId && newStatus) {
            updateStatusMutation.mutate({ orderId: updateOrderId, status: newStatus })
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <Clock className="h-4 w-4" />
            case "shipped":
                return <Truck className="h-4 w-4" />
            case "delivered":
                return <CheckCircle className="h-4 w-4" />
            case "cancelled":
                return <XCircle className="h-4 w-4" />
            default:
                return <Package className="h-4 w-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        const statusLower = status.toLowerCase()
        switch (statusLower) {
            case "delivered":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {getStatusIcon(status)}
                        <span className="ml-1">{status}</span>
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge variant="destructive">
                        {getStatusIcon(status)}
                        <span className="ml-1">{status}</span>
                    </Badge>
                )
            case "shipped":
                return (
                    <Badge>
                        {getStatusIcon(status)}
                        <span className="ml-1">{status}</span>
                    </Badge>
                )
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        {getStatusIcon(status)}
                        <span className="ml-1">{status}</span>
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary">
                        {getStatusIcon(status)}
                        <span className="ml-1">{status}</span>
                    </Badge>
                )
        }
    }

    const canUpdateStatus = (status: string) => {
        const statusLower = status.toLowerCase()
        return statusLower === "pending" || statusLower === "shipped"
    }

    const getNextStatus = (currentStatus: string) => {
        const statusLower = currentStatus.toLowerCase()
        if (statusLower === "pending") return "shipped"
        if (statusLower === "shipped") return "delivered"
        return null
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
                    <p className="text-muted-foreground">Failed to load orders data. Please try again.</p>
                </div>
            </div>
        )
    }

    const orders: Order[] = data?.data || []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-balance">Manage Orders</h1>
                <p className="text-muted-foreground mt-1">Manage order status of user's orders.</p>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="border-b bg-muted/30">
                    <CardTitle className="flex items-center justify-between text-lg">
                        <span className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            All Orders
                        </span>
                        <Badge variant="secondary" className="font-medium">
                            {orders.length} Total
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/20">
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Customer
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Items
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Address
                                        </div>
                                    </th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Amount</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Date
                                        </div>
                                    </th>
                                    <th className="text-center py-4 px-6 font-semibold text-sm uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-muted/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <span className="text-primary font-semibold text-sm">
                                                        {order.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{order.user.name}</div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {order.user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden lg:table-cell">
                                            <div className="space-y-1">
                                                {order.items.slice(0, 2).map((item) => (
                                                    <div key={item._id} className="text-sm">
                                                        <span className="font-medium">{item.product.name}</span>
                                                        <span className="text-muted-foreground"> × {item.quantity}</span>
                                                    </div>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <div className="text-xs text-muted-foreground">+{order.items.length - 2} more items</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm max-w-[200px] truncate" title={order.address}>
                                                {order.address}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-lg">₹{order.totalAmount.toLocaleString()}</div>
                                        </td>
                                        <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {canUpdateStatus(order.status) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const nextStatus = getNextStatus(order.status)
                                                        if (nextStatus) {
                                                            handleStatusUpdate(order._id, nextStatus)
                                                        }
                                                    }}
                                                    disabled={updateStatusMutation.isPending}
                                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                                >
                                                    {order.status.toLowerCase() === "pending" ? (
                                                        <>
                                                            <Truck className="h-4 w-4 mr-1" />
                                                            Ship
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Deliver
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                            <p className="text-muted-foreground text-sm">No orders have been placed yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!updateOrderId} onOpenChange={() => setUpdateOrderId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Order Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to update this order status to "{newStatus}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmStatusUpdate} disabled={updateStatusMutation.isPending}>
                            {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
