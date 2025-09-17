import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addProduct } from "@/api/product"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductFormData {
    name: string
    description: string
    price: number
    stock: number
    category: string
    images: FileList | null
}

const CATEGORIES = [
    { label: "Smartphone", value: "smartphone" },
    { label: "Footwear", value: "footwear" },
    { label: "Electronics", value: "electronics" },
    { label: "Beauty", value: "beauty" },
    { label: "Sports", value: "sports" },
    { label: "Clothing", value: "clothing" },
    { label: "Home & Garden", value: "home-garden" },
    { label: "Books", value: "books" },
    { label: "Toys", value: "toys" },
    { label: "Health", value: "health" },
    { label: "Grocery", value: "grocery" },
]

const AddProductPage = () => {
    const queryClient = useQueryClient()
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm<ProductFormData>({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            category: "",
            images: null,
        },
    })

    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [dragActive, setDragActive] = useState(false)
    const [imageValidationError, setImageValidationError] = useState<string>("")
    const imagesWatch = watch("images")

    const validateImages = (files: FileList | null) => {
        if (!files || files.length === 0) {
            setImageValidationError("At least 1 image is required")
            return false
        }

        if (files.length > 5) {
            setImageValidationError("Maximum 5 images allowed")
            return false
        }

        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        const maxSize = 5 * 1024 * 1024 // 5MB

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if (!validTypes.includes(file.type)) {
                setImageValidationError("Only JPEG, PNG, and WebP images are allowed")
                return false
            }
            if (file.size > maxSize) {
                setImageValidationError("Each image must be less than 5MB")
                return false
            }
        }

        setImageValidationError("")
        return true
    }

    React.useEffect(() => {
        if (imagesWatch && imagesWatch.length > 0) {
            if (validateImages(imagesWatch)) {
                const newPreviews = Array.from(imagesWatch).map((file) => URL.createObjectURL(file))
                setImagePreviews(newPreviews)
                clearErrors("images")
            } else {
                setImagePreviews([])
            }
        } else {
            setImagePreviews([])
            setImageValidationError("At least 1 image is required")
        }
    }, [imagesWatch, clearErrors])

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = e.dataTransfer.files
            setValue("images", files)
        }
    }

    const removeImage = (indexToRemove: number) => {
        if (imagesWatch) {
            const dt = new DataTransfer()
            const files = Array.from(imagesWatch)

            files.forEach((file, index) => {
                if (index !== indexToRemove) {
                    dt.items.add(file)
                }
            })

            setValue("images", dt.files)
        }
    }

    const mutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            toast.success("Product added successfully!")
            reset()
            setImagePreviews([])
            setImageValidationError("")
        },
        onError: (error) => {
            console.error(error)
            toast.error("Failed to add product. Please try again.")
        },
    })

    const onSubmit: SubmitHandler<ProductFormData> = (data) => {
        if (!validateImages(data.images)) {
            toast.error(imageValidationError)
            return
        }

        // Create a new FormData object
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", data.price.toString())
        formData.append("stock", data.stock.toString())
        formData.append("category", data.category)

        // Append each image file individually
        if (data.images) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append("images", data.images[i])
            }
        }

        // Mutate with the FormData object
        mutation.mutate(formData)
    }

    return (
        <div className="container mx-auto p-2 md:p-2 max-w-6xl">

            <div>
                <h1 className="text-3xl font-bold text-balance">Add new Product</h1>
            </div>

            <Card className="shadow-lg border-0 bg-card">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg">
                    <CardTitle className="text-xl text-card-foreground">Product Information</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Fill out the form below to add a new product to your store. All fields are required.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                        Product Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter product name"
                                        className="h-11 bg-input border-border focus:ring-2 focus:ring-ring"
                                        {...register("name", { required: "Product name is required" })}
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-sm flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-sm font-medium text-foreground">
                                        Category *
                                    </Label>
                                    <Select onValueChange={(value) => setValue("category", value)}>
                                        <SelectTrigger className="h-11 bg-input border-border focus:ring-2 focus:ring-ring">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-destructive text-sm flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.category.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                                    Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Write a detailed description of the product..."
                                    className="min-h-[120px] bg-input border-border focus:ring-2 focus:ring-ring resize-none"
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && (
                                    <p className="text-destructive text-sm flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-sm font-medium text-foreground">
                                        Price ($) *
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="1"
                                        placeholder="0"
                                        className="h-11 bg-input border-border focus:ring-2 focus:ring-ring"
                                        {...register("price", {
                                            required: "Price is required",
                                            min: { value: 1, message: "Price must be at least $1" },
                                        })}
                                    />
                                    {errors.price && (
                                        <p className="text-destructive text-sm flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.price.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock" className="text-sm font-medium text-foreground">
                                        Stock Quantity *
                                    </Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        placeholder="0"
                                        className="h-11 bg-input border-border focus:ring-2 focus:ring-ring"
                                        {...register("stock", {
                                            required: "Stock is required",
                                            min: { value: 0, message: "Stock must be non-negative" },
                                        })}
                                    />
                                    {errors.stock && (
                                        <p className="text-destructive text-sm flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.stock.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-medium text-foreground">Product Images * (1-5 images)</Label>

                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                        ? "border-primary bg-primary/5"
                                        : imageValidationError
                                            ? "border-destructive bg-destructive/5"
                                            : imagePreviews.length > 0
                                                ? "border-accent bg-accent/5"
                                                : "border-border bg-muted/20"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        {...register("images", { required: "At least one image is required" })}
                                    />

                                    <div className="space-y-4">
                                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-foreground">Drop images here or click to browse</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Upload 1-5 images (JPEG, PNG, WebP • Max 5MB each)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {imageValidationError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{imageValidationError}</AlertDescription>
                                    </Alert>
                                )}

                                {imagePreviews.length > 0 && !imageValidationError && (
                                    <Alert className="border-accent bg-accent/5">
                                        <CheckCircle2 className="h-4 w-4 text-accent" />
                                        <AlertDescription className="text-accent-foreground">
                                            {imagePreviews.length} image{imagePreviews.length > 1 ? "s" : ""} uploaded successfully
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                                            >
                                                <img
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`Product preview ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                    {index + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <CardFooter className="flex justify-end gap-4 p-0 pt-6 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset()
                                    setImagePreviews([])
                                    setImageValidationError("")
                                }}
                                disabled={mutation.isPending}
                                className="px-6"
                            >
                                Reset Form
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isPending || !!imageValidationError}
                                className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mutation.isPending ? "Adding Product..." : "Add Product"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddProductPage
