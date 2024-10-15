// src/services/ApiService.ts
import { BaseResponse } from '../interfaces/ApiResponse';
const BASE_URL = 'http://localhost:8090/api/v1';
import { getBaseUrl } from "./baseUrl";

export const SaveTaskAction = async (data: any): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/actions/addTaskActions`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde du projet');
        }
        return await response.json();
    } catch (error: any) {
        throw error;
    }
};

export const updateActionStatus = async (actionId: number, isValides: number | null, TaskId: string | null): Promise<BaseResponse<any>> => {
    try {
        // Construire l'URL avec les paramètres d'URL
        const pourcentage=100;
        const url = `${getBaseUrl()}/actions/update-action-status?actionId=${actionId}&isValides=${isValides}&taskId=${TaskId}`;
        // Effectuer la requête POST
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du statut');
        }
        
        // Retourner la réponse JSON
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
    }
};

export const removeAction = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/actions/deleteAction/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete action');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting action:', error);
        throw error;
    }
};

export const getActionsByTaskId  = async (TaskId: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/actions/getActionsByTaskId/${TaskId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch action details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching action details:', error);
        throw error;
    }
};

export const getActionById  = async (actionId: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/actions/getActionById/${actionId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch action details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching action details:', error);
        throw error;
    }
};


export const updateActions = async (id: number, data: any): Promise<BaseResponse<any>> => {

    try {
        const response = await fetch(`${getBaseUrl()}/actions/updateAction/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', // Spécifier le type de contenu comme JSON
            },
            body: JSON.stringify(data), // Convertir l'objet JavaScript en chaîne JSON
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

