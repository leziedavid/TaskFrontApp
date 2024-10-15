// components/Icon.tsx
import { FC } from 'react';
import { Inbox, Users, Trash, LucideIcon } from 'lucide-react';

// Définir un type pour les icônes disponibles
type IconName = 'Inbox' | 'Users' | 'Trash';

interface IconProps {
    name: IconName;
    className?: string;
}

// Map des icônes disponibles
const iconMap: Record<IconName, LucideIcon> = {
    Inbox: Inbox,
    Users: Users,
    Trash: Trash,
};

// Composant Icon
const Icon: FC<IconProps> = ({ name, className }) => {
    const IconComponent = iconMap[name];
    return IconComponent ? <IconComponent className={className} /> : null;
};

export default Icon;
