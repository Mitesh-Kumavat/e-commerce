import { API_ROUTES } from '@/utils/api-routes';
import axios from 'axios';

interface loginData {
    email: string,
    password: string
}

interface signupData {
    email: string,
    password: string,
    name: string
}

export const login = async (data: loginData) => {
    const response = await axios.post(API_ROUTES.auth.login, data, {
        withCredentials: true
    });

    return response.data;
}

export const signup = async (data: signupData) => {
    const response = await axios.post(API_ROUTES.auth.signup, data, {
        withCredentials: true
    });

    return response.data;
}

export const logOutUser = async () => {
    const response = await axios.post(API_ROUTES.auth.logout, {}, {
        withCredentials: true
    });

    localStorage.removeItem("user");

    return response.data;
}