// src/services/ApiService.ts

import { BaseResponse } from '../interfaces/ApiResponse';
const BASE_URL = 'http://localhost:8090/api/v1';
import { getBaseUrl } from "./baseUrl";

// Fonction pour obtenir les notifications par ID de projet
export const getStatistique = async (): Promise<BaseResponse<any>> => {
    
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;
    // tdl
    console.log(userId);

    try {
        const response = await fetch(`${getBaseUrl()}/statistique/global`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                    'Content-Type': 'application/json',
                    ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini

                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const getProjectState = async (): Promise<BaseResponse<any>> => {
    
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;

    try {
        const response = await fetch(`${getBaseUrl()}/statistique/projetStats`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                    'Content-Type': 'application/json',
                    ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini

                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
        
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

