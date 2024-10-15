import { z } from 'zod';

// Définir le schéma de validation avec des messages d'erreur en français
export const trajetSchema = z.object({
    depart: z.object({
        lat: z.number().nonnegative({ message: "La latitude du départ doit être un nombre positif ou nul." }),
        lon: z.number().finite({ message: "La longitude du départ doit être un nombre fini." }), // Assurer que lon est un nombre fini
    }),
    arrivee: z.object({
        lat: z.number().nonnegative({ message: "La latitude de l'arrivée doit être un nombre positif ou nul." }),
        lon: z.number() .finite({ message: "La longitude de l'arrivée doit être un nombre fini." }), // Assurer que lon est un nombre fini
    }),
    temps_depart_prevu: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Le format de la date de départ est invalide." }),
    nombre_de_places: z.number().min(1, { message: "Le nombre de places doit être au moins 1." }),
    page: z.number().optional().default(1), // Paramètre optionnel pour la page
    limit: z.number().optional().default(10) // Paramètre optionnel pour la limite par page
    
});

export type TrajetSchema = z.infer<typeof trajetSchema>;
