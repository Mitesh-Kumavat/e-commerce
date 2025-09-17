import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/api/product'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: { url: string }[];
}

export const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const [sortOption, setSortOption] = useState<'latest' | 'price_high' | 'price_low'>(
        searchParams.get('sort') as any || 'latest'
    );
    const keyword = searchParams.get('keyword') || '';
    const user = useSelector((state: RootState) => state.auth.user);

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', { keyword, sort: sortOption }],
        queryFn: () => getProducts({ keyword, sort: sortOption }),
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, []);

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
                <p>Failed to load products: {(error as any).message}</p>
            </div>
        );
    }

    const products: Product[] = data?.data || [];

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Explore Products</h1>

            <div className="flex flex-col md:flex-row items-center justify-end gap-4 mb-8">
                <Select onValueChange={(value: any) => setSortOption(value)} value={sortOption}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.length > 0 ? (
                    products.map(product => (
                        <Link to={`/product/${product._id}`} key={product._id}>
                            <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                                <img
                                    src={product.images[0]?.url || 'https://via.placeholder.com/400x300.png?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                                    <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold text-primary">${product.price.toFixed(2)}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <p className="col-span-full text-center text-muted-foreground">No products found.</p>
                )}
            </div>
        </div>
    );
};