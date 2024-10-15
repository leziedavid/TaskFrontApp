// Interfaces pour les fichiers
interface FileData {
    id: number;
    name: string;
    type: string;
    size: number;
    publicId: string;
    filePath: string;
    title: string;
    dateCreation: string; // ISO 8601
    dateModification: string; // ISO 8601
}

// Interfaces pour l'utilisateur
interface User {
    userId: number;
    lastname: string;
    firstname: string;
    phone: string;
    email: string;
    username: string;
    fonction: string;
    token: string;
    profil: string ; // Peut être nul
    otp: number;
    isValides: number;
    genre: string; // HOMME ou FEMME
    role: string; // ADMIN, USER, etc.
    usersCreatedAt: string; // ISO 8601
    usersUpdatedAt: string; // ISO 8601
    leaves: Leave[];
    enabled: boolean;
    authorities: Authority[];
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
}

// Interfaces pour les congés
interface Leave {
    leaveId: number;
    user: string;
    startDate: string; // ISO 8601
    endDate: string; // ISO 8601
    leaveType: string;
    status: string;
    description: string;
}

// Interfaces pour l'autorité
interface Authority {
    authority: string;
}

// Interfaces pour le projet
interface Project {
    projectId: number;
    projectName: string;
    projectCodes: string;
    projectNombreJours: string;
    projectState: string; // EN_COURS, EN_ATTENTE, etc.
    projectPriority: string; // ELEVEE, etc.
    prioColor: string;
    stateColor: string;
    progress: number;
    projectDescription: string;
    projectStartDate: string; // ISO 8601
    projectEndDate: string; // ISO 8601
    projectCreatedAt: string; // ISO 8601
    projectUpdatedAt: string; // ISO 8601
    filesData: FileData[];
    user: User; // Utilisateur associé au projet
}

// Interfaces pour l'utilisateur assigné
interface AssignedUser extends User {}

// Interfaces pour les tâches
interface Task {
    taskId: number;
    taskCode: string;
    taskName: string;
    taskDescription: string;
    taskPriority: string; // ELEVEE, etc.
    taskState: string; // EN_COURS, etc.
    prioColor: string;
    stateColor: string;
    taskNombreJours: number;
    taskNombreHeurs: number;
    taskStartDate: string; // ISO 8601
    taskEndDate: string; // ISO 8601
    taskCreatedAt: string; // ISO 8601
    taskUpdatedAt: string; // ISO 8601
    alerteDate: string; // ISO 8601
    progression: number ; // Peut être nul
    colorCode: string ; // Peut être nul
    isValides: number;
    project: Project; // Projet associé à la tâche
    user: User; // Utilisateur associé à la tâche
    assigned: AssignedUser; // Utilisateur assigné à la tâche
    projectId: number;
}

// Interface pour le retour de l'API
// Interface pour le retour de l'API
export interface ResponseRessource {
    projectId: number;
    projectName: string;
    projectCodes: string;
    tasks: Task[];
}