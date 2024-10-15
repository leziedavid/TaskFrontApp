export const convertToISODateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toISOString();
};