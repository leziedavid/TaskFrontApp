"use client";

import React, { useEffect, useState } from 'react';
import { getProjectUsers} from '../../services/ProjectService'
import {ProjectsDetails,User } from '../../interfaces/Global';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
interface UserListeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    id: string | null;
    onAccept: () => void;
    onDecline: () => void;
}

const UserListeModal: React.FC<UserListeModalProps> = ({isOpen,  onClose, title, id, onAccept, onDecline, }) => {

    // const [response, setResponse] = useState<ProjectsDetails | null>(null);
    const [response, setResponse] = useState<User[]>([]);

    const listesUsers = async (code: string) => {

        try {
            const apiResponse = await getProjectUsers(code);
            console.log('API Response:', apiResponse.data);

            const adaptedResponse: ProjectsDetails = {
                users: apiResponse.data,
                projects:apiResponse.data,
                tasks: []
            };
            setResponse(apiResponse.data);
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    };

    useEffect(() => {

        listesUsers(id!);
        
        }, [id]);

    return (
        <>
            {isOpen && (
                <div id="static-modal" tabIndex={-1} aria-hidden={!isOpen} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50" >
                    
                    <div className="bg-white rounded-lg shadow-lg max-w-screen-lg w-full p-6 md:p-8">
                        <div className="relative">
                            <button onClick={onClose} type="button"
                                className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
                                data-modal-hide="static-modal">
                                <svg className="w-3 h-3"
                                    aria-hidden="true"
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

                            <div className="p-4 md:p-5">
                                <h3 className="mb-5 text-2xl font-medium text-[#012340] dark:text-white">
                                    {title}
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead>
                                            <tr className="bg-gray-200 dark:bg-meta-4">
                                                <th className="py-4 px-4 font-medium text-black dark:text-white text-lg">Membres</th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white text-lg">Fonction</th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white text-lg">Email</th>
                                                <th className="py-4 px-4 font-medium text-black dark:text-white text-lg">Contact</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        {response && response.length && response.length > 0 ? (

                                        response.map((item, index) => (

                                            <tr key={index} className="bg-white border-b border-gray-900  dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="flex px-0 py-0 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    <div>
                                                        <button className="h-10 w-10 border-0 border-white dark:border-boxdark">
                                                        <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                        </button>
                                                    </div>
                                                    <div className="py-3 ml-2">
                                                        {item ? (
                                                            `${item.firstname} - ${item.lastname}`
                                                        ) : (
                                                            'Utilisateur non défini'
                                                        )}


                                                    </div>
                                                </th>
                                                <td className="px-6 py-4">
                                                {item ? item.fonction : 'Fonction non définie'}
                                                </td>
                                                <td className="px-6 py-4">
                                                {item ? item.email : 'Email non défini'}
                                                </td>
                                                <td className="px-6 py-4">
                                                {item ? item.phone : 'Téléphone non défini'}
                                                </td>

                                            </tr>

                                        ))

                                            ) : (

                                                <tr>
                                                    <td colSpan={8} className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap text-center">
                                                        Aucun utilisateur trouvé
                                                    </td>
                                                </tr>
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4.5">
                                <button onClick={onClose} className="flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90" type="button" > FERMER </button>
                            </div>

                        </div>
                    </div>

                </div>
            )}
        </>
    );
};

export default UserListeModal;
