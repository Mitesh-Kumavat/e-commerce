import { API_ROUTES } from "@/utils/api-routes";
import axios from "axios";

export const getDashboardStats = async () => {
    const response = await axios.get(API_ROUTES.dashboard.getStats, {
        withCredentials: true,
    });

    return response.data;
};