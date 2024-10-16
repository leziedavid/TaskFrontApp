// components/SelectAllFonction.tsx

import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Fonction } from '../../interfaces/Fonction';
import { getAllFonctionsService } from '../../services/FonctionsService';

interface SelectAllFonctionProps {
    setFonctions: React.Dispatch<React.SetStateAction<string>>;
    fonctionUser: string;
}

const SelectAllFonction: React.FC<SelectAllFonctionProps> = ({ setFonctions,fonctionUser}) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [response, setResponse] = useState<BaseResponse<Fonction[]> | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFonctions = async () => {
            try {
                const apiResponse = await getAllFonctionsService();
                setResponse(apiResponse);
            } catch (error) {
                console.error('Error fetching fonctions:', error);
                toast.error('Failed to fetch fonctions');
            }
        };

        fetchFonctions();
    }, []);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen && selectRef.current) {
            const input = selectRef.current.querySelector<HTMLInputElement>('input');
            if (input) {
                input.focus();
            }
        }
    };

    const toggleFonctionSelection = (nonFonction: string) => {
        const newSelection = selectedOption === nonFonction.toString() ? null : nonFonction.toString();

        setSelectedOption(newSelection);

        // Mettre à jour setFonctions avec l'ID de la fonction sélectionnée (ou une chaîne vide si aucune sélection)
        setFonctions(newSelection ? newSelection : '');

        // Fermer le menu déroulant après la sélection
        setIsDropdownOpen(false);

        // Récupérer la fonction sélectionnée mise à jour
        const updatedSelectedFonction = newSelection ? filteredFonctions?.find(fonction => fonction.nonFonction.toString() === newSelection) : null;

        return updatedSelectedFonction;
    };

    const filteredFonctions = response?.data?.filter(
        fonction => fonction.nonFonction.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {

        console.log(fonctionUser);
        setSelectedOption(fonctionUser);

    }, [fonctionUser]);

    return (

        <>
        <Toaster position="top-right" reverseOrder={false} />

            <div ref={selectRef} className="relative z-10 bg-white dark:bg-form-input">

                <div onClick={handleToggleDropdown} className="w-full rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark cursor-pointer">
                    <div className="relative">
                        <div className="flex items-center justify-between">

                            <span className="truncate flex gap-2">
                            <svg width="25" height="25" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clipRule="evenodd" d="M7.416 3C7.1407 3.63079 6.99906 4.31176 7 5C7 5.53044 7.21071 6.03914 7.58579 6.41422C7.96086 6.78929 8.46957 7 9 7H15C15.5304 7 16.0391 6.78929 16.4142 6.41422C16.7893 6.03914 17 5.53044 17 5C17 4.289 16.852 3.612 16.584 3H18C18.5304 3 19.0391 3.21072 19.4142 3.58579C19.7893 3.96086 20 4.46957 20 5V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V5C4 4.46957 4.21071 3.96086 4.58579 3.58579C4.96086 3.21072 5.46957 3 6 3H7.416ZM12 14H9C8.73478 14 8.48043 14.1054 8.29289 14.2929C8.10536 14.4804 8 14.7348 8 15C8 15.2652 8.10536 15.5196 8.29289 15.7071C8.48043 15.8946 8.73478 16 9 16H12C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15C13 14.7348 12.8946 14.4804 12.7071 14.2929C12.5196 14.1054 12.2652 14 12 14ZM15 10H9C8.74512 10.0003 8.49997 10.0979 8.31463 10.2729C8.1293 10.4478 8.01776 10.687 8.00283 10.9414C7.98789 11.1958 8.07067 11.4464 8.23426 11.6418C8.39785 11.8373 8.6299 11.9629 8.883 11.993L9 12H15C15.2652 12 15.5196 11.8946 15.7071 11.7071C15.8946 11.5196 16 11.2652 16 11C16 10.7348 15.8946 10.4804 15.7071 10.2929C15.5196 10.1054 15.2652 10 15 10ZM12 2C12.4222 1.99938 12.8397 2.08817 13.2251 2.26053C13.6105 2.43289 13.955 2.68491 14.236 3C14.664 3.478 14.94 4.093 14.991 4.772L15 5H9C9 4.275 9.257 3.61 9.685 3.092L9.764 3C10.314 2.386 11.112 2 12 2Z" fill="black" fillOpacity="0.6"/>
                            </svg>
                            
                                {selectedOption ? filteredFonctions?.find(f => f.nonFonction.toString() === selectedOption)?.nonFonction: 'Sélectionnez la fonction'}
                            </span>

                            <svg className={`ml-2 h-4 w-4 transition transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                <path strokeLinecap="round" strokeLinejoin="round"  strokeWidth="2" d={isDropdownOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}/>
                            </svg>
                        </div>
                    </div>
                </div>

                {isDropdownOpen && (
                    <div className="mt-1 absolute z-10 w-full bg-white dark:bg-form-input shadow-lg rounded border border-stroke">
                        <input type="text" placeholder="Rechercher une fonction..."
                            className="w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark dark:bg-form-input"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                        <div className="max-h-60 overflow-y-auto">
                            {filteredFonctions?.length ? (
                                filteredFonctions.map(fonction => (
                                    <div key={fonction.nonFonction} onClick={() => toggleFonctionSelection(fonction.nonFonction)} className={`cursor-pointer py-2 px-5 hover:bg-gray-100 dark:hover:bg-form-input-dark flex items-center space-x-2 ${selectedOption === fonction.fonctionId.toString() ? 'bg-gray-200 dark:bg-form-input-dark' : ''
                                        }`}
                                    >
                                        <span>{fonction.nonFonction}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-2 px-5">Aucune fonction trouvée</div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default SelectAllFonction;
