
import { BaseResponse } from '../interfaces/ApiResponse';
import { TaskDataCalendar } from '../interfaces/CalendarsData';
const BASE_URL = 'http://localhost:8090/api/v1';
import { getBaseUrl } from "./baseUrl";


export const getCalendarsData = async (startDate?: Date,endDate?: Date)=> {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;
    
    try {
        // Vérifie si startDate et endDate sont définis avant d'appeler toISOString
        const startDateStr = startDate ? startDate.toISOString() : '';
        const endDateStr = endDate ? endDate.toISOString() : '';

        const response = await fetch(`${getBaseUrl()}/tasks/calendars?startDate=${startDateStr}&endDate=${endDateStr}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoute le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
                ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini

            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch filtered tasks');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching filtered tasks:', error);
        throw error;
    }
};
