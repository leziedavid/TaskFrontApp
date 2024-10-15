// Notification.ts

export interface UserDTO {
    userId: number;
    lastname: string;
    firstname: string;
    email: string;
    phone: string;
    username: string;
    password: string; // Assurez-vous que le mot de passe est nécessaire, souvent il peut être omis pour des raisons de sécurité
    fonction: string;
    token: string; // Assurez-vous de la nécessité de ce champ
    isValides: number;
    role: string;
}

export interface NotificationDTO {
    notificationId: number;
    title: string;
    message: string;
    createdAt: string; // Utilisé comme chaîne ISO 8601
    entityId: number;
    entityType: string;
    addBy: number; // ID de l'utilisateur qui a créé la notification
    userIds: number[]; // Liste des IDs des utilisateurs associés à la notification
    userAddBBy: UserDTO[]; // Détails de l'utilisateur qui a généré la notification
    statutLecteur?: number; // Peut être omis si nul
}
