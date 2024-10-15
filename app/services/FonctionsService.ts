import { getBaseUrl } from "./baseUrl";
const BASE_URL = 'http://localhost:8090/api/v1';


export const getAllFonctionsService = async () => {
    try {
        const response = await fetch(`${getBaseUrl()}/fonctions/getAllFonctions`);
        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

