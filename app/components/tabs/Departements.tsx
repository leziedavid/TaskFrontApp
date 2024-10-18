"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Department } from '../../interfaces/Global';
import { getAllDepartement } from '../../services/DepartementServices';
import DateConverter from '../DateConverter';
import AddDepModalModal from '../Modal/AddDepModal';
import DataNotFound from '../error/DataNotFound';
import Pagination from '../Pagination/Pagination';

const PAGE_SIZE = 10; // Nombre de trajets par page

const Departements: React.FC = () => {

    const [userId, setUserId] = useState<number | null>(null);

    const [response, setResponse] = useState<Department[] | null>(null);

    const [isModalOpenDep, setIsModalOpenDep] = useState(false);
    const [DepId, setDepId] = useState(Number);
    const [DepMessage, setDepMessage] = useState('');
    const [onDeleteMessage, setOnDeleteMessage] = useState('');
    const [isdisabled, setIsdisabled] = useState(false);
    const [isShow, setIsShow] = useState(false);

    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE); // Taille de la page
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const closeModalDep = () => {
        setIsModalOpenDep(false);
        setDepId(0);
    };

    const openModalDep = () => {

        setIsModalOpenDep(true);
        setDepMessage("AJOUTER UN DEPARTEMENT");
        setOnDeleteMessage('VALIDER');
    };

    const openModalDepEdit = (DepIds: number | null) => {

        setIsdisabled(false);
        setIsShow(false);
        setDepId(DepIds!);
        setIsModalOpenDep(true);
        setDepMessage("MODIFICATION");
        setOnDeleteMessage('MODIFIER');
    };


    const fetchAllDepartement = async () => {

        try {

            const token = localStorage.getItem('token');

            if (token) {

                const response = await getAllDepartement();
                setResponse(response.data);

            } else {
                toast.error("Token introuvable dans le localStorage.");
            }

            } catch (error) {

                console.error('Erreur lors de la récupération de l\'utilisateur :', error);
                toast.error("Erreur lors de la récupération de l'utilisateur.");

            }
    };

    useEffect(() => {
        fetchAllDepartement();
    }, [currentPage, pageSize]);


    return (

        <>
            <Toaster position="top-right" reverseOrder={false} />



            <section className="container px-8 mx-auto bg-white">

                    <div className="border bg-white border-white dark:border-gray-700 px-3 mb-8">
                        <div className="flex-grow flex items-end justify-end p-2">
                            <button onClick={() => openModalDep()} className="rounded-xl border text-nowrap flex items-center gap-2 bg-[#012340] py-2 px-4 font-medium text-white hover:bg-opacity-90" >
                                <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path>
                                </svg> AJOUTER UN DEPARTEMENT
                            </button>
                        </div>

                    </div>

                <div className="overflow-x-auto">

                    {response && response.length > 0 ? (

                                <div className="overflow-hidden dark:border-gray-700 mb-8">
                                    
                                    <table className="shadow-lg min-w-full ">
                                        
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">ID</th>
                                                <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Sigle</th>
                                                <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Departement</th>
                                                <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Date de cration</th>
                                                <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Deps</th>
                                            </tr>
                                        </thead>

                                        <tbody className=" mb-5 bg-white divide-gray-10 dark:divide-gray-700 dark:bg-gray-900">

                                            {response && response.length > 0 ? (

                                                response.map((departement, index) => (

                                                    <tr key={departement.departmentId}>

                                                        <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                            <div className="inline-flex items-center gap-x-3">{departement.departmentId}</div>
                                                        </td>
                                                        <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                            <div className="inline-flex items-center gap-x-3">{departement.departmentSigle}</div>
                                                        </td>

                                                        <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                            <div className="inline-flex items-center gap-x-3">{departement.departmentName}</div>
                                                        </td>

                                                        <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                            <div className="inline-flex items-center gap-x-3">  <DateConverter dateStr={departement.departmentCreatedAt} /></div>
                                                        </td>

                                                        <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                            <div className="inline-flex items-center gap-x-3">


                                                            <button onClick={() => openModalDepEdit(departement.departmentId)} className="focus:outline-none" aria-label="Icon 1">
                                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M3.49878 17.7505V21.5005H7.24878L18.3088 10.4405L14.5588 6.69055L3.49878 17.7505ZM21.2088 7.54055C21.5988 7.15055 21.5988 6.52055 21.2088 6.13055L18.8688 3.79055C18.4788 3.40055 17.8488 3.40055 17.4588 3.79055L15.6288 5.62055L19.3788 9.37055L21.2088 7.54055Z" fill="#003D63" />
                                                                </svg>
                                                            </button>
                                                            <button className="focus:outline-none" aria-label="Icon 2">
                                                                <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M1.5 16.5C1.5 17.6 2.4 18.5 3.5 18.5H11.5C12.6 18.5 13.5 17.6 13.5 16.5V4.5H1.5V16.5ZM14.5 1.5H11L10 0.5H5L4 1.5H0.5V3.5H14.5V1.5Z" fill="#C62828" />
                                                                </svg>
                                                            </button>

                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))
                                                

                                            ) : (
                                                <DataNotFound />
                                            )}

                                        </tbody>

                                    </table>
                                </div>

                        ) : (
                            <DataNotFound />
                        )}

                </div>

                    {response && response.length ? (
                        <Pagination
                            currentPage={currentPage}
                            pageSize={pageSize}
                            total={total || 0}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                        />

                    ) : null}

            </section>

            <AddDepModalModal
                departmentId={DepId}
                isdisabled={isdisabled}
                isShow={isShow}
                buttonColor="#D32F2F"
                DepMessage={DepMessage}
                onDeleteMessage={onDeleteMessage} // Texte du bouton de suppression
                onCloseMessage="ANNULER" // Texte du bouton d'annulation
                idModale="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                fetchAllDepartement={fetchAllDepartement} // Fonction appelée lors de la suppression
                isOpen={isModalOpenDep} // État d'ouverture du modal
                onClose={closeModalDep} // Fonction de fermeture du modal
                codes={undefined}
                />

        </>

    );
};

export default Departements;
