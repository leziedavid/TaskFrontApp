// components/SelectAllRoles.tsx
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { roles } from '../../services/rolesData';
 // Assurez-vous que le chemin est correct

interface SelectAllRolesProps {
    setRole: React.Dispatch<React.SetStateAction<string>>;
    rolesValue: string;
}

const SelectAllRoles: React.FC<SelectAllRolesProps> = ({ setRole,rolesValue }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const selectRef = useRef<HTMLDivElement>(null);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen && selectRef.current) {
            const input = selectRef.current.querySelector<HTMLInputElement>('input');
            if (input) {
                input.focus();
            }
        }
    };

    const handleRoleSelection = (roleId: string) => {
        setSelectedOption(roleId);

        // Mettre à jour setRole avec le rôle sélectionné
        setRole(roleId);

        // Fermer le menu déroulant après la sélection
        setIsDropdownOpen(false);
    };

    // Filtrer les rôles en fonction du terme de recherche
    const filteredRoles = roles.filter(role =>
        role.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setSelectedOption(rolesValue);
    }, [rolesValue]);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div ref={selectRef} className="relative z-0 bg-white dark:bg-form-input">
                <div
                    onClick={handleToggleDropdown}
                    className="w-full rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark cursor-pointer"
                >
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <span className="truncate flex gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z" fill="black" fillOpacity="0.6"/>
                                </svg>
                                {selectedOption  ? roles.find(role => role.id === selectedOption)?.label : 'Sélectionnez un rôle'}
                            </span>

                            <svg  className={`ml-2 h-4 w-4 transition transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none"viewBox="0 0 24 24" stroke="currentColor"  >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}/>
                            </svg>
                        </div>
                    </div>
                </div>
                {isDropdownOpen && (
                    <div className="mt-1 absolute  w-full bg-white dark:bg-form-input shadow-lg rounded border border-stroke">
                        <input
                            type="text"
                            placeholder="Rechercher un rôle..."
                            className="w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark dark:bg-form-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}/>

                        <div className="max-h-60 overflow-y-auto">
                            {filteredRoles.length ? (
                                filteredRoles.map(role => (
                                    <div key={role.id}  onClick={() => handleRoleSelection(role.id)}
                                        className={`cursor-pointer py-2 px-5 hover:bg-gray-100 dark:hover:bg-form-input-dark flex items-center space-x-2 ${selectedOption === role.id ? 'bg-gray-200 dark:bg-form-input-dark' : ''}`} >
                                        <span>{role.label}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-2 px-5">Aucun rôle trouvé</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SelectAllRoles;
