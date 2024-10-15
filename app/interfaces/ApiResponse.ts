// src/interfaces/ApiResponse.ts
export interface BaseResponse<T> {
    code?: number;
    messages?: string;
    data?: T;
}
