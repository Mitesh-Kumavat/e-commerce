import { API_ROUTES } from '@/utils/api-routes';
import axios from 'axios';

interface GetProductsParams {
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'price_low' | 'price_high' | 'latest';
}

export const getProducts = async (params: GetProductsParams = {}) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const url = `${API_ROUTES.product.getProduct}?${queryString}`;

    const response = await axios.get(url, {
        withCredentials: true,
    });

    return response.data;
}

export const getProductById = async (id: string) => {
    const response = await axios.get(API_ROUTES.product.getProductById(id), {
        withCredentials: true
    });

    return response.data;
}

// Admin only requests.
export const deleteProductById = async (id: string) => {
    const response = await axios.delete(API_ROUTES.product.deleteProductById(id), {
        withCredentials: true
    });

    return response.data;
}

export const updateProductById = async (id: string, data: any) => {
    const response = await axios.put(API_ROUTES.product.updateProductById(id), data, {
        withCredentials: true
    });

    return response.data;
}

export const addProduct = async (data: any) => {
    const response = await axios.post(API_ROUTES.product.addProduct, data, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}

