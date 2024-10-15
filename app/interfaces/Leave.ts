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
