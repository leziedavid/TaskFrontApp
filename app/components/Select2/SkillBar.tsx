import React from 'react';

// Interface pour les propriétés de la compétence
interface SkillProps {
    level: number; // Niveau de compétence entre 0 et 100
    color: string; // Couleur de base de la barre de progression (classe Tailwind)
}

// Composant de la barre de compétence
const SkillBar: React.FC<SkillProps> = ({ level, color }) => {
    // Calculer la largeur de la barre en pourcentage
    const barWidth = `${level}%`;

    // Fonction pour ajuster la couleur en fonction du niveau
    const getColor = (level: number, baseColor: string): string => {
        // Si le niveau est à 100%, retourner la couleur spécifique
        if (level >= 100) {
            return '#012340'; // Couleur spécifique lorsque le niveau est à 100%
        } else {
            // Calculer la saturation en fonction du niveau pour la couleur de base
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
        <div className="">
            <div className="h-1 bg-[#EDEDED] rounded-full">
                <div className="h-full rounded-full"
                    style={{
                        width: barWidth,
                        backgroundColor: getColor(level, color)
                    }}
                />
            </div>
        </div>
    );
};

export default SkillBar;
