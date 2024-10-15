import toast, { Toaster } from 'react-hot-toast';

import { BaseResponse } from '../interfaces/ApiResponse';
import { User } from '../interfaces/Global';
import { getBaseUrl } from "./baseUrl";

const BASE_URL = 'http://localhost:8090/api/v1';

export const signIn = async (email: string, password: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({ email, password }),
        });
        // if (!response.ok) {}
        return await response.json();

    } catch (error) {
        toast.error("Erreur lors de la connexion :");
        throw error;
    }
};
// Fonction pour s'inscrire
export const signUp = async (username: string, email: string, password: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to sign up');
        }

        return await response.json();

    } catch (error) {

        console.error('Error during sign up:', error);
        throw error;
    }
};


export const sendOTP = async (email: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email}),
        });

        if (!response.ok) {
            throw new Error('Failed to verify OTP');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during OTP verification:', error);
        throw error;
    }
};
// Fonction pour vérifier le code OTP
export const verifyOTP = async (email: string, otp: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            throw new Error('Failed to verify OTP');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during OTP verification:', error);
        throw error;
    }
};

// Fonction pour réinitialiser le mot de passe
export const resetPassword = async (email: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to reset password');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during password reset:', error);
        throw error;
    }
};

export const changePassword = async (email: string, password: string,otp: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/ResetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, otp }),
        });

        if (!response.ok) {
            throw new Error('Failed to change password');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during password change:', error);
        throw error;
    }
};
export const logout = async (token: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/logout`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            throw new Error('Failed to logout');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

// Service pour récupérer l'ID de l'utilisateur à partir du token JWT
export const getUserIdFromToken = async (token: string): Promise<BaseResponse<number>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/userid`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get user ID');
        }

        return await response.json(); // Renvoie la réponse JSON parsée
    } catch (error) {
        console.error('Error getting user ID:', error);
        throw error;
    }
};

export const getUserInfoFromToken = async (token: string): Promise<BaseResponse<User>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/auth/userinfo`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get user info');
        }

        return await response.json(); // Renvoie la réponse JSON parsée
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
};

