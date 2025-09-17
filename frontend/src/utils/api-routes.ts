import { BACKEND_URL } from "@/constants";

export const API_ROUTES = {
    auth: {
        login: `${BACKEND_URL}/auth/login`,
        signup: `${BACKEND_URL}/auth/signup`,
        logout: `${BACKEND_URL}/auth/logout`
    },
    dashboard: {
        getStats: `${BACKEND_URL}/dashboard`,
    },
    user: {
        getAllUsers: `${BACKEND_URL}/users`,
        getCurrentUser: `${BACKEND_URL}/users/me`,
        deleteUserById: (id: string) => `${BACKEND_URL}/users/${id}`,
        updateCurrentUser: `${BACKEND_URL}/users/me`,
    },
    product: {
        getProduct: `${BACKEND_URL}/products`,
        getProductById: (id: string) => `${BACKEND_URL}/products/${id}`,
        deleteProductById: (id: string) => `${BACKEND_URL}/products/${id}`,
        updateProductById: (id: string) => `${BACKEND_URL}/products/${id}`,
        addProduct: `${BACKEND_URL}/products`,
    },
    cart: {
        addCart: `${BACKEND_URL}/cart/add`,
        getCart: `${BACKEND_URL}/cart`,
        deleteProductFromCart: (productId: string) => `${BACKEND_URL}/cart/remove/${productId}`,
    },
    order: {
        checkout: `${BACKEND_URL}/orders/checkout`,
        getAllOrderOfUser: `${BACKEND_URL}/orders`,
        cancelOrder: (orderId: string) => `${BACKEND_URL}/orders/cancel/${orderId}`,
        updateOrderStatus: (orderId: string) => `${BACKEND_URL}/orders/status/${orderId}`,
        getAllOrders: `${BACKEND_URL}/orders/admin/all`,
    }

}