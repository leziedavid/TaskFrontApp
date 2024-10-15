// src/services/ApiService.ts

import { BaseResponse } from '../interfaces/ApiResponse';
import { NotificationDTO } from '../interfaces/Notification'; // Assurez-vous que le chemin est correct
import { getBaseUrl } from "./baseUrl";
const BASE_URL = 'http://localhost:8090/api/v1';

// Définir le type pour la réponse de l'API
interface NotificationResponse extends BaseResponse<NotificationDTO[]> {}

// Fonction pour obtenir les notifications par ID de projet
export const getNotificationsByProjectId = async (projectCode: string): Promise<NotificationDTO[]> => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${getBaseUrl()}/notifications/getByProjectId/${projectCode}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Typage de la réponse JSON
        const data: NotificationResponse = await response.json();

        // Assurez-vous que data.data est défini et est un tableau
        if (data.data) {
            return data.data;
        } else {
            // Si data.data est undefined, retourner un tableau vide ou gérer autrement
            return [];
        }
        
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const getNotificationsById = async (projectCode: string):  Promise<BaseResponse<any>>  => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${getBaseUrl()}/notifications/getNotificationById/${projectCode}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                    'Content-Type': 'application/json',
                },
            }
        );

        const data: BaseResponse<NotificationDTO> = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

export const getUnreadNotifications = async (): Promise<BaseResponse<any>>  => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${getBaseUrl()}/notifications/getUnreadNotifications`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                    'Content-Type': 'application/json',
                },
            }
        );
        const data: BaseResponse<NotificationDTO> = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

