// components/Icon.tsx
import React from 'react';
import * as lucideIcons from 'lucide-react';

// Type pour les icônes disponibles dans lucide-react
type IconName = keyof typeof lucideIcons;

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor' }) => {
    // Extraction de l'icône à partir du nom
    const IconComponent = lucideIcons[name] as React.ElementType;

    if (!IconComponent) {
        console.warn(`Icon "${name}" does not exist.`);
        return null;
    }

    return (
        <IconComponent
            size={size}
            color={color}
            style={{ display: 'block' }}
        />
    );
};

export default Icon;
