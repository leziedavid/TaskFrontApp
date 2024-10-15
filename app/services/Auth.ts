
import { BaseResponse } from "../interfaces/ApiResponse";
import jwt from 'jsonwebtoken';
import { getBaseUrl } from "./baseUrl";
interface DecodedToken {
    id: string;
    exp: number;
}

export const signIn = async (email: string, password: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getUserInfo = async (): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token manquant');
    }

    try {
        // Décoder le token
        const decodedToken = jwt.decode(token) as DecodedToken | null;
        if (!decodedToken) {
            throw new Error('Votre session a expiré, merci de vous reconnecter.');
        }

        const id = decodedToken.id;
        const response = await fetch(`${getBaseUrl()}/users/${id}/root/detail`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json',},
        });

        return await response.json();
    } catch (error) {

        console.error('Error getting user info:', error);
        throw error;
    }
};


export const getSettings = async (): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token manquant');
    }

    try {
        // Décoder le token
        const decodedToken = jwt.decode(token) as DecodedToken | null;
        if (!decodedToken) {
            throw new Error('Votre session a expiré, merci de vous reconnecter.');
        }

        const id = decodedToken.id;
        const response = await fetch(`${getBaseUrl()}/settings/${id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json',},
        });

        return await response.json();
    } catch (error) {

        console.error('Error getting user info:', error);
        throw error;
    }
};


export const sendOtp = async (email: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (newPassword: string): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token manquant');
    }

    try {
        const response = await fetch(`${getBaseUrl()}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
};
