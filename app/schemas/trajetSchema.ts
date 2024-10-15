// schemas.ts
import { z } from 'zod';

// Schéma pour la validation des coordonnées géographiques et du nom de la ville
export const arretSchema = z.object({
    lat: z.number()
        .nonnegative("La latitude doit être un nombre positif ou zéro.")
        .refine(val => val <= 90, "La latitude doit être comprise entre -90 et 90."),
    lon: z.number()
        .refine(val => val >= -180 && val <= 180, "La longitude doit être comprise entre -180 et 180."),
    ville: z.string()
        .min(1, "Le nom de la ville ne peut pas être vide.")
});

// Schéma pour la validation des trajets
export const trajetSchema = z.object({
    utilisateur_id: z.string().uuid("L'identifiant de l'utilisateur doit être un UUID valide."),
    point_depart: z.object({
        lat: z.number()
            .nonnegative("La latitude de départ doit être un nombre positif ou zéro.")
            .refine(val => val <= 90, "La latitude de départ doit être comprise entre -90 et 90."),
        lon: z.number()
            .refine(val => val >= -180 && val <= 180, "La longitude de départ doit être comprise entre -180 et 180."),
    }),
    
    ville_depart: z.string().min(1, "La ville de départ ne peut pas être vide."),

    point_arrivee: z.object({
        lat: z.number()
            .nonnegative("La latitude d'arrivée doit être un nombre positif ou zéro.")
            .refine(val => val <= 90, "La latitude d'arrivée doit être comprise entre -90 et 90."),
        lon: z.number()
            .refine(val => val >= -180 && val <= 180, "La longitude d'arrivée doit être comprise entre -180 et 180."),
    }),

    ville_arrivee: z.string().min(1, "La ville d'arrivée ne peut pas être vide."),

    temps_depart_prevu: z.string()
        .datetime("La date et l'heure de départ prévues doivent être au format ISO 8601."),
    temps_arrivee_prevu: z.string()
        .datetime("La date et l'heure d'arrivée prévues doivent être au format ISO 8601."),
    duree_estimee: z.number()
        .positive("La durée estimée doit être un nombre positif."),
    distance_estimee: z.number()
        .positive("La distance estimée doit être un nombre positif."),
    etat_trajet: z.string()
        .min(1, "L'état du trajet ne peut pas être vide."),
    mode_transport: z.string()
        .min(1, "Le mode de transport ne peut pas être vide."),
    price: z.number()
        .positive("Le prix doit être un nombre positif."),
    nombre_de_places: z.number()
        .positive("Le nombre de places doit être un nombre positif."),
    vehicule_id: z.string()
        .uuid("L'identifiant du véhicule doit être un UUID valide."),
    arrets: z.array(arretSchema)
});
