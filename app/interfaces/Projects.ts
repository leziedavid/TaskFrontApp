// Define the interfaces for nested objects

export interface Project {
    projectId: number;
    projectName: string;
    projectState: string;
    projectPriority: string;
    prioColor: string;
    stateColor: string;
    progress: number;
    projectCreatedAt: string;
    projectUpdatedAt: string;
    projectDescription: string;
    projectCodes: string;
    projectNombreJours: string;
    projectStartDate: string;
    projectEndDate: string;
    userId: number;
    users: string;
    fichiers1: string;
    fichiers2: string;
    fichiers3: string;
    fichiers4: string;
    fichiers5: string;
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    title5: string;
    nbfiles: string;
}

export interface User {
    userId: number;
    lastname: string;
    firstname: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    fonction: string;
    response: string;
    token: string;
    genre: string;
    isValides: number;
    role: string;
    departmentName: string;
    departmentId: number;
    profil: string;
}

export interface AssignedUser {
    userId: number;
    lastname: string;
    firstname: string;
    email: string;
    phone: string;
    username: string;
    fonction: string;
    role: string;
    profil: string;
}

// Define the main Task interface

export interface Task {
    taskId: number;
    taskName: string;
    taskCode: string;
    taskDescription: string;
    taskPriority: string;
    taskState: string;
    prioColor: string;
    stateColor: string;
    taskNombreJours: string;
    taskNombreHeurs: string;
    projectCodes: string;
    progression: number;
    taskStartDate: string;
    taskEndDate: string;
    taskCreatedAt: string;
    taskUpdatedAt: string;
    isValides: number;
    alerteDate: string;
    projectId: number;
    colorCode: string;
    userId: number;
    assigned: number;
    project: Project;
    user: User;
    assignedUser: AssignedUser;
}

// Define the main API response interface

interface ApiResponse {
    data: Task[];
}
