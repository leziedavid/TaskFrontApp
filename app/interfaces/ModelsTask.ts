// models.ts

// Interface pour la tâche
export interface TaskDTO {
    taskId: number;
    taskCode: string;
    taskName: string;
    taskDescription: string;
    taskPriority: 'ELEVEE' | 'MOYENNE' | 'FAIBLE'; // Adaptez selon les valeurs possibles
    taskState: 'EN_COURS' | 'TERMINEE' | 'EN_ATTENTE'; // Adaptez selon les valeurs possibles
    prioColor: string;
    taskNombreJours: string;
    taskNombreHeurs: string;
    alerteDate: string;
    taskStartDate: string; // ISO date string
    taskEndDate: string;   // ISO date string
    taskCreatedAt: string;   // ISO date string
    taskUpdatedAt: string;   // ISO date string
    projectId: number;
    isValides: number;
    userId: number;
    assigned: number;
}

// Interface pour l'action
export interface ActionDTO {
    actionId: number;
    libelle: string;
    taskStartDate: string;
    taskEndDate: string;
    description: string;
    nombreJours: number;
    hours: number;
    taskId: number;
    userId: number;
    isValides: number;
    actionStartDate: string;
    actionCreatedAt: string;
    actionUpdatedAt: string;
}

// Interface pour les fichiers
export interface FilesDTO {
    map(arg0: (files: any, index: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    fileId: number;
    originalName: string;
    mimetype: string;
    size: number;
    publicId: string;
    title: string;
    dateCreation?: string; // Optionnel si non fourni
    dateModification?: string; // Optionnel si non fourni
    empty?: boolean; // Optionnel selon votre API
}

// Interface pour l'observation
export interface ObservationDTO {
    observationId: number;
    libelle: string;
    description: string;
    observationCreatedAt: string;
    taskId: number;
    userId: number;
    observationUpdatedAt: string; // Ajouté pour correspondre à la réponse API
    filesData: FilesDTO[]; // Liste des fichiers associés
}

// Interface pour l'utilisateur
export interface UserDTO {
    userId: number;
    leaderId: number;
    isValides: number;
    lastname: string;
    firstname: string;
    phone: string;
    email: string;
    username: string;
    password: string;
    fonction: string;
    genre: string;
    role: string;
    usersCreatedAt: Date;
    usersUpdatedAt: Date;
}

// Interface pour les détails de la tâche
export interface TaskDetailsDTO {
    tasks: TaskDTO[];
    actions: ActionDTO[];
    observations: ObservationDTO[];
    assignedUsers: UserDTO[]; // Nouvelle propriété pour les utilisateurs assignés
}
