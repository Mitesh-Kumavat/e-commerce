import { API_ROUTES } from "@/utils/api-routes";
import axios from "axios";

export const getAllUsers = async () => {
    const response = await axios.get(API_ROUTES.user.getAllUsers, {
        withCredentials: true,
    });

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await axios.get(API_ROUTES.user.getCurrentUser, {
        withCredentials: true,
    });

    return response.data;
};

export const updateCurrentUser = async (data: any) => {
    const response = await axios.put(API_ROUTES.user.updateCurrentUser, data, {
        withCredentials: true,
    });

    return response.data;
};

export const deleteUserById = async (id: string) => {
    const response = await axios.delete(API_ROUTES.user.deleteUserById(id), {
        withCredentials: true,
    });
    return response.data;
};
