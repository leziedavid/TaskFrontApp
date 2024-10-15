import React, { FC, useState, useRef, useEffect } from 'react';

interface PercentageSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const PercentageSelect: FC<PercentageSelectProps> = ({ value, onChange }) => {
    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedInterval, setSelectedInterval] = useState<string>(value);

    // Référence pour le menu déroulant
    const selectRef = useRef<HTMLDivElement>(null);

    // Définir les intervalles de pourcentage
    const intervals = Array.from({ length: 10 }, (_, i) => `${i * 10}-${(i + 1) * 10}`);

    // Filtrer les options en fonction du terme de recherche
    const filteredIntervals = intervals.filter(interval =>
        interval.includes(searchTerm)
    );

    // Fonction pour basculer le menu déroulant
    const handleToggleDropdown = () => setDropdownOpen(prev => !prev);

    // Fonction pour sélectionner une option
    const handleOptionSelection = (interval: string) => {
        setSelectedInterval(interval);
        onChange(interval); // Passer l'intervalle sélectionné
        setDropdownOpen(false);
    };

    // Fermer le menu déroulant si on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className="relative z-0 bg-white dark:bg-gray-800">
            <div
                onClick={handleToggleDropdown}
                className="w-full rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-blue-500 cursor-pointer"
            >
                <div className="flex items-center justify-between">
                    <span className="truncate flex gap-2 items-center">
                        {selectedInterval !== '' ? `${selectedInterval}%` : 'Sélectionnez un intervalle'}
                    </span>
                    <svg className={`ml-2 h-4 w-4 transition transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'} />
                    </svg>
                </div>
            </div>
            {isDropdownOpen && (
                <div className="mt-1 absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded border border-stroke">
                    <input
                        type="text"
                        placeholder="Rechercher un intervalle..."
                        className="w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-blue-500 dark:bg-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="max-h-60 overflow-y-auto">
                        {filteredIntervals.length ? (
                            filteredIntervals.map(interval => (
                                <div
                                    key={interval}
                                    onClick={() => handleOptionSelection(interval)}
                                    className={`cursor-pointer py-2 px-5 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 ${selectedInterval === interval ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                                >
                                    <span>{`${interval}%`}</span>
                                </div>
                            ))
                        ) : (
                            <div className="py-2 px-5">Aucun intervalle trouvé</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PercentageSelect;
