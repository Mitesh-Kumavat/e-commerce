import { API_ROUTES } from '@/utils/api-routes'
import axios from 'axios'

export const checkoutOrder = async (address: string) => {
    const respone = await axios.post(API_ROUTES.order.checkout, { address }, {
        withCredentials: true
    })

    return respone.data;
}

export const getAllOrdersOfUser = async () => {
    const respone = await axios.get(API_ROUTES.order.getAllOrderOfUser, {
        withCredentials: true
    })

    return respone.data;
}

export const cancelOrder = async (orderId: string) => {
    const respone = await axios.put(API_ROUTES.order.cancelOrder(orderId), {}, {
        withCredentials: true
    })

    return respone.data;
}
