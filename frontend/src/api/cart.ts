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