"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { deleteUser, getAllUsersService2, updateUsersRoles } from '../../services/UsersService';
import { User } from '../../interfaces/Global';
import ActionModal from '../Modal/ActionModal';
import AddLeaveModal from '../Modal/AddLeaveModal';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import DataNotFound from '../error/DataNotFound';
import Pagination from '../Pagination/Pagination';
import { useRouter } from 'next/navigation';
import NoteFound from '../error/NoteFound';

const PAGE_SIZE = 8; // Nombre de trajets par page

const Comptes: React.FC = () => {

    const router = useRouter();
    const navigateTo = (path: string) => {
        router.push(path);
    };


    const [response, setResponse] = useState<User[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [isModalOpenleave, setIsModalOpenleave] = useState(false);
    const [userId, setUserId] = useState(Number);
    const [leaveId, setleaveId] = useState(Number);
    const [leaveMessage, setleaveMessage] = useState('');
    const [onDeleteMessage, setOnDeleteMessage] = useState('');
    const [isdisabled, setIsdisabled] = useState(false);
    const [isShow, setIsShow] = useState(false);

    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE); // Taille de la page
    const [total, setTotal] = useState(0);

    const closeModalleave = () => {
        setIsModalOpenleave(false);
        setUserId(0);
        setleaveId(0);
    };

    const openModalleave = () => {

        setIsModalOpenleave(true);
        setleaveMessage("Formulaire de Congés");
        setOnDeleteMessage('VALIDER');
    };

    const openModalleaveEdit = (userIds: number | null,leaveIds: number | null) => {

        setIsdisabled(false);
        setIsShow(false);
        setUserId(userIds!);
        setleaveId(leaveIds!);
        setIsModalOpenleave(true);

        if(leaveIds){
            setleaveMessage("Detail du congés");
            setIsShow(true);
        }else{
            setleaveMessage("Formulaire de congés");
        }

        setOnDeleteMessage('MODIFIER');
    };
    
    const fetchAllUser = async () => {

        try {

            const token = localStorage.getItem('token');

            if (token) {

                const response = await getAllUsersService2(currentPage, pageSize);
                // setResponse(response.data);
                setResponse(response.data.users);
                setTotal(response.data.totalElements);

            } else {
                toast.error("Token introuvable dans le localStorage.");
            }

            } catch (error) {

                console.error('Erreur lors de la récupération de l\'utilisateur :', error);
                toast.error("Erreur lors de la récupération de l'utilisateur.");

            }
    };

    useEffect(() => {
        fetchAllUser();
    }, [currentPage, pageSize]);

    const handleCheckboxChange = async (userId: number, currentValue: number) => {
        const newValue = currentValue === 0 ? 1 : 0;
    
        // Appeler votre fonction pour mettre à jour l'utilisateur
        const res = await updateUsersRoles(userId, newValue);
    
        if (res.code === 200) {
            // Afficher un message de succès
            toast.success(res.messages ?? 'Message par défaut');
            localStorage.setItem('profil', res.data.profil);
            // Mettre à jour l'état des utilisateurs
            setResponse(prev =>
                prev ? prev.map(user =>
                    user.userId === userId ? { ...user, isValid: newValue } : user
                ) : null
            );
        } else {
            // Gérer les erreurs de mise à jour si nécessaire
            toast.error("Une erreur est survenue.");
        }
    };


    const openModal = (id: number) => {
        setUserId(id);
        setIsModalOpen(true);
        setModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalOpen(false);
    };

    const handleDeleteUser = async (id:number | null) => {
        console.log(`Deleting project with ID: ${id}`);
        try {
            if (id){

                const apiResponse = await deleteUser(id);
                setResponse(apiResponse);

                if (apiResponse && apiResponse.code === 200) {
                    toast.success("compte supprimé avec succès !");
                    fetchAllUser();

                } else {
                    toast.error("Erreur lors de la suppression du compte. Veuillez réessayer.");
                }
            }

        } catch (error) {
            console.error('Erreur lors de la suppression du compte :', error);
        }
        closeModal();
    };

    return (

        <>
            <Toaster position="top-right" reverseOrder={false} />



            <section className="container px-8 mx-auto bg-white">

                    <div className="border bg-white border-white px-2 mb-2">
                        <div className="flex-grow flex items-end justify-end p-2">
                            <a onClick={() => navigateTo(`/admin/configuration/news-comptes`)} className="cursor-pointer rounded-xl border text-nowrap flex items-center gap-2 bg-[#012340] py-2 px-4 font-medium text-white hover:bg-opacity-90" >
                            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path>
                            </svg>
                            AJOUTER UN UTILISATEUR
                            </a>
                        </div>
                    </div>


                    <div className="overflow-x-auto">

                    {response && response.length > 0 ? (

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-50 dark:bg-gray-800">

                                <tr>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">ID</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Noms</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Département</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Fonctions</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">E-mail</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Contacts</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Disponibilité</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Rôles</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Status</th>
                                    <th scope="col" className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Actions</th>
                                </tr>

                            </thead>

                            <tbody className=" mb-5 bg-white divide-gray-10 dark:divide-gray-700 dark:bg-gray-900">

                                    {response.map((user, index) => (

                                        <tr key={user.userId}>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">{user.userId}</div>
                                            </td>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">{user.firstname} {user.lastname} </div>
                                            </td>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    {user.departments.length > 0 ? (
                                                        user.departments.map(department => (
                                                            <div key={department.departmentId} className="text-gray-700 whitespace-nowrap">
                                                                {department.departmentName}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        'Aucun département'
                                                    )}
                                                </div>
                                            </td>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">{user.fonction} </div>
                                            </td>
                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">{user.email} </div>
                                            </td>
                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">{user.phone} </div>
                                            </td>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">

                                                    {user.leaves.length > 0 ? (
                                                        <div onClick={() => openModalleaveEdit(user.userId, user.leaves[0].leaveId)} className=" px-2.5 py-0.5  rounded-full text-white nline-flex items-center bg-red-700 gap-x-3">Indisponible</div>
                                                    ) : (
                                                        <div className=" px-2.5 py-0.5  rounded-full text-white inline-flex items-center bg-green-700 gap-x-3">Disponible</div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <span className={`text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-[#D32F2F]' :
                                                            user.role === 'GLOBAL_ADMIN' ? 'bg-[#F57C00]' :
                                                                user.role === 'USER' ? 'bg-[#033F73]' :
                                                                    user.role === 'MANAGER' ? 'bg-[#038C4C]' :
                                                                        'bg-gray-500'
                                                        }`}>
                                                        {user.role}
                                                    </span>

                                                </div>

                                            </td>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">
                                                    <ToggleSwitch isChecked={user.isValid === 1} onChange={() => handleCheckboxChange(user.userId, user.isValid)} />
                                                </div>
                                            </td>

                                            <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                                <div className="inline-flex items-center gap-x-3">

                                                    <a onClick={() => navigateTo(`/admin/configuration/news-comptes/${user.userId}`)} className="cursor-pointer focus:outline-none" aria-label="Icon 1">
                                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3.49878 17.7505V21.5005H7.24878L18.3088 10.4405L14.5588 6.69055L3.49878 17.7505ZM21.2088 7.54055C21.5988 7.15055 21.5988 6.52055 21.2088 6.13055L18.8688 3.79055C18.4788 3.40055 17.8488 3.40055 17.4588 3.79055L15.6288 5.62055L19.3788 9.37055L21.2088 7.54055Z" fill="#003D63" />
                                                        </svg>
                                                    </a>

                                                    <button onClick={() => openModal(user.userId)} className="cursor-pointer focus:outline-none" aria-label="Icon 2">
                                                        <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.5 16.5C1.5 17.6 2.4 18.5 3.5 18.5H11.5C12.6 18.5 13.5 17.6 13.5 16.5V4.5H1.5V16.5ZM14.5 1.5H11L10 0.5H5L4 1.5H0.5V3.5H14.5V1.5Z" fill="#C62828" />
                                                        </svg>
                                                    </button>

                                                    <button onClick={() => openModalleaveEdit(user.userId, 0)} className="cursor-pointer focus:outline-none" aria-label="Icon 3" >
                                                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                            <path d="M15.7499 2.9812H14.2874V2.36245C14.2874 2.02495 14.0062 1.71558 13.6405 1.71558C13.2749 1.71558 12.9937 1.99683 12.9937 2.36245V2.9812H4.97803V2.36245C4.97803 2.02495 4.69678 1.71558 4.33115 1.71558C3.96553 1.71558 3.68428 1.99683 3.68428 2.36245V2.9812H2.2499C1.29365 2.9812 0.478027 3.7687 0.478027 4.75308V14.5406C0.478027 15.4968 1.26553 16.3125 2.2499 16.3125H15.7499C16.7062 16.3125 17.5218 15.525 17.5218 14.5406V4.72495C17.5218 3.7687 16.7062 2.9812 15.7499 2.9812ZM1.77178 8.21245H4.1624V10.9968H1.77178V8.21245ZM5.42803 8.21245H8.38115V10.9968H5.42803V8.21245ZM8.38115 12.2625V15.0187H5.42803V12.2625H8.38115ZM9.64678 12.2625H12.5999V15.0187H9.64678V12.2625ZM9.64678 10.9968V8.21245H12.5999V10.9968H9.64678ZM13.8374 8.21245H16.228V10.9968H13.8374V8.21245ZM2.2499 4.24683H3.7124V4.83745C3.7124 5.17495 3.99365 5.48433 4.35928 5.48433C4.7249 5.48433 5.00615 5.20308 5.00615 4.83745V4.24683H13.0499V4.83745C13.0499 5.17495 13.3312 5.48433 13.6968 5.48433C14.0624 5.48433 14.3437 5.20308 14.3437 4.83745V4.24683H15.7499C16.0312 4.24683 16.2562 4.47183 16.2562 4.75308V6.94683H1.77178V4.75308C1.77178 4.47183 1.96865 4.24683 2.2499 4.24683ZM1.77178 14.5125V12.2343H4.1624V14.9906H2.2499C1.96865 15.0187 1.77178 14.7937 1.77178 14.5125ZM15.7499 15.0187H13.8374V12.2625H16.228V14.5406C16.2562 14.7937 16.0312 15.0187 15.7499 15.0187Z"
                                                                fill="" />
                                                        </svg>
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))}

                            </tbody>

                        </table>

                    ) : (
                        <NoteFound />
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

            <AddLeaveModal
                userId={userId}
                leaveId={leaveId}
                isdisabled={isdisabled}
                isShow={isShow}
                buttonColor="#D32F2F"
                leaveMessage={leaveMessage}
                onDeleteMessage={onDeleteMessage} // Texte du bouton de suppression
                onCloseMessage="ANNULER" // Texte du bouton d'annulation
                idModale="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                fetchAllUser={fetchAllUser} // Fonction appelée lors de la suppression
                isOpen={isModalOpenleave} // État d'ouverture du modal
                onClose={closeModalleave} // Fonction de fermeture du modal
                />

            <ActionModal
                buttonColor="#D32F2F"
                actionMessage=" Êtes-vous sûr de vouloir supprimer ce compte ?"
                onDeleteMessage="OUI, SUPPRIMER"
                onCloseMessage="ANNULER"
                id={userId}
                onDelete={() => { handleDeleteUser(userId); }}
                isOpen={isModalOpen}
                onClose={closeModal}
            />

        </>

    );
};

export default Comptes;
