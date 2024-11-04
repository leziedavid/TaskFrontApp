import React from 'react';

// Interface pour les propriétés de la compétence
interface SkillProps {
    level: number; // Niveau de compétence entre 0 et 100
    color: string; // Couleur de base de la barre de progression (classe Tailwind)
    Completed: string; // Couleur de base de la barre de progression (classe Tailwind)
}

// Composant de la barre de compétence
const SkillBar: React.FC<SkillProps> = ({ level, color,Completed }) => {
    // Calculer la largeur de la barre en pourcentage
    const barWidth = `${level}%`;

    // Fonction pour ajuster la couleur en fonction du niveau
    const getColor = (level: number, baseColor: string): string => {
        if (level >= 100) {
            return '#012340'; // Couleur spécifique lorsque le niveau est à 100%
        } else {
            const hslRegex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
            const match = baseColor.match(hslRegex);
            if (match) {
                const hue = match[1];
                const saturation = match[2];
                const lightness = match[3];
                const newSaturation = Number(saturation) + (100 - Number(saturation)) * (level / 100);
                return `hsl(${hue}, ${newSaturation}%, ${lightness}%)`;
            } else {
                return baseColor;
            }
        }
    };

    return (
        <div className="flex w-full h-2 bg-[#EDEDED] overflow-hidden font-sans rounded-full bg-blue-gray-50">
            <div className="flex items-center justify-center h-full text-white text-xs break-all rounded-full"
                style={{
                    width: barWidth,
                    backgroundColor: getColor(level, color),
                }}
            >
                <span className="text-[0.55rem]">{level}% {Completed}</span> {/* Réduire la taille du texte ici */}
            </div>
        </div>
    );
};

export default SkillBar;
