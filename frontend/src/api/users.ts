import { API_ROUTES } from "@/utils/api-routes";
import axios from "axios";

export const getAllUsers = async () => {
    const response = await axios.get(API_ROUTES.user.getAllUsers, {
        withCredentials: true,
    });

    return response.data;
};

export const getUserById = async (id: string) => {
    const response = await axios.get(API_ROUTES.user.getUserById(id), {
        withCredentials: true,
    });
    return response.data;
};

export const updateUserById = async (id: string, data: any) => {
    const response = await axios.put(API_ROUTES.user.updateUserById(id), data, {
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
