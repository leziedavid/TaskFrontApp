export interface ActionDTO {
    actionId: number;
    libelle: string;
    description: string;
    actionCreatedAt: string; // ou Date si vous préférez manipuler les dates en tant qu'objets Date
    actionUpdatedAt: string; // ou Date si vous préférez manipuler les dates en tant qu'objets Date
    hours: number;
    taskId: number;
    userId: number;
    actionStartDate: string; // ou Date si vous préférez manipuler les dates en tant qu'objets Date
    actionEndDate: string; // ou Date si vous préférez manipuler les dates en tant qu'objets Date
    isValides: number;
    nombreJours: string;
}
