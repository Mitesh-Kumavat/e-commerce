import { API_ROUTES } from '@/utils/api-routes'
import axios from 'axios'

interface CartData {
    productId: string,
    quantity: number
}

export const addToCart = async (data: CartData) => {
    const respone = await axios.post(API_ROUTES.cart.addCart, data, {
        withCredentials: true
    })

    return respone.data;
}

export const getCartOfUser = async () => {
    const response = await axios.get(API_ROUTES.cart.getCart, {
        withCredentials: true
    })

    return response.data;
}

export const deleteItemFromCart = async (productId: string) => {
    const respone = await axios.delete(API_ROUTES.cart.deleteProductFromCart(productId), {
        withCredentials: true
    })

    return respone.data;
}