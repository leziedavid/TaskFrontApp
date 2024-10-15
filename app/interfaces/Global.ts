export interface Department {
    departmentId: number | null;
    departmentName: string | null;
    departmentSigle: string | null;
    departmentCreatedAt: string;
    departmentUpdatedAt: string;
    
}

// src/interfaces/Leave.ts
export interface Leave {
    leaveId: number;
    userId: number;
    startDate: Date;
    endDate: Date;
    leaveType: string;
    status: string;
    description: string;
}


export interface User {
    length: number;
    userId: number;
    // isValides: number;
    isValid: number;
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
    authorities: Authority[];
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    departments: Department[];
    leaves: Leave[];  // Ajout des congés
    
}

export interface Authority {
    authority: string;
}

export interface Project {
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
    filesData: FileData[];
    user: User;
    id: number;
}

export interface FileData {
    id: number;
    name: string;
    type: string;
    size: number;
    publicId: string;
    filePath: string;
    title: string;
    dateCreation: string;
    dateModification: string;
}

export interface Task {
    isValides: number;
    taskId: number;
    taskCode: string;
    projectId: number;
    taskName: string;
    taskDescription: string;
    taskPriority: string;
    taskState: string;
    prioColor: string ;
    stateColor: string;
    taskStartDate: string;
    taskEndDate: string;
    taskCreatedAt: string;
    taskUpdatedAt: string;
    alerteDate: string;
    progression: any; // Adjust type as per API response
    colorCode: string;
    project: Project;
    taskNombreHeurs: string;
    taskNombreJours: string;
    user: User;
}

export interface UserProject {
    userprojectId: number;
    user: User;
    project: Project;
    leader: boolean;
}

export interface ProjectsDetails {
    projects: Project;
    users: UserProject[];
    tasks: Task[];
}
