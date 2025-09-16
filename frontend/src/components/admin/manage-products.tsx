// src/components/admin/ManageProductsPage.tsx

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts, deleteProductById } from "@/api/product"
import { Search, Edit, Trash2, MoreHorizontal, AlertTriangle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { EditProductDialog } from "./edit-product-dialog"
import { toast } from "sonner"

interface Product {
    _id: string
    name: string
    description: string
    price: number
    stock: number
    category: string
    images: { url: string }[]
}

interface GetProductsParams {
    keyword?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    sort?: "price_low" | "price_high" | "latest"
}

function ManageProductsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [sortOption, setSortOption] = useState<"latest" | "price_high" | "price_low">("latest")
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

    const queryClient = useQueryClient()

    // Debounce the search query
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery.trim())
        }, 500) // 500ms delay

        // Cleanup function to clear the timer
        return () => clearTimeout(timerId)
    }, [searchQuery])

    // Conditionally build the query parameters
    const queryParams: GetProductsParams = {}
    if (debouncedSearchQuery) {
        queryParams.keyword = debouncedSearchQuery
    }
    if (sortOption) {
        queryParams.sort = sortOption
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", queryParams], // React Query will re-fetch when queryParams changes
        queryFn: () => getProducts(queryParams),
    })

    const deleteProductMutation = useMutation({
        mutationFn: deleteProductById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            toast.success("success", {
                description: "Product deleted successfully",
            })
            setDeletingProductId(null)
        },
        onError: (error: any) => {
            toast.error("Error", {
                description: error.response?.data?.message || "Failed to delete product",
            })
            setDeletingProductId(null)
        },
    })

    const handleDeleteProduct = (productId: string) => {
        deleteProductMutation.mutate(productId)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price)
    }

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>
        } else if (stock < 10) {
            return (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    Low Stock
                </Badge>
            )
        } else {
            return (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    In Stock
                </Badge>
            )
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Package className="h-6 w-6 animate-spin text-primary" />
                    <span>Loading products...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-center text-destructive">
                <p>Failed to load products: {(error as any).message}</p>
            </div>
        )
    }

    const products: Product[] = data?.data || []

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-balance">Manage Products</h1>
                    <p className="text-muted-foreground mt-1">View, edit, and manage your product catalog</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Catalog</CardTitle>
                        <CardDescription>Manage your product inventory, pricing, and availability</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Select onValueChange={(value) => setSortOption(value as any)} value={sortOption}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest</SelectItem>
                                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[70px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">No products found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map((product: Product) => (
                                            <TableRow key={product._id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={
                                                                product.images?.[0]?.url ||
                                                                `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                                                            }
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded border"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-medium truncate">{product.name}</div>
                                                            <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <span>{product.stock}</span>
                                                        {product.stock < 10 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{product.category}</Badge>
                                                </TableCell>
                                                <TableCell>{getStockStatus(product.stock)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Update
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => setDeletingProductId(product._id)}
                                                                className="text-destructive focus:text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {products.length > 0 && (
                            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                <p>Showing {products.length} products</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <EditProductDialog
                product={editingProduct}
                open={!!editingProduct}
                onOpenChange={(open: any) => !open && setEditingProduct(null)}
            />

            <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingProductId && handleDeleteProduct(deletingProductId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteProductMutation.isPending}
                        >
                            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ManageProductsPage