// src/services/ApiService.ts
import { BaseResponse } from '../interfaces/ApiResponse';
const BASE_URL = 'http://localhost:8090/api/v1';
import { getBaseUrl } from "./baseUrl";

    export const SaveDepartement = async (data: any): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments/Adddepartments`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: data,
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde du projet');
        }
        return await response.json();
    } catch (error: any) {
        throw error;
    }
};


export const getAllDepartement = async () => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments/getAllDepartments`);
        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};
export const removeDepartement = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/department/deleteDepartment/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};

export const getDepartementById  = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments/getDepartmentById/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch project details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
};

export const updateDepartement = async (id: number, data: any): Promise<BaseResponse<any>> => {

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



