import { useParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProductById } from "@/api/product"
import { addToCart } from "@/api/cart"
import { Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id!),
    })

    const addToCartMutation = useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            toast.success(`${product.name} Added to Cart!`)
        },
        onError: (err) => {
            toast.error("Failed to add to cart", {
                description: err.message || "There was an error occured",
                cancel: true,
            })
        },
    })

    const handleAddToCart = () => {
        if (!id) return;
        addToCartMutation.mutate({ productId: id, quantity: 1 })
    }

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-center text-destructive">
                <p>Failed to load product details: {(error as any).message}</p>
            </div>
        )
    }

    const product = data?.data || null;

    if (!product) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-center text-muted-foreground">
                <p>Product not found.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <div>
                    <Carousel className="w-full">
                        <CarouselContent>
                            {product.images.map((image: any, index: number) => (
                                <CarouselItem key={index}>
                                    <img
                                        src={image.url}
                                        alt={`${product.name} image ${index + 1}`}
                                        className="w-full h-auto object-contain rounded-lg shadow-md max-h-[500px]"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </Carousel>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl font-extrabold text-foreground">{product.name}</h1>
                    <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    <Separator />
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Description</h2>
                        <p className="text-muted-foreground">{product.description}</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Details</h2>
                        <ul className="text-muted-foreground list-disc list-inside space-y-1">
                            <li><span className="font-medium text-foreground">Category:</span> {product.category}</li>
                            <li><span className="font-medium text-foreground">In Stock:</span> {product.stock}</li>
                        </ul>
                    </div>
                    <Button
                        size="lg"
                        className="w-full mt-4 flex items-center gap-2"
                        onClick={handleAddToCart}
                        disabled={addToCartMutation.isPending || product.stock === 0}
                    >
                        {addToCartMutation.isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <ShoppingCart />
                        )}
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                </div>
            </div>
        </div>
    )
}