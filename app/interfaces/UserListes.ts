// UserListes.ts

export interface UserListes {

    userprojectId: number;
    
    user: {
        length: number;
        userId: number;
        isValides: number;
        lastname: string;
        firstname: string;
        phone: string;
        email: string;
        username: string;
        fonction: string;
        role: string;
        otp: number;
        genre: string;
        usersCreatedAt: string;
        usersUpdatedAt: string;
        enabled: boolean;
        authorities: { authority: string }[];
        accountNonExpired: boolean;
        accountNonLocked: boolean;
        credentialsNonExpired: boolean;
    };
    project: {
        projectId: number;
        projectName: string;
        projectCodes: string;
        projectNombreJours: string;
        projectState: string;
        projectPriority: string;
        prioColor: string;
        stateColor: string;
        progress: number;
        projectDescription: string;
        projectStartDate: string;
        projectEndDate: string;
        projectCreatedAt: string;
        projectUpdatedAt: string;
        filesData: {
            id: number;
            name: string;
            type: string;
            size: number;
            publicId: string;
            filePath: string;
            title: string;
            dateCreation: string;
            dateModification: string;
        }[];
        user: {
            userId: number;
            lastname: string;
            firstname: string;
            phone: string;
            email: string;
            username: string;
            fonction: string;
            otp: number;
            genre: string;
            role: string;
            usersCreatedAt: string;
            usersUpdatedAt: string;
            enabled: boolean;
            authorities: { authority: string }[];
            accountNonExpired: boolean;
            accountNonLocked: boolean;
            credentialsNonExpired: boolean;
        };
        id: number;
    };
    leader: boolean;
}
