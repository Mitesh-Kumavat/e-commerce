import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductById } from "@/api/product";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: { url: string }[];
}

interface EditProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: id === "price" || id === "stock" ? Number(value) : value,
        }));
    };

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProductById(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product updated successfully", {
                description: `Product "${product?.name}" has been updated.`,
            });
            onOpenChange(false);
        },
        onError: (error: any) => {
            toast.error("Failed to update product", {
                description: error.response?.data?.message || "An unexpected error occurred.",
            });
        },
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0 || formData.stock < 0) {
            toast.error("Validation failed", {
                description: "Please ensure all fields are correctly filled out.",
            });
            return;
        }

        const productData = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
        };

        updateProductMutation.mutate({ id: product._id, data: productData });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Update the product information. Changes will be saved immediately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter product description"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock Quantity</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateProductMutation.isPending}>
                            {updateProductMutation.isPending ? "Updating..." : "Update Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}