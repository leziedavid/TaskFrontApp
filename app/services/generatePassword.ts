// passwordService.ts
export function generatePassword(length: number = 8): string { // Longueur par défaut à 8 caractères
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Lettres possibles
    const numbers = '0123456789'; // Chiffres possibles
    const specialChars = '@'; // Caractères spéciaux possibles (vous pouvez en ajouter d'autres)
    const allCharacters = letters + numbers + specialChars; // Tous les caractères disponibles

    if (length < 6) { // Longueur minimale pour inclure au moins un caractère spécial
        throw new Error('La longueur du mot de passe doit être d\'au moins 6 caractères.');
    }

    // Assurer qu'il y a au moins 5 lettres et 5 chiffres, mais nous limitons la longueur totale à 8 caractères
    const passwordArray: string[] = [];
    for (let i = 0; i < Math.min(5, Math.floor(length / 2)); i++) { // Ajuster le nombre de lettres et de chiffres en fonction de la longueur totale
        if (passwordArray.length < length - 1) {
            passwordArray.push(letters.charAt(Math.floor(Math.random() * letters.length))); // Ajouter une lettre
        }
        if (passwordArray.length < length - 1) {
            passwordArray.push(numbers.charAt(Math.floor(Math.random() * numbers.length))); // Ajouter un chiffre
        }
    }

    // Ajouter au moins un caractère spécial si la longueur le permet
    if (passwordArray.length < length) {
        passwordArray.push(specialChars.charAt(Math.floor(Math.random() * specialChars.length))); // Ajouter un caractère spécial
    }

    // Compléter le reste de la longueur du mot de passe avec des caractères aléatoires
    while (passwordArray.length < length) {
        passwordArray.push(allCharacters.charAt(Math.floor(Math.random() * allCharacters.length)));
    }

    // Mélanger les caractères pour éviter les motifs prévisibles
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]; // Échange des caractères
    }

    return passwordArray.join(''); // Convertir le tableau de caractères en chaîne de caractères
}
