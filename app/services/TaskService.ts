// src/services/ApiService.ts
import { BaseResponse } from '../interfaces/ApiResponse';
import { ProjectsDetails, Task } from '../interfaces/Global';
import { TaskDTO } from '../interfaces/ModelsTask';
import { getBaseUrl } from "./baseUrl";
const BASE_URL = 'http://localhost:8090/api/v1';

export const SaveTask = async (data: any): Promise<BaseResponse<any>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/addTasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Spécifier le type de contenu comme JSON
            },
            body: JSON.stringify(data), // Convertir l'objet JavaScript en chaîne JSON
        });

        if (!response.ok) {

            throw new Error('Erreur lors de la sauvegarde du projet');
        }

        return await response.json();

    } catch (error: any) {
        throw error;
    }
};

export const deleteTask = async (id: number) => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/delete/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete tasks');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting tasks:', error);
        throw error;
    }
};


export const getTaskByProjectId = async (projectCode: string) => {
    const token = localStorage.getItem('token');

    try {

        const response = await fetch(`${getBaseUrl()}/tasks/getAllTasksByProjectId/${projectCode}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                    'Content-Type': 'application/json',
                },
            }
        );
        
        // if (!response.ok) {
        //     throw new Error('Failed to fetch task');
        // }

        return await response.json();
    } catch (error) {
        console.error('Error fetching task:', error);
        throw error;
    }
};

export const fetchTaskDetails = async (codes: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/detail/${codes}`);
        if (!response.ok) {
            throw new Error('Failed to fetch task details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching task detail:', error);
        throw error;
    }
};

export const changeTaskState = async (id: number, state: string, selectedColors: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/updateTaskState/${id}?state=${encodeURIComponent(state)}&Colors=${encodeURIComponent(selectedColors)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        return await response.json();
    } catch (error) {
        console.error("Toutes les actions associées doivent avoir un statut terminer");
        throw error;
    }
};

export const validteTaskState = async (id: number, state: string, selectedColors: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/validteTaskState/${id}?state=${encodeURIComponent(state)}&Colors=${encodeURIComponent(selectedColors)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const updateProjectAndTask = async (
    projectId: number,
    taskId: number,
    newState: number,
    selectedColors: string
): Promise<BaseResponse<TaskDTO>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/projects/${projectId}/tasks/${taskId}?newState=${encodeURIComponent(newState.toString())}&selectedColors=${encodeURIComponent(selectedColors)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Failed to update project and task');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating project and task:', error);
        throw error;
    }
};

export const fetchTaskById = async (codes: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/fetchTaskById/${codes}`);
        if (!response.ok) {
            throw new Error('Failed to fetch task details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching task detail:', error);
        throw error;
    }
};

export const updateTask = async (id: string, data: any): Promise<BaseResponse<any>> => {

    try {
        const response = await fetch(`${getBaseUrl()}/tasks/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Spécifier le type de contenu comme JSON
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


export const updateAlerteDate = async (taskId: number, assignedUserId: string): Promise<BaseResponse<TaskDTO>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/updateAlerteDate/${taskId}?newAlerteDate=${assignedUserId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',},
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error: ${errorMessage}`);
            }
            const data: BaseResponse<TaskDTO> = await response.json();
            return data;

        } catch (error) {
            console.error('Failed to update task:', error);
            throw error;
        }
}

export const updateUsersTask = async (taskId: number, assignedUserId: number): Promise<BaseResponse<TaskDTO>> => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/updateUsersTask/${taskId}?assignedUserId=${assignedUserId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',},
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error: ${errorMessage}`);
            }
            const data: BaseResponse<TaskDTO> = await response.json();
            return data;

        } catch (error) {
            console.error('Failed to update task:', error);
            throw error;
        }
}

export const changeTaskPriority = async (id: number, priority: string, selectedColors: string) => {
    try {
        const response = await fetch(`${getBaseUrl()}/tasks/changeTaskPriority/${id}?priority=${encodeURIComponent(priority)}&Colors=${encodeURIComponent(selectedColors)}`, {
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

export const getFilteredTasks = async (
    projectCode?: string,
    taskPriority?: string,
    taskState?: string,
    assignedUserId?: number,
    // progression?: number,
    startDate?: string,
    endDate?: string
): Promise<BaseResponse<Task[]>> => {  // Assurez-vous que le type est BaseResponse<Task[]>
    const token = localStorage.getItem('token');
    try {
        const params = new URLSearchParams();

        if (projectCode) params.append('projectCode', projectCode);
        if (taskPriority) params.append('taskPriority', taskPriority);
        if (taskState) params.append('taskState', taskState);
        if (assignedUserId !== undefined) params.append('assignedUserId', assignedUserId.toString());
        // if (progression !== undefined) params.append('progression', progression.toString());
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(`${getBaseUrl()}/tasks/filter?${params.toString()}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Ajoutez le préfixe 'Bearer ' au token JWT
                'Content-Type': 'application/json',
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

// /tasks/update/



