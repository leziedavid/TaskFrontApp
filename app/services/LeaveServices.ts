// src/services/LeaveServices.ts

import { BaseResponse } from '../interfaces/ApiResponse';

const BASE_URL = 'http://localhost:8090/api/v1';
import { getBaseUrl } from "./baseUrl";
// Fonction pour ajouter un congé
export const saveLeaves = async (data: any): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/leave/addLeave`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde du congé');
        }
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la sauvegarde du congé:', error);
        throw error;
    }
};

// Fonction pour obtenir un congé par ID
export const getLeavesById = async (id: number): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/leave/getLeaveById/${id}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du congé');
        }
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la récupération du congé:', error);
        throw error;
    }
};

// Fonction pour obtenir tous les congés
export const getAllLeaves = async (): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/leave/getAllLeaves`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des congés');
        }
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la récupération des congés:', error);
        throw error;
    }
};

// Fonction pour obtenir les congés par ID utilisateur
export const getLeavesByUserId = async (userId: number): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/leave/getLeavesByUserId/${userId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des congés pour l\'utilisateur');
        }
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la récupération des congés pour l\'utilisateur:', error);
        throw error;
    }
};

// Fonction pour mettre à jour un congé
export const updateLeave = async (id: number, data: any): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/leave/updateLeave/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du congé');
        }
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la mise à jour du congé:', error);
        throw error;
    }
};

// Fonction pour supprimer un congé
export const deleteLeave = async (id: number): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/leave/deleteLeave/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du congé');
        }
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la suppression du congé:', error);
        throw error;
    }
};

// Fonction pour mettre à jour le statut d'un congé
export const updateLeaveStatus = async (leaveId: number, status: string): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/leave/update-leave-status?leaveId=${leaveId}&status=${status}`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du statut du congé');
        }
        return await response.json();
    } catch (error: any) {
        console.error('Erreur lors de la mise à jour du statut du congé:', error);
        throw error;
    }
};
