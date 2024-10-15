
export interface Users {
    userId: number;
    leaderId: number;
    isValides: number;
    lastname: string;
    firstname: string;
    phone: string;
    email: string;
    username: string;
    role: string;
    password: string;
    fonction: string;
    genre: string;
    usersCreatedAt: Date;
    usersUpdatedAt: Date;
}


// Interface définie pour le type de la réponse
export interface ResponseUsersType {
    users: Users;
}