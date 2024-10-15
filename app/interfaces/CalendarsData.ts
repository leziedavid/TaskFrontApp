// Interface pour les détails du projet
export interface ProjectDetails {
    projectId: number;
    projectName: string;
    projectState: string; // État du projet
    projectPriority: string; // Priorité du projet
    prioColor: string; // Couleur de priorité du projet
    stateColor: string; // Couleur d'état du projet
    progress: number; // Progression du projet en pourcentage
    projectCreatedAt: string; // Date de création du projet
    projectUpdatedAt: string; // Date de mise à jour du projet
    projectDescription: string; // Description du projet
    projectCodes: string; // Code du projet
    projectNombreJours: string; // Nombre de jours pour le projet
    projectStartDate: string; // Date de début du projet
    projectEndDate: string; // Date de fin du projet
    userId: number; // ID de l'utilisateur associé au projet
}

// Interface principale pour les données de la tâche
export interface TaskDataCalendar {
    taskId: number;
    taskName: string;
    taskCode: string; // Code de la tâche
    taskDescription: string; // Description de la tâche
    taskStartDate: string;
    taskEndDate: string;
    assignedUser: {
        lastname: string;
        firstname: string;
    };
    taskPriority: string;
    taskState: string; // État de la tâche
    prioColor: string; // Couleur de priorité
    stateColor: string; // Couleur d'état
    taskNombreJours: string; // Nombre de jours pour la tâche
    taskNombreHeurs: string; // Nombre d'heures pour la tâche
    taskCreatedAt: string; // Date de création de la tâche
    taskUpdatedAt: string; // Date de mise à jour de la tâche
    isValides: number; // Statut de validation
    alerteDate: string; // Date d'alerte
    project: ProjectDetails; // Détails du projet associé
}
