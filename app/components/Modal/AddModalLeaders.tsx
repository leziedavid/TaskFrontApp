

import SelectDepartment from '../Select2/SelectDepartment';

import SelectUsers from '../Select2/SelectUsers';
import React, { useEffect, useState } from 'react';
import { Users } from '../../interfaces/Users';
import { UserState } from '../../interfaces/UserState';
import TableLeaderSelecte from '../tabs/TableLeaderSelecte';
import toast, { Toaster } from 'react-hot-toast';
import { assignUsersToProject} from '../../services/ProjectService';

type AddModalLeadersProps = {
    buttonColor: string;
    actionMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    id: string;
    isOpen: boolean;
    onClose: () => void;
    fetchProjectDetails: (code: string) => Promise<void>;
    codes: string | undefined; //
};

const AddModalLeaders: React.FC<AddModalLeadersProps> = ({
    buttonColor,
    actionMessage,
    onDeleteMessage,
    onCloseMessage,
    id,
    isOpen,
    onClose,
    fetchProjectDetails,
    codes,

}) => {

    const [Department, setDepartment] = useState("");
    const [Users, setUsers] =  useState<string[]>([]);
    const [Tablegenerate, setTablegenerate] = useState<Users[]>([]);
    const [DataGenerated, setDataGenerated] = useState<UserState>({usersId: [], leaderId: 0  });

    useEffect(() => {

        if (isOpen) {

            setDepartment('');
            setTablegenerate([]);
            setDataGenerated({ usersId: [], leaderId: 0 });
        }
    }, [isOpen]);

    const AddUsers = async () => {

        if (!DataGenerated) {
            toast.error("La liste de l'équipe du projet est requise.");
            return;
        }

        const formData = new FormData();
        formData.append('users', JSON.stringify(DataGenerated));

        try {

            if (codes) {

                const apiResponse = await assignUsersToProject(codes, formData);

                if(apiResponse.code===200){
                    
                    toast.success("Les utilisateur ont été ajouter a l'équipe du projet avec succès");
                    fetchProjectDetails(codes!);
                    onClose();
                }else{
                    toast.error("Erreur lors de l'assignation des utilisateurs au projet:");
                }
            
            }
            
        } catch (error) {
            console.error("Erreur lors de l'assignation des utilisateurs au projet:",);
        }

    };

    return (

        <>

            <Toaster position="top-right" reverseOrder={false} />

            {isOpen && (

                <div id={id}     tabIndex={-1} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

                    <div className="bg-white rounded-lg shadow-lg w-full md:max-w-2xl">
                        <div className="flex items-center justify-between p-5">
                            <h3 className="text-xl font-semibold text-gray-900">{actionMessage}</h3>
                            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg
                                    className="w-3 h-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>


                            <div className="p-4 md:p-5 space-y-4">


                                <div className="mb-10">
                                    <SelectDepartment setDepartment={setDepartment} departments={null} />
                                </div>

                                {Department ? (
                                    <div className="mb-5">
                                        <SelectUsers setUsers={setUsers} Department={Department} setTablegenerate={setTablegenerate} setDataGenerated={setDataGenerated} />
                                    </div>
                                ) : (
                                    <div className=""> </div>
                                )}

                                {setTablegenerate.length > 0 && <TableLeaderSelecte  setTablegenerate={setTablegenerate} Tablegenerate={Tablegenerate} setDataGenerated={setDataGenerated} />}

                            </div>

                            <div className="space-x-4 flex items-center justify-end p-5">

                                        <button onClick={() => { AddUsers();}} type="button"
                                            className="py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                            data-modal-hide="popup-modal">
                                            {onDeleteMessage}
                                        </button>

                                        <button
                                            onClick={onClose}
                                            type="button"
                                            className={`py-2.5 px-5 text-sm font-medium text-white bg-#${buttonColor} hover:bg-#${buttonColor} focus:ring-4 focus:outline-none focus:ring-${buttonColor}-300 dark:focus:ring-${buttonColor}-800 rounded-lg inline-flex items-center`}
                                            style={{ backgroundColor: `${buttonColor}` }}
                                        >
                                            {onCloseMessage}
                                        </button>

                            </div>

                    </div>

                </div>

        )}

        </>

    );
};

export default AddModalLeaders;
