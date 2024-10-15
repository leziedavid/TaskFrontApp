// services/DateUtils.ts
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        // hour: '2-digit',
        // minute: '2-digit'
    };

    const formatter = new Intl.DateTimeFormat('fr-FR', options);

    const formattedDate = formatter.format(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${formattedDate}`;
    // return `${formattedDate} ${hours}h${minutes}`;
}



export function formatDateTime(dateString: string | undefined): string {
    // Vérifiez si dateString est défini et est une chaîne de caractères
    if (typeof dateString !== 'string' || !dateString.trim()) {
        throw new Error('Invalid date string provided');
    }
    
    // Transformez la chaîne de date de votre base de données en format ISO 8601
    const isoDateString = dateString.replace(' ', 'T') + 'Z';
    
    const date = new Date(isoDateString);

    // Vérifiez si la date est valide
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    };

    const formatter = new Intl.DateTimeFormat('fr-FR', options);

    const formattedDate = formatter.format(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${formattedDate} ${hours}h${minutes}`;
}

