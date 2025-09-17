import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "@/api/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, ShoppingCart, DollarSign, Clock, MapPin } from "lucide-react"

export default function AdminDashboardPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
    })

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="animate-pulse space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-muted rounded-lg"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-96 bg-muted rounded-lg"></div>
                        <div className="h-96 bg-muted rounded-lg"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="text-center text-destructive">Error loading dashboard data</div>
            </div>
        )
    }

    const { summary, recentOrders, topProducts } = data?.data || {}

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-3xl font-bold text-balance"> Dashboard</h1>
                <p className="text-muted-foreground mt-1">Analyze and view statics data of shop </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.totalUsers || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.totalProducts || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary?.totalOrders || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary?.totalRevenue?.toLocaleString() || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders?.map((order: any) => (
                                <div key={order._id} className="flex items-start space-x-4 p-4 border rounded-lg">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium">{order.user.name}</div>
                                            <Badge
                                                variant={
                                                    order.status.toLowerCase() === "delivered"
                                                        ? "default"
                                                        : order.status.toLowerCase() === "cancelled"
                                                            ? "destructive"
                                                            : order.status.toLowerCase() === "shipped"
                                                                ? "default"
                                                                : "secondary"
                                                }
                                                className={
                                                    order.status.toLowerCase() === "delivered"
                                                        ? "bg-green-500 hover:bg-green-600"
                                                        : order.status.toLowerCase() === "cancelled"
                                                            ? "bg-red-500 hover:bg-red-600"
                                                            : order.status.toLowerCase() === "shipped"
                                                                ? "" // Use default theme accent color for shipped status
                                                                : "bg-yellow-500 hover:bg-yellow-600 text-black"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">{order.user.email}</div>
                                        <div className="space-y-1">
                                            {order.items.map((item: any) => (
                                                <div key={item._id} className="text-sm">
                                                    {item.product.name} × {item.quantity}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{order.address}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="font-semibold">₹{order.totalAmount.toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts?.map((product: any) => (
                                <div key={product._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                        {product.images?.[0]?.url && (
                                            <img
                                                src={product.images[0].url || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-lg font-semibold text-primary">₹{product.price.toLocaleString()}</div>
                                        <div className="mt-1">
                                            <Badge
                                                variant={product.stock === 0 ? "destructive" : product.stock < 10 ? "secondary" : "default"}
                                                className={
                                                    product.stock === 0
                                                        ? "bg-red-500 hover:bg-red-600"
                                                        : product.stock < 10
                                                            ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                                            : "bg-green-500 hover:bg-green-600"
                                                }
                                            >
                                                {product.stock === 0 ? "Out of Stock" : product.stock < 10 ? "Low Stock" : "In Stock"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
