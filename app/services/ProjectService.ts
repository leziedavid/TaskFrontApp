// src/services/ApiService.ts
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../interfaces/ApiResponse';
import { Project } from '../interfaces/Global';
import { Department } from '../interfaces/Global';
const BASE_URL = 'http://localhost:8090/api/v1';
import { getBaseUrl } from "./baseUrl";


export const getAllUsersByMultipleDepartment = async (department: any) => {
    try {
        
        const response = await fetch(`${getBaseUrl()}/departments/users?ids=${department}`);
        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};
export const getAllUsersByDepartment = async (department: any) => {
    try {
        const response = await fetch(`${getBaseUrl()}/departments/${department}/users`);
        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

export const getAllDepartments = async () => {
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

export const SaveProject = async (data: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects`, {
            method: 'POST',
            body: data,
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde du projet');
        }
        
        return await response.json();

    } catch (error: any) {
        toast.error(`Erreur lors de la sauvegarde du projet : ${error.message}`);
        throw error;
    }
};

export const updateProject = async (id: string, data: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/update/${id}`, {
            method: 'PUT',
            body: data,
            // headers: { 'Content-Type': 'multipart/form-data' } // Décommentez cette ligne si nécessaire
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

export const addNewsFile = async (data: FormData): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/files/addNewsFile`, {
            method: 'POST',
            body: data
        });
    
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde des fichiers');
        }
    
        return await response.json();
    
    } catch (error) {
        toast.error(`Erreur lors de la sauvegarde des fichiers`);
        throw error;
    }
    
};


export const getAllProjects = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'projectId'
): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;

    // Construire l'URL avec les paramètres de pagination et de tri
    const url = new URL(`${getBaseUrl()}/projects/getAllProjects`);
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
            throw new Error('Failed to fetch projects');
        }
        
        const data: BaseResponse<Project[]> = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const searchProjects = async (
    projectName?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'projectId'
): Promise<BaseResponse<Project[]>> => {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;

    // Construire l'URL avec les paramètres de recherche, pagination et tri
    const url = new URL(`${getBaseUrl()}/projects/search`);
    if (projectName) {
        url.searchParams.append('projectName', projectName);
    }
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
            throw new Error('Failed to fetch projects');
        }
        
        const data: BaseResponse<Project[]> = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getAllProjects2 = async () => {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;

    try {
        
        const response = await fetch(`${getBaseUrl()}/projects/getAllProjects`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
                ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini

            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const projectsStatistics = async () => {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;
    try {
        
        const response = await fetch(`${getBaseUrl()}/projects/statistics`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
                ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini

            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getProjectDetails = async (projectCode: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/detail/${projectCode}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch project details');
        }

        return await response.json();
    } catch (error) {
        // console.error('Error fetching project details:', error);
        throw error;
    }
};
export const getProjectUsers = async (projectCode: string) => {
    try {
        // const response = await fetch(`${getBaseUrl()}/projects/getProjectUsersById/${projectCode}`);
        const response = await fetch(`${getBaseUrl()}/projects/usersliste/${projectCode}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch project details');
        }

        return await response.json();
    } catch (error) {
        // console.error('Error fetching project details:', error);
        throw error;
    }
};
export const getProjectUsersById = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/getProjectUsersById/${id}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch project details');
        }

        return await response.json();
    } catch (error) {
        // console.error('Error fetching project details:', error);
        throw error;
    }
};

export const getProjectByCodes = async (projectCode: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/getProjectByCodes/${projectCode}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch project details');
        }

        return await response.json();
    } catch (error) {
        // console.error('Error fetching project details:', error);
        throw error;
    }
};

export const deleteProject = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/delete/${id}`, {
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

export const changePriority = async (id: number, priority: string, selectedColors: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/updatePriority/${id}?priority=${encodeURIComponent(priority)}&Colors=${encodeURIComponent(selectedColors)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Failed to update priority');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating priority:', error);
        throw error;
    }
};

export const changeState = async (id: number, state: string, selectedColors: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/updateState/${id}?state=${encodeURIComponent(state)}&Colors=${encodeURIComponent(selectedColors)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Failed to update priority');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating priority:', error);
        throw error;
    }
};

export const assignUsersToProject = async (id: string, data: FormData) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/assignUsers/${id}/assignUsers`, {
            method: 'POST',
            body: data
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status} - ${response.statusText}`);
        }

        return await response.json(); // Si vous souhaitez retourner des données du backend
    } catch (error) {
        throw new Error(`Erreur lors de l'assignation des utilisateurs au projet :`);
    }
};


export const removeUserFromProject = async (projectId: string, userId: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/removeUserFromProject/${projectId}/users/${userId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete user from project');
        }
        return await response.json();

    } catch (error) {
        
        console.error('Error deleting user from project:', error);
        throw error;
    }
};

export const  updateGroupLeader = async (projectId: string, currentLeaderId: number, newLeaderId: number) => {
    try {
        
        const response = await fetch(`${getBaseUrl()}/projects/updateGroupLeader/${projectId}?currentLeaderId=${encodeURIComponent(currentLeaderId)}&newLeaderId=${encodeURIComponent(newLeaderId)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Ajoutez vos headers d'authentification ou autres si nécessaire
            },
            body: JSON.stringify({ currentLeaderId, newLeaderId }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du leader : ' + response.statusText);
        }

        console.log('Mise à jour du leader réussie');
        return await response.json();

        } catch (error) {

            console.error('Erreur lors de la mise à jour du leader :');
            // Gérez l'erreur selon vos besoins
        }
};


// Fonction de filtre dans votre projet
export const getFilteredProjects = async (
    priority: string,
    state: string,
    departmentId?: number,
    userIds?: number[],  // Liste des userIds
    progress?: string,
    startDate?: string,
    endDate?: string,
    page: number = 0,   // Ajoutez le paramètre de pagination
    size: number = 10,   // Ajoutez le paramètre de taille de page
    sortBy: string = 'projectId'
    
): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;

    try {
        const params = new URLSearchParams();

        if (priority) params.append('priority', priority);
        if (state) params.append('state', state);
        if (departmentId) params.append('departmentId', departmentId.toString());
        if (userIds) params.append('userIds', JSON.stringify(userIds));  // Ajouter les userIds
        if (progress) params.append('progress', progress.toString());
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (page !== undefined) params.append('page', page.toString());
        if (size !== undefined) params.append('size', size.toString());
        if (sortBy !== undefined) params.append('sortBy', size.toString());

        console.log(userIds);
        const response = await fetch(`${getBaseUrl()}/projects/filter?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
                ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini

            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch filtered projects');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching filtered projects:', error);
        throw error;
    }
};


export const getFilteredProjects2 = async (
    priority: string,
    state: string,
    departmentId?: number,
    userIds?: number[],  // Liste des userIds
    progress?: number,
    startDate?: string,
    endDate?: string
): Promise<BaseResponse<Project[]>> => {
    // Assurez-vous que le type est BaseResponse<Project[]>
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    const userId = version ? version.split('@')[1] : null;
    
    try {
        const params = new URLSearchParams();

        if (priority) params.append('priority', priority);
        if (state) params.append('state', state);
        if (departmentId) params.append('departmentId', departmentId.toString());
        if (userIds) params.append('userIds', JSON.stringify(userIds));  // Ajouter les userIds
        if (progress) params.append('progress', progress.toString());
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(`${getBaseUrl()}/projects/filter?${params.toString()}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
                ...(userId && { 'userId': userId }), // Ajouter User-ID si userId est défini

            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch filtered projects');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching filtered projects:', error);
        throw error;
    }
};

export const getAllProjectsEndTaskByUserId = async ( userId: number): Promise<BaseResponse<any>> => {
    const token = localStorage.getItem('token');
    const version = localStorage.getItem('version');
    
    try {
        const response = await fetch(`${getBaseUrl()}/projects/user/${userId}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
                
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch filtered projects');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching filtered projects:', error);
        throw error;
    }
};





