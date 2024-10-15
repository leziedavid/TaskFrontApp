import React from 'react';

interface Props {
    dateStr: string; // Date string in format 'YYYY-MM-DD'
}

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    // Options pour formater la date
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
};

const DateConverter: React.FC<Props> = ({ dateStr }) => {
    const formattedDate = formatDate(dateStr);
    return <>{formattedDate}</>;
};
export default DateConverter;
