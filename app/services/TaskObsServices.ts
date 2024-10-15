// src/services/ApiService.ts
import { BaseResponse } from '../interfaces/ApiResponse';
import { getBaseUrl } from "./baseUrl";
const BASE_URL = 'http://localhost:8090/api/v1';

export const SaveTaskObs  = async (data: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/obs/AddObservation`, {
            method: 'POST',
            body: data,
            // headers: {'Content-Type': 'application/json',},
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde du projet');
        }
        return await response.json();
    } catch (error: any) {
        throw error;
    }
};

export const removeObs = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/obs/delete/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete observation');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting observation:', error);
        throw error;
    }
};

export const getObsById  = async (actionId: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/obs/getObservationEndFilesById/${actionId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch observation details');
        }

        return await response.json();
    } catch (error) {
        
        console.error('Error fetching observation details:', error);
        throw error;
        
    }
};

export const updateObs = async (id: number, data: FormData): Promise<BaseResponse<any>> => {

    try {
        const response = await fetch(`${getBaseUrl()}/obs/updateObservation/${id}`, {
            method: 'PUT',
            // headers: {'Content-Type': 'application/json', },
            body: data, // Convertir l'objet JavaScript en chaîne JSON
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du projet');
        }

        return await response.json();

    } catch (error: any) {
        console.error(`Erreur lors de la mise à jour du projet : ${error.message}`);
        throw error;
    }
};

