// baseUrl.ts
const BASE_URL_DEV = 'http://localhost:8090/api/v1';
const BASE_URL_PROD = 'http://192.168.4.55:8080/api/v1';

export const getBaseUrl = (): string => {
    return BASE_URL_PROD;
};
