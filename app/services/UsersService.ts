
import { BaseResponse } from "../interfaces/ApiResponse";
import { getBaseUrl } from "./baseUrl";
const BASE_URL = 'http://localhost:8090/api/v1';


export const SaveUsers = async (data: FormData): Promise<BaseResponse<any>> => {

    try {

        const response = await fetch(`${getBaseUrl()}/users/addUsers`, {
            method: 'POST',
            body: data,
            });

        return await response.json();

    } catch (error: any) {
        // toast.error(`Erreur lors de la sauvegarde de l'utilisateur : ${error.message}`);
        throw error;
    }
};

export const updateUser = async (id: string, data: FormData): Promise<BaseResponse<any>> => {

    try {

        const response = await fetch(`${getBaseUrl()}/users/updateUser/${id}`, {
            method: 'PUT',
            body: data,
        });

        return await response.json();

    } catch (error: any) {
        
        console.error(`Erreur lors de la mise à jour du projet : ${error.message}`);
        throw error;
    }
    
};


export const getAllUsersService2 = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'userId'
): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;

    // Construire l'URL avec les paramètres de pagination et de tri
    const url = new URL(`${getBaseUrl()}/users/getAllUsersByDepartment2`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());
    url.searchParams.append('sortBy', sortBy);

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
                ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const data: BaseResponse<any> = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getAllUsersService = async () => {
    try {
        const response = await fetch(`${getBaseUrl()}/users/getAllUsersByDepartment`);
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const updateUsersRoles = async (userId: number, isValides: number | null): Promise<BaseResponse<any>> => {
    try {
        // Construire l'URL avec les paramètres d'URL
        const url = `${getBaseUrl()}/users/update-usersRoles?userId=${userId}&isValides=${isValides}`;
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

export const getUserByIdWithDepartments = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/users/getUserByIdWithDepartments/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching user detail:', error);
        throw error;
    }
};

export const deleteUser = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/users/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete compte');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting compte:', error);
        throw error;
    }
};
interface User {
    id: number; // ou string, selon la structure de ton utilisateur
    // Ajoute d'autres propriétés si nécessaire
}

export const addUsersToTask = async (taskId: number | undefined, users: number[]): Promise<any> => {
    if (taskId === undefined) {
        throw new Error('L\'ID de la tâche est requis.');
    }

    try {
        const response = await fetch(`${getBaseUrl()}/abonnements/${taskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIds: users }), // Envoie un objet avec userIds
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout des utilisateurs');
        }

        const data = await response.json();
        return data; // Retourne les données de la réponse
    } catch (error) {
        console.error('Erreur:', error);
        throw error; // Relève l'erreur pour qu'elle puisse être gérée dans le composant
    }
};
