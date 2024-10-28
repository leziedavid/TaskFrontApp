"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import DateConverter from '../DateConverter';
import ActionModal from '../Modal/ActionModal';
import ValidateModal from '../Modal/ValidateModal';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';


// services
import { Task,UserProject } from '../../interfaces/Global';
import { formatDate } from '../../services/DateUtils';
import { changeTaskPriority, changeTaskState, deleteTask, validteTaskState } from '../../services/TaskService';
import AddTaskAlerteModal from '../Modal/AddTaskAlerteModal';
import { getUserIdFromToken } from '../../services/ApiService';
import NoteFound from '../error/NoteFound';

interface TaskCardProps {
    tasksEnCours : Task[];
    tasksEnAttente: Task[];
    tasksTermines: Task[];
    fetchProjectDetails: (code: string) => Promise<void>;
    getTaskByProjectId: (code: string) => Promise<void>;
    id: string | undefined;
    UserListe: UserProject[];
}

const TaskCard: React.FC<TaskCardProps> = ({ tasksEnCours,tasksEnAttente,tasksTermines,fetchProjectDetails,getTaskByProjectId,id,UserListe}) => {

    const router = useRouter();
    const navigateTo = (path: string) => {
        router.push(path);
    };

    const [isOpenFiltre, setIsOpenFiltre] = useState(false);
    const [StateSelecte, setStateSelecte] = useState<string>('');
    const [selectedColors, setSelectedColors] = useState<string>('');
    const [authorisation, setAuthorisation] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState(0); // État pour suivre la tâche sélectionnée
    const [stepsValue, setStepsValue] = useState(0); // État pour suivre la tâche sélectionnée


    useEffect(() => {
        const auth = localStorage.getItem('authorisation');
        setAuthorisation(auth);
    }, []);

    const [currentPageEnCours, setCurrentPageEnCours] = useState(1);
    const [itemsPerPageEnCours, setItemsPerPageEnCours] = useState(3); // Nombre d'éléments par page

    const [currentPageEnAttente, setCurrentPageEnAttente] = useState(1);
    const [itemsPerPageEnAttente, setItemsPerPageEnAttente] = useState(3); // Nombre d'éléments par page

    const [currentPageTermines, setCurrentPageTermines] = useState(1);
    const [itemsPerPageTermines, setItemsPerPageTermines] = useState(3); // Nombre d'éléments par page

    // Option pour le modal :
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenAlert, setIsModalOpenAlert] = useState(false);
    const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);

    const [idtaches, setId] = useState<number | null>(null);

    const [actionMessage, setActionMessage] = useState<string>('');
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [dates, setDates] = useState<string>('');
    const [position, setPosition] = useState<number | null>(null);
    const [otherUser, setOtherUser] = useState(Number);
    const [isUser, setIsUser] = useState(Number);
    

    // Gestion des Status et des priorité sur la page de detail

    // Premier menu
    const [openTaskId, setTaskId] = useState<number | null>(null);
    const [idTask, setIdTask] = useState<number | null>(null);

    const toggleDropdown = (taskId: number) => {
        setTaskId(openTaskId === taskId ? null : taskId);
        setopenActionTaskId(0);
        setOpenPropriete(0);
    };

    // deuxieme menu
    const [openActionTaskId, setopenActionTaskId] = useState<number | null>(null);
    const toggleDropdownActions = (taskId: number) => {

        setopenActionTaskId(openActionTaskId === taskId ? null : taskId);
        setTaskId(0);
        setOpenPropriete(0);
        
    };

    // Troisieme menu
    const [openPropriete, setOpenPropriete] = useState<number | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string>('');

    const priorities = ['MOYENNE', 'FAIBLE', 'ELEVEE'];

    const toggleDropdownPropriete = (taskId: number) => {
        setOpenPropriete(openPropriete === taskId ? null : taskId);
        setTaskId(0);
        setopenActionTaskId(0);
    };

    const openModal = (id: number) => {
        setId(id);
        setActionMessage("Voulez-vous vraiment supprimer cette tâche  ?");
        setIsModalOpen(true);
    };

    const openValidateModal = (id: number, steps:number,status:string,colors:string) => {
        
        setStepsValue(steps);
        setStateSelecte(status);
        setSelectedColors(colors);
        setId(id);
        setPosition(steps);
        if(steps==1){
            setActionMessage("Voulez-vous vraiment mettre en attente cette tâche  ?");
            setDeleteMessage('OUI,VALIDER');
        }else if(steps==2){
            setActionMessage("Voulez-vous vraiment démarrer cette tâche  ?");
            setDeleteMessage('OUI,DEMARRER');
        }else if(steps==3){
            setActionMessage("Êtes-vous vraiment sûr(e) d'avoir terminé cette tâche ?");
            setDeleteMessage('OUI,TERMINER');
        }else if(steps==4){
            setActionMessage("Êtes-vous vraiment sûr(e) d'avoir testé cette tâche ?");
            setDeleteMessage('OUI,VALIDER');
        }else if(steps==5){
            setActionMessage("Êtes-vous vraiment sûr(e) de rejeter cette tâche ?");
            setDeleteMessage('OUI,REJETER');
        }
        setIsValidateModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsValidateModalOpen(false);
        setopenActionTaskId(0);
        setOpenPropriete(0);
    };

    const handleDeleteTask = async (Taskid:number | null) => {
        try {
            if(Taskid){

                const apiResponse = await deleteTask(Taskid);
                if (apiResponse && apiResponse.code === 200) {
                    if(id){
                        toast.success("Tâche supprimée avec succès !");
                        fetchProjectDetails(id);
                        getTaskByProjectId(id);
                    }
                } else {
                    toast.error("Erreur lors de la suppression de la tâche. Veuillez réessayer");
                }
            }
        } catch (error) {
            
            toast.error("Erreur lors de la connexion. Veuillez réessayer.");
        }
        closeModal();
    };

    const initchangeTaskState = async (TaskId: number| null, actions: number | null) => {

        try {

            if (TaskId) {

                if(StateSelecte==="1"){
                    const apiResponse = await validteTaskState(TaskId, StateSelecte, selectedColors,id);

                    if (apiResponse && apiResponse.code === 200) {
                        if (id) {
                            toast.success("Le statut et la couleur de la tâche ont été mis à jour avec succès !");
                            fetchProjectDetails(id);
                            getTaskByProjectId(id);
                            setOpenPropriete(0);
                            setopenActionTaskId(0);
                        }

                        if (apiResponse && apiResponse.code === 400) {
                            toast.error("Erreur lors de la mise à jour de du status. Veuillez réessayer");
                            if (id) {
                                toast.success(apiResponse.code);
                                fetchProjectDetails(id);
                                getTaskByProjectId(id);
                                setOpenPropriete(0);
                                setopenActionTaskId(0);
                            }
                        }
    
                    } else {
    
                    }
                }else{
                    const apiResponse = await changeTaskState(TaskId, StateSelecte, selectedColors,id,stepsValue);

                    if (apiResponse && apiResponse.code === 200) {
                        if (id) {
                            toast.success("Le statut et la couleur de la tâche ont été mis à jour avec succès !");
                            fetchProjectDetails(id);
                            getTaskByProjectId(id);
                            setOpenPropriete(0);
                            setopenActionTaskId(0);
                        }
    
                    }
                    if (apiResponse && apiResponse.code === 400) {
                        toast.error("Erreur lors de la mise à jour de du status. Veuillez réessayer");

                        if (id) {
                            toast.success(apiResponse.code);
                            fetchProjectDetails(id);
                            getTaskByProjectId(id);
                            setOpenPropriete(0);
                            setopenActionTaskId(0);
                        }
    
                    } else {
    
                    }
                }

            }

        } catch (error) {
            toast.error("Toutes les actions associées doivent avoir un statut terminer");
        }
    
    };

    const openModalAlerte = (idTask: number,dates:string) => {

        setopenActionTaskId(0);
        setOpenPropriete(0);
        setIdTask(idTask);
        setDates(dates);
        setIsModalOpenAlert(true);

    };

    const closeModalAlert = () => {
        setIsModalOpenAlert(false);
        setopenActionTaskId(0);
        setOpenPropriete(0);
    };

    // changer de priorité

    const OnSelectedPriority = (idTask: number,priority :string) => {
        setIdTask(idTask);
        setSelectedPriority(priority);
    };
    const changeProjectPriority = async () => {

        if (selectedPriority === "ELEVEE") {
            setSelectedColors('#033F73');
        }

        if (selectedPriority === "MOYENNE") {
            setSelectedColors('#F27F1B');

        }
        
        if (selectedPriority === "FAIBLE") {
            setSelectedColors('#F27F1B');
        }

        try {

            if (idTask){

                const apiResponse = await changeTaskPriority(idTask,selectedPriority,selectedColors);

                if (apiResponse && apiResponse.code === 200) {
                    toast.success("Priorité mise à jour avec succès !");
                    fetchProjectDetails(id!);
                    getTaskByProjectId(id!);

                } else {
                    
                    toast.error("Erreur lors de la mise à jour de la priorité. Veuillez réessayer");
                }
            }

        } catch (error) {
            console.error('Erreur lors de la mise à jour de la priorité :', error);
            toast.error("Erreur lors de la mise à jour de la priorité. Veuillez vérifier votre connexion.");
        }

    };

    useEffect(() => {
        if (selectedPriority) {
            changeProjectPriority();
        }

    }, [selectedPriority]);

    useEffect(() => {
    }, [currentPageEnCours, currentPageEnAttente, currentPageTermines]);
    
    const getPaginatedData = (tasks: Task[], currentPage: number, itemsPerPage: number): Task[] => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return tasks.slice(startIndex, endIndex);
    };

    const paginatedTasksEnCours = getPaginatedData(tasksEnCours, currentPageEnCours, itemsPerPageEnCours);
    const paginatedTasksEnAttente = getPaginatedData(tasksEnAttente, currentPageEnAttente, itemsPerPageEnAttente);
    const paginatedTasksTermines = getPaginatedData(tasksTermines, currentPageTermines, itemsPerPageTermines);

    const handlePageChangeEnCours = (page: number) => {
        setCurrentPageEnCours(page);
    };
    
    const handlePageChangeEnAttente = (page: number) => {
        setCurrentPageEnAttente(page);
    };
    
    const handlePageChangeTermines = (page: number) => {
        setCurrentPageTermines(page);
    };

    const fetchUserId = async () => {

        try {

            const token = localStorage.getItem('token');
            if (token) {
                const response = await getUserIdFromToken(token);
                if (response.code === 200 && response.data) {

                    setIsUser(response.data);

                } else {
                    toast.error("Erreur lors de la récupération de l'ID utilisateur.");
                }
            } else {

                toast.error("Token introuvable dans le localStorage.");
            }
        } catch (error) {

            console.error('Erreur lors de la récupération de l\'ID utilisateur :', error);
            toast.error("Erreur lors de la récupération de l'ID utilisateur.");

        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);
    

    const foundUser = UserListe.find(user => user.user.userId === isUser);
    const isUserInList = foundUser !== undefined;
    const foundUserId = foundUser ? foundUser.user.userId : undefined;

    console.log(foundUserId);
        // Effet pour définir la première tâche valide comme sélectionnée
        useEffect(() => {
            const firstValidTask = paginatedTasksTermines.find(task => task.isValides === 0);
            if (firstValidTask) {
                setSelectedTaskId(firstValidTask.projectId);
            }
        }, [paginatedTasksTermines]);

    return (

        <>

            <div className="space-x-0 lg:grid lg:grid-cols-3 gap-3 xl:gap-4 lg:space-y-0">

                {/* Premier Card */}

                    <div>
                        <div className="mb-10  relative flex flex-col p-2 mx-auto max-w-lg h-[40rem]  text-gray-900 bg-[#EBF1FA] rounded-lg  border-gray-100 shadow dark:border-gray-600  dark:bg-gray-800 dark:text-white">

                            <div className="mb-5 flex justify-between">

                                <div className="flex items-center">
                                    <h3 className="text-lg text-black font-bold">En cours</h3>
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white ml-2">
                                        <span className="text-sm font-medium text-black">{tasksEnCours.length}</span>
                                    </div>
                                </div>
                            </div>

                                {paginatedTasksEnCours.length > 0 ? (
                                    
                                <div className='flex flex-col'>

                                    {paginatedTasksEnCours.map((task, index) => (

                                        <div key={task.taskId} className='mb-3 p-3 bg-white rounded-md space-y-4'>

                                            <div className='flex justify-between cursor-pointer hover:underline'>

                                                <div onClick={() => {
                                                    localStorage.setItem('selectedProjectCode', id!); // Ajoute taskCode au localStorage
                                                    navigateTo(`/admin/tache/${task.taskCode}`); // Navigue vers la page
                                                }}>
                                                    <a className='cursor-pointer hover:underline' onClick={() => navigateTo(`/admin/tache/${task.taskCode}`)} >
                                                        <h3 className="cursor-pointer hover:underline text-sm font-semibold">{task.taskName}</h3>
                                                    </a>
                                                </div>

                                                <div>

                                                    <div className="relative inline-block text-left">

                                                    {isUserInList && isUser &&  foundUserId == isUser || authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN'? (
                                                        <button onClick={() => toggleDropdown(task.taskId)} type="button" className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900  rounded-lg" aria-haspopup="true" aria-expanded={openTaskId === task.taskId ? 'true' : 'false'} style={{ position: 'relative' }}>

                                                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.5 10C5.4 10 4.5 10.9 4.5 12C4.5 13.1 5.4 14 6.5 14C7.6 14 8.5 13.1 8.5 12C8.5 10.9 7.6 10 6.5 10ZM18.5 10C17.4 10 16.5 10.9 16.5 12C16.5 13.1 17.4 14 18.5 14C19.6 14 20.5 13.1 20.5 12C20.5 10.9 19.6 10 18.5 10ZM12.5 10C11.4 10 10.5 10.9 10.5 12C10.5 13.1 11.4 14 12.5 14C13.6 14 14.5 13.1 14.5 12C14.5 10.9 13.6 10 12.5 10Z" fill="black" fillOpacity="0.56" />
                                                            </svg>

                                                        </button>
                                                    ) : null}

                                                        {openTaskId === task.taskId && (
                                                            <div className={`z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'right-full top-0' : 'right-full top-0'} mt-2 w-40 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                                role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton" style={{ position: 'absolute' }}>

                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                                
                                                                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                                        <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                            <a onClick={() => navigateTo(`/admin/tache/edit-tache/${task.taskId}`)} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                                <span>
                                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M12.6666 13.3336H3.33329C3.15648 13.3336 2.98691 13.4038 2.86188 13.5288C2.73686 13.6538 2.66662 13.8234 2.66662 14.0002C2.66662 14.177 2.73686 14.3466 2.86188 14.4716C2.98691 14.5967 3.15648 14.6669 3.33329 14.6669H12.6666C12.8434 14.6669 13.013 14.5967 13.138 14.4716C13.263 14.3466 13.3333 14.177 13.3333 14.0002C13.3333 13.8234 13.263 13.6538 13.138 13.5288C13.013 13.4038 12.8434 13.3336 12.6666 13.3336ZM3.33329 12.0002H3.39329L6.17329 11.7469C6.47782 11.7166 6.76264 11.5824 6.97995 11.3669L12.98 5.3669C13.2128 5.12088 13.3387 4.79257 13.3299 4.45392C13.3212 4.11527 13.1786 3.7939 12.9333 3.56023L11.1066 1.73356C10.8682 1.50963 10.5558 1.38114 10.2288 1.37253C9.90187 1.36393 9.58314 1.47581 9.33329 1.6869L3.33329 7.6869C3.1178 7.90421 2.98362 8.18903 2.95329 8.49356L2.66662 11.2736C2.65764 11.3712 2.67031 11.4696 2.70373 11.5618C2.73715 11.654 2.79049 11.7377 2.85995 11.8069C2.92225 11.8687 2.99612 11.9176 3.07735 11.9507C3.15857 11.9839 3.24555 12.0007 3.33329 12.0002ZM10.18 2.6669L12 4.4869L10.6666 5.7869L8.87995 4.00023L10.18 2.6669Z" fill="#033F73" />
                                                                                    </svg>

                                                                                </span>
                                                                                <span> Modifier </span>
                                                                            </a>
                                                                        </li>
                                                                    ) : null}

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a href="#" className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M5.33337 14V12.6667H2.66671C2.30004 12.6667 1.98626 12.5362 1.72537 12.2753C1.46449 12.0144 1.33382 11.7004 1.33337 11.3333V3.33333C1.33337 2.96667 1.46404 2.65289 1.72537 2.392C1.98671 2.13111 2.30049 2.00044 2.66671 2H13.3334C13.7 2 14.014 2.13067 14.2754 2.392C14.5367 2.65333 14.6672 2.96711 14.6667 3.33333V11.3333C14.6667 11.7 14.5363 12.014 14.2754 12.2753C14.0145 12.5367 13.7005 12.6671 13.3334 12.6667H10.6667V14H5.33337ZM2.66671 11.3333H13.3334V3.33333H2.66671V11.3333Z" fill="#F27F1B"/>
                                                                            </svg>

                                                                            </span>
                                                                            <span> Observations </span>
                                                                        </a>
                                                                    </li>

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a href="#" className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill-rule="evenodd" clipRule="evenodd" d="M8.88894 0C9.00682 0 9.11986 0.0468253 9.20321 0.130175C9.28656 0.213524 9.33339 0.32657 9.33339 0.444444V1.77778C9.33339 1.89565 9.38021 2.0087 9.46356 2.09205C9.54691 2.1754 9.65996 2.22222 9.77783 2.22222C9.89571 2.22222 10.0088 2.1754 10.0921 2.09205C10.1755 2.0087 10.2223 1.89565 10.2223 1.77778V0.888889H10.6667C11.0203 0.888889 11.3595 1.02936 11.6095 1.27941C11.8596 1.52946 12.0001 1.8686 12.0001 2.22222V12.8889C12.0001 13.2425 11.8596 13.5816 11.6095 13.8317C11.3595 14.0817 11.0203 14.2222 10.6667 14.2222H3.11117C2.75754 14.2222 2.4184 14.0817 2.16836 13.8317C1.91831 13.5816 1.77783 13.2425 1.77783 12.8889V2.22222C1.77783 1.8686 1.91831 1.52946 2.16836 1.27941C2.4184 1.02936 2.75754 0.888889 3.11117 0.888889H4.00005V0.444444C4.00005 0.32657 4.04688 0.213524 4.13023 0.130175C4.21358 0.0468253 4.32662 0 4.4445 0C4.56237 0 4.67542 0.0468253 4.75877 0.130175C4.84212 0.213524 4.88894 0.32657 4.88894 0.444444V1.77778C4.88894 1.89565 4.93577 2.0087 5.01912 2.09205C5.10247 2.1754 5.21551 2.22222 5.33339 2.22222C5.45126 2.22222 5.56431 2.1754 5.64766 2.09205C5.73101 2.0087 5.77783 1.89565 5.77783 1.77778V0.888889H8.4445V0.444444C8.4445 0.32657 8.49132 0.213524 8.57467 0.130175C8.65802 0.0468253 8.77107 0 8.88894 0ZM4.00005 5.33333C3.88218 5.33333 3.76913 5.38016 3.68578 5.46351C3.60244 5.54686 3.55561 5.6599 3.55561 5.77778C3.55561 5.89565 3.60244 6.0087 3.68578 6.09205C3.76913 6.1754 3.88218 6.22222 4.00005 6.22222H9.77783C9.89571 6.22222 10.0088 6.1754 10.0921 6.09205C10.1755 6.0087 10.2223 5.89565 10.2223 5.77778C10.2223 5.6599 10.1755 5.54686 10.0921 5.46351C10.0088 5.38016 9.89571 5.33333 9.77783 5.33333H4.00005ZM3.55561 8C3.55561 7.88213 3.60244 7.76908 3.68578 7.68573C3.76913 7.60238 3.88218 7.55556 4.00005 7.55556H7.11117C7.22904 7.55556 7.34209 7.60238 7.42544 7.68573C7.50878 7.76908 7.55561 7.88213 7.55561 8C7.55561 8.11787 7.50878 8.23092 7.42544 8.31427C7.34209 8.39762 7.22904 8.44444 7.11117 8.44444H4.00005C3.88218 8.44444 3.76913 8.39762 3.68578 8.31427C3.60244 8.23092 3.55561 8.11787 3.55561 8ZM4.00005 9.77778C3.88218 9.77778 3.76913 9.8246 3.68578 9.90795C3.60244 9.9913 3.55561 10.1043 3.55561 10.2222C3.55561 10.3401 3.60244 10.4531 3.68578 10.5365C3.76913 10.6198 3.88218 10.6667 4.00005 10.6667H8.88894C9.00682 10.6667 9.11986 10.6198 9.20321 10.5365C9.28656 10.4531 9.33339 10.3401 9.33339 10.2222C9.33339 10.1043 9.28656 9.9913 9.20321 9.90795C9.11986 9.8246 9.00682 9.77778 8.88894 9.77778H4.00005Z" fill="#012340"/>
                                                                                <path d="M3.11111 16.0001C2.28599 16.0001 1.49467 15.6723 0.911224 15.0888C0.327777 14.5054 0 13.7141 0 12.8889V1.77783H0.888889V12.8889C0.888889 13.4783 1.12302 14.0435 1.53976 14.4603C1.95651 14.877 2.52174 15.1112 3.11111 15.1112H10.6667V16.0001H3.11111ZM13.3333 3.11117C13.3333 2.75754 13.4738 2.4184 13.7239 2.16836C13.9739 1.91831 14.313 1.77783 14.6667 1.77783C15.0203 1.77783 15.3594 1.91831 15.6095 2.16836C15.8595 2.4184 16 2.75754 16 3.11117V4.4445H13.3333V3.11117ZM13.3333 12.0001V5.33339H16V12.0001L14.6667 13.7778L13.3333 12.0001Z" fill="#012340"/>
                                                                            </svg>

                                                                            </span>
                                                                            <span> Actions</span>
                                                                        </a>
                                                                    </li>

                                                                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (

                                                                        <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                            <a onClick={() => openModal(task.taskId)} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">

                                                                                <span>
                                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M4.00004 12.6667C4.00004 13.4 4.60004 14 5.33337 14H10.6667C11.4 14 12 13.4 12 12.6667V4.66667H4.00004V12.6667ZM12.6667 2.66667H10.3334L9.66671 2H6.33337L5.66671 2.66667H3.33337V4H12.6667V2.66667Z" fill="#C62828" />
                                                                                    </svg>
                                                                                </span>
                                                                                <span> Supprimer </span>
                                                                            </a>
                                                                        </li>
                                                                    ) : null}

                                                                </ul>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex justify-between'>

                                                <div>

                                                    <button className="h-8 w-8 border-0 border-white dark:border-boxdark">
                                                        <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                    </button>

                                                </div>

                                                <div>

                                                    <input onClick={() => toggleDropdownActions(task.taskId)} id="green-radio" type="radio" value="" name="colored-radio" className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="green-radio" className="font-medium text-gray-900 dark:text-gray-300"> </label>

                                                    <div className="relative inline-block text-left">

                                                        {openActionTaskId === task.taskId && (
                                                            <div className={`z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'right-full top-0' : 'right-full top-0'} mt-2 w-40 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                                role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton" style={{ position: 'absolute' }}>

                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a onClick={() => openValidateModal(task.taskId,1,'EN_ATTENTE','#F27F1B')}  className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                                                                            <span>
                                                                                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M7.47803 5H6.47803V11H7.47803V5ZM10.478 5H9.47803V11H10.478V5Z" fill="black" fillOpacity="0.6" />
                                                                                    <path d="M8.47803 2C9.66472 2 10.8248 2.35189 11.8115 3.01118C12.7981 3.67047 13.5672 4.60754 14.0213 5.7039C14.4754 6.80026 14.5943 8.00666 14.3627 9.17054C14.1312 10.3344 13.5598 11.4035 12.7207 12.2426C11.8816 13.0818 10.8125 13.6532 9.64857 13.8847C8.48469 14.1162 7.27829 13.9974 6.18193 13.5433C5.08557 13.0892 4.1485 12.3201 3.48921 11.3334C2.82992 10.3467 2.47803 9.18669 2.47803 8C2.47803 6.4087 3.11017 4.88258 4.23539 3.75736C5.36061 2.63214 6.88673 2 8.47803 2ZM8.47803 1C7.09356 1 5.74018 1.41054 4.58904 2.17971C3.43789 2.94888 2.54069 4.04213 2.01087 5.32122C1.48106 6.6003 1.34244 8.00776 1.61253 9.36563C1.88263 10.7235 2.54932 11.9708 3.52828 12.9497C4.50725 13.9287 5.75453 14.5954 7.1124 14.8655C8.47027 15.1356 9.87773 14.997 11.1568 14.4672C12.4359 13.9373 13.5291 13.0401 14.2983 11.889C15.0675 10.7378 15.478 9.38447 15.478 8C15.478 6.14348 14.7405 4.36301 13.4278 3.05025C12.115 1.7375 10.3345 1 8.47803 1Z" fill="black" fillOpacity="0.6" />
                                                                                </svg>
                                                                            </span>
                                                                            <span> EN ATTENTE </span>
                                                                        </a>
                                                                    </li>

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a onClick={() => openValidateModal(task.taskId,3,'TERMINER','#012340')} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                                                                            <span>
                                                                                <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M7.62516 13.6673C3.94316 13.6673 0.958496 10.6827 0.958496 7.00065C0.958496 3.31865 3.94316 0.333984 7.62516 0.333984C11.3072 0.333984 14.2918 3.31865 14.2918 7.00065C14.2918 10.6827 11.3072 13.6673 7.62516 13.6673ZM6.9605 9.66732L11.6738 4.95332L10.7318 4.01065L6.9605 7.78198L5.0745 5.89598L4.13183 6.83865L6.9605 9.66732Z" fill="#F27F1B" />
                                                                                </svg>
                                                                            </span>
                                                                            <span> TERMINE </span>
                                                                        </a>
                                                                    </li>

                                                                </ul>

                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex justify-between items-center space-x-2'>

                                                <div className="flex items-center gap-2">

                                                        <svg width="18" height="18" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                                            <path d="M9 6H6.5V8.5H9V6ZM8.5 0.5V1.5H4.5V0.5H3.5V1.5H3C2.445 1.5 2.005 1.95 2.005 2.5L2 9.5C2 10.05 2.445 10.5 3 10.5H10C10.55 10.5 11 10.05 11 9.5V2.5C11 1.95 10.55 1.5 10 1.5H9.5V0.5H8.5ZM10 9.5H3V4H10V9.5Z" fill="black" fillOpacity="0.56" />
                                                        </svg>


                                                        <div className="text-[9px] font-semibold">
                                                            {<DateConverter dateStr={task.taskStartDate} />} - {task.taskNombreHeurs} h
                                                        </div>

                                                            { task.alerteDate && task.alerteDate.length > 0 ? (
                                                                <span  className=" cursor-pointer bg-white text-[#F27F1B] text-xs font-medium px-1 py-0 border border-[#F27F1B]  rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center space-x-1">
                                                                    <svg width="12" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M2.37159 2.88649C2.44702 2.88649 2.5023 2.87642 2.57259 2.82114L4.25495 1.55042C4.34045 1.49042 4.38566 1.40985 4.38566 1.32456C4.38566 1.21914 4.3353 1.13385 4.25002 1.05328C4.0593 0.882493 3.71752 0.787136 3.41645 0.787136C3.23079 0.785998 3.04675 0.821724 2.875 0.892242C2.70325 0.96276 2.5472 1.06667 2.41591 1.19794C2.28461 1.32922 2.18068 1.48525 2.11014 1.65699C2.03959 1.82873 2.00384 2.01276 2.00495 2.19842C2.00495 2.38421 2.03516 2.56999 2.0853 2.68549C2.14059 2.81106 2.25116 2.88649 2.37159 2.88649ZM10.6233 2.88649C10.7489 2.88649 10.8494 2.80614 10.9096 2.68549C10.9649 2.57514 10.9949 2.38421 10.9949 2.19842C10.9949 1.41499 10.367 0.787136 9.57866 0.787136C9.2823 0.787136 8.94095 0.882493 8.75002 1.05328C8.66452 1.13364 8.61438 1.21914 8.61438 1.32456C8.61438 1.40985 8.65959 1.49021 8.73995 1.55042L10.4225 2.82114C10.4928 2.87642 10.5481 2.88649 10.6233 2.88649ZM2.29616 11.0579C2.3326 11.095 2.37617 11.1245 2.42426 11.1445C2.47235 11.1644 2.52398 11.1744 2.57604 11.174C2.62811 11.1735 2.67954 11.1625 2.72726 11.1417C2.77497 11.1208 2.81799 11.0906 2.85373 11.0527L3.64723 10.2641C4.47304 10.8747 5.47303 11.204 6.50002 11.2036C7.56973 11.2036 8.55416 10.8521 9.35259 10.2646L10.1463 11.0531C10.3019 11.2139 10.5481 11.2139 10.6987 11.0581C10.8444 10.9124 10.8494 10.6664 10.6936 10.5155L9.9303 9.75714C10.8107 8.86264 11.3032 7.65734 11.3013 6.40228C11.3013 3.75028 9.1518 1.59564 6.50002 1.59564C3.84823 1.59564 1.69873 3.75028 1.69873 6.40206C1.69732 7.65607 2.1878 8.8606 3.0648 9.75692L2.3013 10.5155C2.15066 10.6661 2.15066 10.9119 2.29638 11.0576M6.50002 10.3447C4.3203 10.3447 2.55245 8.58178 2.55245 6.40206C2.55245 4.22749 4.3203 2.45964 6.50002 2.45964C8.67459 2.45964 10.4375 4.22749 10.4375 6.40206C10.4375 8.58178 8.67459 10.3447 6.50002 10.3447ZM4.21488 6.95471H6.49488C6.69095 6.95471 6.84652 6.80385 6.84652 6.60799V3.56449C6.8468 3.51826 6.83791 3.47244 6.82035 3.42967C6.80279 3.38691 6.77691 3.34805 6.74422 3.31536C6.71153 3.28267 6.67268 3.2568 6.62991 3.23924C6.58715 3.22168 6.54132 3.21278 6.49509 3.21306C6.29902 3.21306 6.14838 3.36864 6.14838 3.56449V6.25635H4.21488C4.01388 6.25635 3.86345 6.41214 3.86345 6.60778C3.86345 6.80385 4.01388 6.95471 4.21488 6.95471Z" fill="#F27F1B" fillOpacity="0.6" />
                                                                    </svg>
                                                                    <p onClick={() => openModalAlerte(task.taskId,task.alerteDate)}  className="text-[10px] whitespace-nowrap mb-0 cursor-pointer"> {formatDate(task.alerteDate)} </p>
                                                                    {/* lun 30 mai 12h00 */}
                                                                </span>

                                                            ) : (
                                                                <span onClick={() => openModalAlerte(task.taskId,'')} className=" cursor-pointer bg-white text-black text-xs font-medium px-1 py-0  rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center space-x-1">
                                                                    <svg width="12" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M2.37159 2.88649C2.44702 2.88649 2.5023 2.87642 2.57259 2.82114L4.25495 1.55042C4.34045 1.49042 4.38566 1.40985 4.38566 1.32456C4.38566 1.21914 4.3353 1.13385 4.25002 1.05328C4.0593 0.882493 3.71752 0.787136 3.41645 0.787136C3.23079 0.785998 3.04675 0.821724 2.875 0.892242C2.70325 0.96276 2.5472 1.06667 2.41591 1.19794C2.28461 1.32922 2.18068 1.48525 2.11014 1.65699C2.03959 1.82873 2.00384 2.01276 2.00495 2.19842C2.00495 2.38421 2.03516 2.56999 2.0853 2.68549C2.14059 2.81106 2.25116 2.88649 2.37159 2.88649ZM10.6233 2.88649C10.7489 2.88649 10.8494 2.80614 10.9096 2.68549C10.9649 2.57514 10.9949 2.38421 10.9949 2.19842C10.9949 1.41499 10.367 0.787136 9.57866 0.787136C9.2823 0.787136 8.94095 0.882493 8.75002 1.05328C8.66452 1.13364 8.61438 1.21914 8.61438 1.32456C8.61438 1.40985 8.65959 1.49021 8.73995 1.55042L10.4225 2.82114C10.4928 2.87642 10.5481 2.88649 10.6233 2.88649ZM2.29616 11.0579C2.3326 11.095 2.37617 11.1245 2.42426 11.1445C2.47235 11.1644 2.52398 11.1744 2.57604 11.174C2.62811 11.1735 2.67954 11.1625 2.72726 11.1417C2.77497 11.1208 2.81799 11.0906 2.85373 11.0527L3.64723 10.2641C4.47304 10.8747 5.47303 11.204 6.50002 11.2036C7.56973 11.2036 8.55416 10.8521 9.35259 10.2646L10.1463 11.0531C10.3019 11.2139 10.5481 11.2139 10.6987 11.0581C10.8444 10.9124 10.8494 10.6664 10.6936 10.5155L9.9303 9.75714C10.8107 8.86264 11.3032 7.65734 11.3013 6.40228C11.3013 3.75028 9.1518 1.59564 6.50002 1.59564C3.84823 1.59564 1.69873 3.75028 1.69873 6.40206C1.69732 7.65607 2.1878 8.8606 3.0648 9.75692L2.3013 10.5155C2.15066 10.6661 2.15066 10.9119 2.29638 11.0576M6.50002 10.3447C4.3203 10.3447 2.55245 8.58178 2.55245 6.40206C2.55245 4.22749 4.3203 2.45964 6.50002 2.45964C8.67459 2.45964 10.4375 4.22749 10.4375 6.40206C10.4375 8.58178 8.67459 10.3447 6.50002 10.3447ZM4.21488 6.95471H6.49488C6.69095 6.95471 6.84652 6.80385 6.84652 6.60799V3.56449C6.8468 3.51826 6.83791 3.47244 6.82035 3.42967C6.80279 3.38691 6.77691 3.34805 6.74422 3.31536C6.71153 3.28267 6.67268 3.2568 6.62991 3.23924C6.58715 3.22168 6.54132 3.21278 6.49509 3.21306C6.29902 3.21306 6.14838 3.36864 6.14838 3.56449V6.25635H4.21488C4.01388 6.25635 3.86345 6.41214 3.86345 6.60778C3.86345 6.80385 4.01388 6.95471 4.21488 6.95471Z" fill="#012340" fillOpacity="0.6" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                </div>

                                                <div className="relative inline-block text-xs">
                                                {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                        <button onClick={() => toggleDropdownPropriete(task.taskId)} type="button" className={`inline-flex items-center pl-1 pr-1 py-1 text-[9px] font-medium text-center text-gray-900 bg-white  `} aria-haspopup="true" aria-expanded={openPropriete === task.taskId ? 'true' : 'false'} style={{ position: 'relative', backgroundColor: `${task.prioColor}20`, color: task.prioColor }} >
                                                            <span className={`text-[${task.prioColor}] whitespace-nowrap`}> {task.taskPriority} </span>
                                                            <svg width="13" height="13" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M16.59 8.79492L12 13.3749L7.41 8.79492L6 10.2049L12 16.2049L18 10.2049L16.59 8.79492Z" fill={task.prioColor} />
                                                            </svg>
                                                        </button>
                                                        ) :
                                                        <button  type="button" className={`inline-flex items-center pl-1 pr-1 py-1 text-[9px] font-medium text-center text-gray-900 bg-white  `} aria-haspopup="true" aria-expanded={openPropriete === task.taskId ? 'true' : 'false'} style={{ position: 'relative', backgroundColor: `${task.prioColor}20`, color: task.prioColor }} >
                                                            <span className={`text-[${task.prioColor}] whitespace-nowrap`}> {task.taskPriority} </span>
                                                        </button>
                                                    
                                                    }

                                                    {/* Dropdown menu */}
                                                    {openPropriete === task.taskId && (
                                                        <div className={`z-50 origin-top-left absolute right-0 mt-2 w-40 px-5 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`} role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton">
                                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                                {priorities.map((priority, idx) => (
                                                                    <li key={idx} className="border-b border-[#f0f0f0] last:border-b-0 cursor-pointer">
                                                                        <a onClick={() => { OnSelectedPriority(task.taskId,priority) }} className="cursor-pointer flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>  {priority} </span>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                            </div>

                                        </div>

                                    ))}


                                        <div className="absolute  -bottom-7 left-0 right-0 flex items-center justify-center ">
                                                <div className="flex items-center space-x-5">

                                                    <button onClick={() => handlePageChangeEnCours(currentPageEnCours - 1)} disabled={currentPageEnCours === 1} className="flex items-center justify-center w-13 h-13 bg-white border border-white rounded-full shadow-md hover:bg-gray-100 transition">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z" fill="#F27F1B"/>
                                                        </svg>
                                                    </button>
                                                    

                                                    <button onClick={() => handlePageChangeEnCours(currentPageEnCours + 1)} disabled={paginatedTasksEnCours.length < itemsPerPageEnCours} className="flex items-center justify-center w-13 h-13 bg-white border border-white rounded-full shadow-md hover:bg-gray-100 transition">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" fill="#F27F1B"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                        </div>

                                </div>

                            ) : (
                                <NoteFound />
                            )}

                        </div>
                    </div>


                    {/* Dexieme Crad */}

                    <div>
                        <div className=" mb-10 relative flex flex-col p-2 mx-auto max-w-lg h-[40rem]  text-gray-900 bg-[#EBF1FA] rounded-lg  border-gray-100 shadow dark:border-gray-600  dark:bg-gray-800 dark:text-white">

                            <div className="mb-5 flex justify-between">

                                <div className="flex items-center">
                                    <h3 className="text-lg text-black font-bold">En attentes</h3>
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white ml-2">
                                        <span className="text-sm font-medium text-black">{tasksEnAttente.length} </span>
                                    </div>
                                </div>

                                <div> </div>
                            </div>

                            {paginatedTasksEnAttente.length > 0 ? (

                                <div className='flex flex-col'>

                                    {paginatedTasksEnAttente.map((task, index) => (

                                        <div key={task.taskId} className='mb-3 p-3 bg-white rounded-md space-y-4'>

                                            <div className='flex justify-between'>

                                                <div onClick={() => {
                                                    localStorage.setItem('selectedProjectCode', id!); // Ajoute taskCode au localStorage
                                                    navigateTo(`/admin/tache/${task.taskCode}`); // Navigue vers la page
                                                }}>

                                                    <a className='cursor-pointer hover:underline' onClick={() => navigateTo(`/admin/tache/${task.taskCode}`)} >
                                                        <h3 className="cursor-pointer hover:underline text-sm font-semibold">{task.taskName}</h3>
                                                    </a>
                                                </div>

                                                <div>

                                                    <div className="relative inline-block text-left">

                                                        <button onClick={() => toggleDropdown(task.taskId)} type="button" className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900  rounded-lg"
                                                            aria-haspopup="true" aria-expanded={openTaskId === task.taskId ? 'true' : 'false'} style={{ position: 'relative' }}>

                                                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.5 10C5.4 10 4.5 10.9 4.5 12C4.5 13.1 5.4 14 6.5 14C7.6 14 8.5 13.1 8.5 12C8.5 10.9 7.6 10 6.5 10ZM18.5 10C17.4 10 16.5 10.9 16.5 12C16.5 13.1 17.4 14 18.5 14C19.6 14 20.5 13.1 20.5 12C20.5 10.9 19.6 10 18.5 10ZM12.5 10C11.4 10 10.5 10.9 10.5 12C10.5 13.1 11.4 14 12.5 14C13.6 14 14.5 13.1 14.5 12C14.5 10.9 13.6 10 12.5 10Z" fill="black" fillOpacity="0.56" />
                                                            </svg>

                                                        </button>

                                                        {openTaskId === task.taskId && (
                                                            <div
                                                                className={`z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'right-full top-0' : 'right-full top-0'} mt-2 w-40 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                                role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton" style={{ position: 'absolute' }}>

                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">

                                                                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (

                                                                        <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                            <a onClick={() => navigateTo(`/admin/tache/edit-tache/${task.taskId}`)} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                                <span>
                                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M12.6666 13.3336H3.33329C3.15648 13.3336 2.98691 13.4038 2.86188 13.5288C2.73686 13.6538 2.66662 13.8234 2.66662 14.0002C2.66662 14.177 2.73686 14.3466 2.86188 14.4716C2.98691 14.5967 3.15648 14.6669 3.33329 14.6669H12.6666C12.8434 14.6669 13.013 14.5967 13.138 14.4716C13.263 14.3466 13.3333 14.177 13.3333 14.0002C13.3333 13.8234 13.263 13.6538 13.138 13.5288C13.013 13.4038 12.8434 13.3336 12.6666 13.3336ZM3.33329 12.0002H3.39329L6.17329 11.7469C6.47782 11.7166 6.76264 11.5824 6.97995 11.3669L12.98 5.3669C13.2128 5.12088 13.3387 4.79257 13.3299 4.45392C13.3212 4.11527 13.1786 3.7939 12.9333 3.56023L11.1066 1.73356C10.8682 1.50963 10.5558 1.38114 10.2288 1.37253C9.90187 1.36393 9.58314 1.47581 9.33329 1.6869L3.33329 7.6869C3.1178 7.90421 2.98362 8.18903 2.95329 8.49356L2.66662 11.2736C2.65764 11.3712 2.67031 11.4696 2.70373 11.5618C2.73715 11.654 2.79049 11.7377 2.85995 11.8069C2.92225 11.8687 2.99612 11.9176 3.07735 11.9507C3.15857 11.9839 3.24555 12.0007 3.33329 12.0002ZM10.18 2.6669L12 4.4869L10.6666 5.7869L8.87995 4.00023L10.18 2.6669Z" fill="#033F73" />
                                                                                    </svg>

                                                                                </span>
                                                                                <span> Modifier </span>
                                                                            </a>
                                                                        </li>

                                                                    ) : null}

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a href="#" className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M5.33337 14V12.6667H2.66671C2.30004 12.6667 1.98626 12.5362 1.72537 12.2753C1.46449 12.0144 1.33382 11.7004 1.33337 11.3333V3.33333C1.33337 2.96667 1.46404 2.65289 1.72537 2.392C1.98671 2.13111 2.30049 2.00044 2.66671 2H13.3334C13.7 2 14.014 2.13067 14.2754 2.392C14.5367 2.65333 14.6672 2.96711 14.6667 3.33333V11.3333C14.6667 11.7 14.5363 12.014 14.2754 12.2753C14.0145 12.5367 13.7005 12.6671 13.3334 12.6667H10.6667V14H5.33337ZM2.66671 11.3333H13.3334V3.33333H2.66671V11.3333Z" fill="#F27F1B"/>
                                                                            </svg>

                                                                            </span>
                                                                            <span> Observations </span>
                                                                        </a>
                                                                    </li>

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a href="#" className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill-rule="evenodd" clipRule="evenodd" d="M8.88894 0C9.00682 0 9.11986 0.0468253 9.20321 0.130175C9.28656 0.213524 9.33339 0.32657 9.33339 0.444444V1.77778C9.33339 1.89565 9.38021 2.0087 9.46356 2.09205C9.54691 2.1754 9.65996 2.22222 9.77783 2.22222C9.89571 2.22222 10.0088 2.1754 10.0921 2.09205C10.1755 2.0087 10.2223 1.89565 10.2223 1.77778V0.888889H10.6667C11.0203 0.888889 11.3595 1.02936 11.6095 1.27941C11.8596 1.52946 12.0001 1.8686 12.0001 2.22222V12.8889C12.0001 13.2425 11.8596 13.5816 11.6095 13.8317C11.3595 14.0817 11.0203 14.2222 10.6667 14.2222H3.11117C2.75754 14.2222 2.4184 14.0817 2.16836 13.8317C1.91831 13.5816 1.77783 13.2425 1.77783 12.8889V2.22222C1.77783 1.8686 1.91831 1.52946 2.16836 1.27941C2.4184 1.02936 2.75754 0.888889 3.11117 0.888889H4.00005V0.444444C4.00005 0.32657 4.04688 0.213524 4.13023 0.130175C4.21358 0.0468253 4.32662 0 4.4445 0C4.56237 0 4.67542 0.0468253 4.75877 0.130175C4.84212 0.213524 4.88894 0.32657 4.88894 0.444444V1.77778C4.88894 1.89565 4.93577 2.0087 5.01912 2.09205C5.10247 2.1754 5.21551 2.22222 5.33339 2.22222C5.45126 2.22222 5.56431 2.1754 5.64766 2.09205C5.73101 2.0087 5.77783 1.89565 5.77783 1.77778V0.888889H8.4445V0.444444C8.4445 0.32657 8.49132 0.213524 8.57467 0.130175C8.65802 0.0468253 8.77107 0 8.88894 0ZM4.00005 5.33333C3.88218 5.33333 3.76913 5.38016 3.68578 5.46351C3.60244 5.54686 3.55561 5.6599 3.55561 5.77778C3.55561 5.89565 3.60244 6.0087 3.68578 6.09205C3.76913 6.1754 3.88218 6.22222 4.00005 6.22222H9.77783C9.89571 6.22222 10.0088 6.1754 10.0921 6.09205C10.1755 6.0087 10.2223 5.89565 10.2223 5.77778C10.2223 5.6599 10.1755 5.54686 10.0921 5.46351C10.0088 5.38016 9.89571 5.33333 9.77783 5.33333H4.00005ZM3.55561 8C3.55561 7.88213 3.60244 7.76908 3.68578 7.68573C3.76913 7.60238 3.88218 7.55556 4.00005 7.55556H7.11117C7.22904 7.55556 7.34209 7.60238 7.42544 7.68573C7.50878 7.76908 7.55561 7.88213 7.55561 8C7.55561 8.11787 7.50878 8.23092 7.42544 8.31427C7.34209 8.39762 7.22904 8.44444 7.11117 8.44444H4.00005C3.88218 8.44444 3.76913 8.39762 3.68578 8.31427C3.60244 8.23092 3.55561 8.11787 3.55561 8ZM4.00005 9.77778C3.88218 9.77778 3.76913 9.8246 3.68578 9.90795C3.60244 9.9913 3.55561 10.1043 3.55561 10.2222C3.55561 10.3401 3.60244 10.4531 3.68578 10.5365C3.76913 10.6198 3.88218 10.6667 4.00005 10.6667H8.88894C9.00682 10.6667 9.11986 10.6198 9.20321 10.5365C9.28656 10.4531 9.33339 10.3401 9.33339 10.2222C9.33339 10.1043 9.28656 9.9913 9.20321 9.90795C9.11986 9.8246 9.00682 9.77778 8.88894 9.77778H4.00005Z" fill="#012340"/>
                                                                                <path d="M3.11111 16.0001C2.28599 16.0001 1.49467 15.6723 0.911224 15.0888C0.327777 14.5054 0 13.7141 0 12.8889V1.77783H0.888889V12.8889C0.888889 13.4783 1.12302 14.0435 1.53976 14.4603C1.95651 14.877 2.52174 15.1112 3.11111 15.1112H10.6667V16.0001H3.11111ZM13.3333 3.11117C13.3333 2.75754 13.4738 2.4184 13.7239 2.16836C13.9739 1.91831 14.313 1.77783 14.6667 1.77783C15.0203 1.77783 15.3594 1.91831 15.6095 2.16836C15.8595 2.4184 16 2.75754 16 3.11117V4.4445H13.3333V3.11117ZM13.3333 12.0001V5.33339H16V12.0001L14.6667 13.7778L13.3333 12.0001Z" fill="#012340"/>
                                                                            </svg>

                                                                            </span>
                                                                            <span> Actions</span>
                                                                        </a>
                                                                    </li>

                                                                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                                        <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                            <a onClick={() => openModal(task.taskId)} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer ">

                                                                                <span>
                                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M4.00004 12.6667C4.00004 13.4 4.60004 14 5.33337 14H10.6667C11.4 14 12 13.4 12 12.6667V4.66667H4.00004V12.6667ZM12.6667 2.66667H10.3334L9.66671 2H6.33337L5.66671 2.66667H3.33337V4H12.6667V2.66667Z" fill="#C62828" />
                                                                                    </svg>
                                                                                </span>
                                                                                <span className='cursor-pointer'> Supprimer </span>
                                                                            </a>
                                                                        </li>
                                                                    ) : null}

                                                                </ul>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex justify-between'>

                                                <div>

                                                    <button className="h-8 w-8 border-0 border-white dark:border-boxdark">
                                                    <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                    </button>

                                                </div>

                                                <div>

                                                    <div className="relative inline-block text-left">

                                                        <svg onClick={() => openValidateModal(task.taskId,2,'EN_COURS','#038C4C')} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11 7.5H9.5V16.5H11V7.5ZM15.5 7.5H14V16.5H15.5V7.5Z" fill="#033F73" />
                                                            <path d="M12.5 3C14.28 3 16.0201 3.52784 17.5001 4.51677C18.9802 5.50571 20.1337 6.91131 20.8149 8.55585C21.4961 10.2004 21.6743 12.01 21.3271 13.7558C20.9798 15.5016 20.1226 17.1053 18.864 18.364C17.6053 19.6226 16.0016 20.4798 14.2558 20.8271C12.51 21.1743 10.7004 20.9961 9.05585 20.3149C7.41132 19.6337 6.00571 18.4802 5.01678 17.0001C4.02785 15.5201 3.5 13.78 3.5 12C3.5 9.61305 4.44822 7.32387 6.13604 5.63604C7.82387 3.94821 10.1131 3 12.5 3ZM12.5 1.5C10.4233 1.5 8.39323 2.11581 6.66652 3.26957C4.9398 4.42332 3.59399 6.0632 2.79927 7.98182C2.00455 9.90045 1.79661 12.0116 2.20176 14.0484C2.6069 16.0852 3.60693 17.9562 5.07538 19.4246C6.54383 20.8931 8.41476 21.8931 10.4516 22.2982C12.4884 22.7034 14.5996 22.4955 16.5182 21.7007C18.4368 20.906 20.0767 19.5602 21.2304 17.8335C22.3842 16.1068 23 14.0767 23 12C23 9.21523 21.8938 6.54451 19.9246 4.57538C17.9555 2.60625 15.2848 1.5 12.5 1.5Z" fill="#033F73" />
                                                        </svg>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex justify-between items-center space-x-2'>

                                                <div className="flex items-center gap-2">

                                                    <svg width="18" height="18" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                                        <path d="M9 6H6.5V8.5H9V6ZM8.5 0.5V1.5H4.5V0.5H3.5V1.5H3C2.445 1.5 2.005 1.95 2.005 2.5L2 9.5C2 10.05 2.445 10.5 3 10.5H10C10.55 10.5 11 10.05 11 9.5V2.5C11 1.95 10.55 1.5 10 1.5H9.5V0.5H8.5ZM10 9.5H3V4H10V9.5Z" fill="black" fillOpacity="0.56" />
                                                    </svg>


                                                    <div className="text-[9px] font-semibold">
                                                        {<DateConverter dateStr={task.taskStartDate} />} - {task.taskNombreHeurs} h
                                                    </div>


                                                    { task.alerteDate && task.alerteDate.length > 0 ? (
                                                        <span  className=" cursor-pointer bg-white text-[#F27F1B] text-xs font-medium px-1 py-0 border border-[#F27F1B]  rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center space-x-1">
                                                            <svg width="12" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.37159 2.88649C2.44702 2.88649 2.5023 2.87642 2.57259 2.82114L4.25495 1.55042C4.34045 1.49042 4.38566 1.40985 4.38566 1.32456C4.38566 1.21914 4.3353 1.13385 4.25002 1.05328C4.0593 0.882493 3.71752 0.787136 3.41645 0.787136C3.23079 0.785998 3.04675 0.821724 2.875 0.892242C2.70325 0.96276 2.5472 1.06667 2.41591 1.19794C2.28461 1.32922 2.18068 1.48525 2.11014 1.65699C2.03959 1.82873 2.00384 2.01276 2.00495 2.19842C2.00495 2.38421 2.03516 2.56999 2.0853 2.68549C2.14059 2.81106 2.25116 2.88649 2.37159 2.88649ZM10.6233 2.88649C10.7489 2.88649 10.8494 2.80614 10.9096 2.68549C10.9649 2.57514 10.9949 2.38421 10.9949 2.19842C10.9949 1.41499 10.367 0.787136 9.57866 0.787136C9.2823 0.787136 8.94095 0.882493 8.75002 1.05328C8.66452 1.13364 8.61438 1.21914 8.61438 1.32456C8.61438 1.40985 8.65959 1.49021 8.73995 1.55042L10.4225 2.82114C10.4928 2.87642 10.5481 2.88649 10.6233 2.88649ZM2.29616 11.0579C2.3326 11.095 2.37617 11.1245 2.42426 11.1445C2.47235 11.1644 2.52398 11.1744 2.57604 11.174C2.62811 11.1735 2.67954 11.1625 2.72726 11.1417C2.77497 11.1208 2.81799 11.0906 2.85373 11.0527L3.64723 10.2641C4.47304 10.8747 5.47303 11.204 6.50002 11.2036C7.56973 11.2036 8.55416 10.8521 9.35259 10.2646L10.1463 11.0531C10.3019 11.2139 10.5481 11.2139 10.6987 11.0581C10.8444 10.9124 10.8494 10.6664 10.6936 10.5155L9.9303 9.75714C10.8107 8.86264 11.3032 7.65734 11.3013 6.40228C11.3013 3.75028 9.1518 1.59564 6.50002 1.59564C3.84823 1.59564 1.69873 3.75028 1.69873 6.40206C1.69732 7.65607 2.1878 8.8606 3.0648 9.75692L2.3013 10.5155C2.15066 10.6661 2.15066 10.9119 2.29638 11.0576M6.50002 10.3447C4.3203 10.3447 2.55245 8.58178 2.55245 6.40206C2.55245 4.22749 4.3203 2.45964 6.50002 2.45964C8.67459 2.45964 10.4375 4.22749 10.4375 6.40206C10.4375 8.58178 8.67459 10.3447 6.50002 10.3447ZM4.21488 6.95471H6.49488C6.69095 6.95471 6.84652 6.80385 6.84652 6.60799V3.56449C6.8468 3.51826 6.83791 3.47244 6.82035 3.42967C6.80279 3.38691 6.77691 3.34805 6.74422 3.31536C6.71153 3.28267 6.67268 3.2568 6.62991 3.23924C6.58715 3.22168 6.54132 3.21278 6.49509 3.21306C6.29902 3.21306 6.14838 3.36864 6.14838 3.56449V6.25635H4.21488C4.01388 6.25635 3.86345 6.41214 3.86345 6.60778C3.86345 6.80385 4.01388 6.95471 4.21488 6.95471Z" fill="#F27F1B" fillOpacity="0.6" />
                                                            </svg>
                                                            <p onClick={() => openModalAlerte(task.taskId,task.alerteDate)}  className="text-[10px] whitespace-nowrap mb-0 cursor-pointer"> {formatDate(task.alerteDate)} </p>
                                                            {/* lun 30 mai 12h00 */}
                                                        </span>

                                                            ) : (
                                                        <span onClick={() => openModalAlerte(task.taskId,'')} className=" cursor-pointer bg-white text-black text-xs font-medium px-1 py-0  rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center space-x-1">
                                                            <svg width="12" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.37159 2.88649C2.44702 2.88649 2.5023 2.87642 2.57259 2.82114L4.25495 1.55042C4.34045 1.49042 4.38566 1.40985 4.38566 1.32456C4.38566 1.21914 4.3353 1.13385 4.25002 1.05328C4.0593 0.882493 3.71752 0.787136 3.41645 0.787136C3.23079 0.785998 3.04675 0.821724 2.875 0.892242C2.70325 0.96276 2.5472 1.06667 2.41591 1.19794C2.28461 1.32922 2.18068 1.48525 2.11014 1.65699C2.03959 1.82873 2.00384 2.01276 2.00495 2.19842C2.00495 2.38421 2.03516 2.56999 2.0853 2.68549C2.14059 2.81106 2.25116 2.88649 2.37159 2.88649ZM10.6233 2.88649C10.7489 2.88649 10.8494 2.80614 10.9096 2.68549C10.9649 2.57514 10.9949 2.38421 10.9949 2.19842C10.9949 1.41499 10.367 0.787136 9.57866 0.787136C9.2823 0.787136 8.94095 0.882493 8.75002 1.05328C8.66452 1.13364 8.61438 1.21914 8.61438 1.32456C8.61438 1.40985 8.65959 1.49021 8.73995 1.55042L10.4225 2.82114C10.4928 2.87642 10.5481 2.88649 10.6233 2.88649ZM2.29616 11.0579C2.3326 11.095 2.37617 11.1245 2.42426 11.1445C2.47235 11.1644 2.52398 11.1744 2.57604 11.174C2.62811 11.1735 2.67954 11.1625 2.72726 11.1417C2.77497 11.1208 2.81799 11.0906 2.85373 11.0527L3.64723 10.2641C4.47304 10.8747 5.47303 11.204 6.50002 11.2036C7.56973 11.2036 8.55416 10.8521 9.35259 10.2646L10.1463 11.0531C10.3019 11.2139 10.5481 11.2139 10.6987 11.0581C10.8444 10.9124 10.8494 10.6664 10.6936 10.5155L9.9303 9.75714C10.8107 8.86264 11.3032 7.65734 11.3013 6.40228C11.3013 3.75028 9.1518 1.59564 6.50002 1.59564C3.84823 1.59564 1.69873 3.75028 1.69873 6.40206C1.69732 7.65607 2.1878 8.8606 3.0648 9.75692L2.3013 10.5155C2.15066 10.6661 2.15066 10.9119 2.29638 11.0576M6.50002 10.3447C4.3203 10.3447 2.55245 8.58178 2.55245 6.40206C2.55245 4.22749 4.3203 2.45964 6.50002 2.45964C8.67459 2.45964 10.4375 4.22749 10.4375 6.40206C10.4375 8.58178 8.67459 10.3447 6.50002 10.3447ZM4.21488 6.95471H6.49488C6.69095 6.95471 6.84652 6.80385 6.84652 6.60799V3.56449C6.8468 3.51826 6.83791 3.47244 6.82035 3.42967C6.80279 3.38691 6.77691 3.34805 6.74422 3.31536C6.71153 3.28267 6.67268 3.2568 6.62991 3.23924C6.58715 3.22168 6.54132 3.21278 6.49509 3.21306C6.29902 3.21306 6.14838 3.36864 6.14838 3.56449V6.25635H4.21488C4.01388 6.25635 3.86345 6.41214 3.86345 6.60778C3.86345 6.80385 4.01388 6.95471 4.21488 6.95471Z" fill="#012340" fillOpacity="0.6" />
                                                            </svg>
                                                        </span>
                                                    )}

                                                </div>

                                                <div className="relative inline-block text-xs">

                                                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                        <button onClick={() => toggleDropdownPropriete(task.taskId)} type="button" className={`inline-flex items-center pl-1 pr-1 py-1 text-[9px] font-medium text-center text-gray-900 bg-white  `} aria-haspopup="true" aria-expanded={openPropriete === task.taskId ? 'true' : 'false'} style={{ position: 'relative', backgroundColor: `${task.prioColor}20`, color: task.prioColor }} >
                                                            <span className={`text-[${task.prioColor}] whitespace-nowrap`}> {task.taskPriority} </span>
                                                            <svg width="13" height="13" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M16.59 8.79492L12 13.3749L7.41 8.79492L6 10.2049L12 16.2049L18 10.2049L16.59 8.79492Z" fill={task.prioColor} />
                                                            </svg>
                                                        </button>
                                                        ) :
                                                        <button  type="button" className={`inline-flex items-center pl-1 pr-1 py-1 text-[9px] font-medium text-center text-gray-900 bg-white  `} aria-haspopup="true" aria-expanded={openPropriete === task.taskId ? 'true' : 'false'} style={{ position: 'relative', backgroundColor: `${task.prioColor}20`, color: task.prioColor }} >
                                                            <span className={`text-[${task.prioColor}] whitespace-nowrap`}> {task.taskPriority} </span>
                                                        </button>
                                                    
                                                    }

                                                    {/* Dropdown menu */}
                                                    {openPropriete === task.taskId && (
                                                        <div className={`z-50 origin-top-left absolute right-0 mt-2 w-40 px-5 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`} role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton">
                                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                                {priorities.map((priority, idx) => (
                                                                    <li key={idx} className="border-b border-[#f0f0f0] last:border-b-0 cursor-pointer">
                                                                        <a onClick={() => { OnSelectedPriority(task.taskId,priority) }} className="cursor-pointer flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>  {priority} </span>
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                            </div>

                                        </div>

                                    ))}


                                        <div className="absolute  -bottom-7 left-0 right-0 flex items-center justify-center ">
                                                <div className="flex items-center space-x-5">

                                                    <button onClick={() => handlePageChangeEnAttente(currentPageEnAttente - 1)} disabled={currentPageEnAttente === 1} className="flex items-center justify-center w-13 h-13 bg-white border border-white rounded-full shadow-md hover:bg-gray-100 transition">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z" fill="#F27F1B"/>
                                                        </svg>
                                                    </button>
                                                    

                                                    <button onClick={() => handlePageChangeEnAttente(currentPageEnAttente + 1)} disabled={paginatedTasksEnAttente.length < itemsPerPageEnAttente} className="flex items-center justify-center w-13 h-13 bg-white border border-white rounded-full shadow-md hover:bg-gray-100 transition">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" fill="#F27F1B"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                        </div>

                                </div>
                            ) : (

                                <NoteFound />
                            )}

                        </div>
                    </div>


                    <div>
                        <div className="mb-10  relative flex flex-col p-2 mx-auto max-w-lg h-[40rem]  text-gray-900 bg-[#EBF1FA] rounded-lg  border-gray-100 shadow dark:border-gray-600  dark:bg-gray-800 dark:text-white">

                            <div className="mb-5 flex justify-between">

                                <div className="flex items-center">
                                    <h3 className="text-lg text-black font-bold">Terminées</h3>
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white ml-2">
                                        <span className="text-sm font-medium text-black"> {tasksTermines.length} </span>
                                    </div>
                                </div>

                                <div>


                                </div>
                            </div>

                            {paginatedTasksTermines.length > 0 ? (
                                <div className='flex flex-col'>

                                    {paginatedTasksTermines.map((task, index) => (

                                        <div key={task.taskId} className='mb-3 p-3 bg-white rounded-md space-y-4'>

                                            <div className='flex justify-between'>
                                                
                                                <div onClick={() => {
                                                    localStorage.setItem('selectedProjectCode', id!); // Ajoute taskCode au localStorage
                                                    navigateTo(`/admin/tache/${task.taskCode}`); // Navigue vers la page
                                                }}>
                                                    <a className='cursor-pointer hover:underline' onClick={() => navigateTo(`/admin/tache/${task.taskCode}`)} >
                                                        <h3 className="cursor-pointer hover:underline text-sm font-semibold">{task.taskName}</h3>
                                                    </a>
                                                </div>

                                                <div>

                                                    <div className="relative inline-block text-left">

                                                        <button
                                                            onClick={() => toggleDropdown(task.taskId)}
                                                            type="button"
                                                            className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900  rounded-lg"
                                                            aria-haspopup="true"
                                                            aria-expanded={openTaskId === task.taskId ? 'true' : 'false'}
                                                            style={{ position: 'relative' }}>

                                                            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M6.5 10C5.4 10 4.5 10.9 4.5 12C4.5 13.1 5.4 14 6.5 14C7.6 14 8.5 13.1 8.5 12C8.5 10.9 7.6 10 6.5 10ZM18.5 10C17.4 10 16.5 10.9 16.5 12C16.5 13.1 17.4 14 18.5 14C19.6 14 20.5 13.1 20.5 12C20.5 10.9 19.6 10 18.5 10ZM12.5 10C11.4 10 10.5 10.9 10.5 12C10.5 13.1 11.4 14 12.5 14C13.6 14 14.5 13.1 14.5 12C14.5 10.9 13.6 10 12.5 10Z" fill="black" fillOpacity="0.56" />
                                                            </svg>

                                                        </button>

                                                        {openTaskId === task.taskId && (
                                                            <div
                                                                className={`z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'right-full top-0' : 'right-full top-0'} mt-2 w-40 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                                role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton" style={{ position: 'absolute' }}>

                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">

                                                                {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a onClick={() => navigateTo(`/admin/tache/edit-tache/${task.taskId}`)} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M12.6666 13.3336H3.33329C3.15648 13.3336 2.98691 13.4038 2.86188 13.5288C2.73686 13.6538 2.66662 13.8234 2.66662 14.0002C2.66662 14.177 2.73686 14.3466 2.86188 14.4716C2.98691 14.5967 3.15648 14.6669 3.33329 14.6669H12.6666C12.8434 14.6669 13.013 14.5967 13.138 14.4716C13.263 14.3466 13.3333 14.177 13.3333 14.0002C13.3333 13.8234 13.263 13.6538 13.138 13.5288C13.013 13.4038 12.8434 13.3336 12.6666 13.3336ZM3.33329 12.0002H3.39329L6.17329 11.7469C6.47782 11.7166 6.76264 11.5824 6.97995 11.3669L12.98 5.3669C13.2128 5.12088 13.3387 4.79257 13.3299 4.45392C13.3212 4.11527 13.1786 3.7939 12.9333 3.56023L11.1066 1.73356C10.8682 1.50963 10.5558 1.38114 10.2288 1.37253C9.90187 1.36393 9.58314 1.47581 9.33329 1.6869L3.33329 7.6869C3.1178 7.90421 2.98362 8.18903 2.95329 8.49356L2.66662 11.2736C2.65764 11.3712 2.67031 11.4696 2.70373 11.5618C2.73715 11.654 2.79049 11.7377 2.85995 11.8069C2.92225 11.8687 2.99612 11.9176 3.07735 11.9507C3.15857 11.9839 3.24555 12.0007 3.33329 12.0002ZM10.18 2.6669L12 4.4869L10.6666 5.7869L8.87995 4.00023L10.18 2.6669Z" fill="#033F73" />
                                                                                </svg>

                                                                            </span>
                                                                            <span> Modifier </span>
                                                                        </a>
                                                                    </li>

                                                                ) : null}

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a href="#" className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M5.33337 14V12.6667H2.66671C2.30004 12.6667 1.98626 12.5362 1.72537 12.2753C1.46449 12.0144 1.33382 11.7004 1.33337 11.3333V3.33333C1.33337 2.96667 1.46404 2.65289 1.72537 2.392C1.98671 2.13111 2.30049 2.00044 2.66671 2H13.3334C13.7 2 14.014 2.13067 14.2754 2.392C14.5367 2.65333 14.6672 2.96711 14.6667 3.33333V11.3333C14.6667 11.7 14.5363 12.014 14.2754 12.2753C14.0145 12.5367 13.7005 12.6671 13.3334 12.6667H10.6667V14H5.33337ZM2.66671 11.3333H13.3334V3.33333H2.66671V11.3333Z" fill="#F27F1B"/>
                                                                            </svg>

                                                                            </span>
                                                                            <span> Observations </span>
                                                                        </a>
                                                                    </li>

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a href="#" className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fill-rule="evenodd" clipRule="evenodd" d="M8.88894 0C9.00682 0 9.11986 0.0468253 9.20321 0.130175C9.28656 0.213524 9.33339 0.32657 9.33339 0.444444V1.77778C9.33339 1.89565 9.38021 2.0087 9.46356 2.09205C9.54691 2.1754 9.65996 2.22222 9.77783 2.22222C9.89571 2.22222 10.0088 2.1754 10.0921 2.09205C10.1755 2.0087 10.2223 1.89565 10.2223 1.77778V0.888889H10.6667C11.0203 0.888889 11.3595 1.02936 11.6095 1.27941C11.8596 1.52946 12.0001 1.8686 12.0001 2.22222V12.8889C12.0001 13.2425 11.8596 13.5816 11.6095 13.8317C11.3595 14.0817 11.0203 14.2222 10.6667 14.2222H3.11117C2.75754 14.2222 2.4184 14.0817 2.16836 13.8317C1.91831 13.5816 1.77783 13.2425 1.77783 12.8889V2.22222C1.77783 1.8686 1.91831 1.52946 2.16836 1.27941C2.4184 1.02936 2.75754 0.888889 3.11117 0.888889H4.00005V0.444444C4.00005 0.32657 4.04688 0.213524 4.13023 0.130175C4.21358 0.0468253 4.32662 0 4.4445 0C4.56237 0 4.67542 0.0468253 4.75877 0.130175C4.84212 0.213524 4.88894 0.32657 4.88894 0.444444V1.77778C4.88894 1.89565 4.93577 2.0087 5.01912 2.09205C5.10247 2.1754 5.21551 2.22222 5.33339 2.22222C5.45126 2.22222 5.56431 2.1754 5.64766 2.09205C5.73101 2.0087 5.77783 1.89565 5.77783 1.77778V0.888889H8.4445V0.444444C8.4445 0.32657 8.49132 0.213524 8.57467 0.130175C8.65802 0.0468253 8.77107 0 8.88894 0ZM4.00005 5.33333C3.88218 5.33333 3.76913 5.38016 3.68578 5.46351C3.60244 5.54686 3.55561 5.6599 3.55561 5.77778C3.55561 5.89565 3.60244 6.0087 3.68578 6.09205C3.76913 6.1754 3.88218 6.22222 4.00005 6.22222H9.77783C9.89571 6.22222 10.0088 6.1754 10.0921 6.09205C10.1755 6.0087 10.2223 5.89565 10.2223 5.77778C10.2223 5.6599 10.1755 5.54686 10.0921 5.46351C10.0088 5.38016 9.89571 5.33333 9.77783 5.33333H4.00005ZM3.55561 8C3.55561 7.88213 3.60244 7.76908 3.68578 7.68573C3.76913 7.60238 3.88218 7.55556 4.00005 7.55556H7.11117C7.22904 7.55556 7.34209 7.60238 7.42544 7.68573C7.50878 7.76908 7.55561 7.88213 7.55561 8C7.55561 8.11787 7.50878 8.23092 7.42544 8.31427C7.34209 8.39762 7.22904 8.44444 7.11117 8.44444H4.00005C3.88218 8.44444 3.76913 8.39762 3.68578 8.31427C3.60244 8.23092 3.55561 8.11787 3.55561 8ZM4.00005 9.77778C3.88218 9.77778 3.76913 9.8246 3.68578 9.90795C3.60244 9.9913 3.55561 10.1043 3.55561 10.2222C3.55561 10.3401 3.60244 10.4531 3.68578 10.5365C3.76913 10.6198 3.88218 10.6667 4.00005 10.6667H8.88894C9.00682 10.6667 9.11986 10.6198 9.20321 10.5365C9.28656 10.4531 9.33339 10.3401 9.33339 10.2222C9.33339 10.1043 9.28656 9.9913 9.20321 9.90795C9.11986 9.8246 9.00682 9.77778 8.88894 9.77778H4.00005Z" fill="#012340"/>
                                                                                <path d="M3.11111 16.0001C2.28599 16.0001 1.49467 15.6723 0.911224 15.0888C0.327777 14.5054 0 13.7141 0 12.8889V1.77783H0.888889V12.8889C0.888889 13.4783 1.12302 14.0435 1.53976 14.4603C1.95651 14.877 2.52174 15.1112 3.11111 15.1112H10.6667V16.0001H3.11111ZM13.3333 3.11117C13.3333 2.75754 13.4738 2.4184 13.7239 2.16836C13.9739 1.91831 14.313 1.77783 14.6667 1.77783C15.0203 1.77783 15.3594 1.91831 15.6095 2.16836C15.8595 2.4184 16 2.75754 16 3.11117V4.4445H13.3333V3.11117ZM13.3333 12.0001V5.33339H16V12.0001L14.6667 13.7778L13.3333 12.0001Z" fill="#012340"/>
                                                                            </svg>

                                                                            </span>
                                                                            <span> Actions</span>
                                                                        </a>
                                                                    </li>

                                                                    {task.isValides === 0 && (
                                                                        <>
                                                                            {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                                                <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                                    <a onClick={() => openModal(task.taskId)} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                                        <span>
                                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M4.00004 12.6667C4.00004 13.4 4.60004 14 5.33337 14H10.6667C11.4 14 12 13.4 12 12.6667V4.66667H4.00004V12.6667ZM12.6667 2.66667H10.3334L9.66671 2H6.33337L5.66671 2.66667H3.33337V4H12.6667V2.66667Z" fill="#C62828" />
                                                                                            </svg>
                                                                                        </span>
                                                                                        <span> Supprimer </span>
                                                                                    </a>
                                                                                </li>

                                                                            ) : null}
                                                                        </>
                                                                    )}


                                                                </ul>
                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex justify-between'>

                                                <div>

                                                    <button className="h-8 w-8 border-0 border-white dark:border-boxdark">
                                                        <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                    </button>

                                                </div>

                                                <div>
                                                    
                                                {/* 
                                                    {task.isValides === 1 && (
                                                        <>
                                                            <div className="flex items-center">
                                                                <span className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12.5 22C6.977 22 2.5 17.523 2.5 12C2.5 6.477 6.977 2 12.5 2C18.023 2 22.5 6.477 22.5 12C22.5 17.523 18.023 22 12.5 22ZM11.503 16L18.573 8.929L17.16 7.515L11.503 13.172L8.674 10.343L7.26 11.757L11.503 16Z" fill="#038C4C"/>
                                                                </svg>
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}


                                                    {task.isValides === 0 && (
                                                        <>
                                                            <div className="flex items-center">
                                                                    <input onClick={() => toggleDropdownActions(task.taskId)} id="radio1" type="radio" name="value1" className="w-3 h-3 hidden peer" checked />
                                                                    <label htmlFor="radio1" className="relative flex items-center justify-center peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer border-0 border-orange-500 rounded-full overflow-hidden">
                                                                        <svg width="25" height="24" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M10.5 20C4.977 20 0.5 15.523 0.5 10C0.5 4.477 4.977 0 10.5 0C16.023 0 20.5 4.477 20.5 10C20.5 15.523 16.023 20 10.5 20ZM9.503 14L16.573 6.929L15.16 5.515L9.503 11.172L6.674 8.343L5.26 9.757L9.503 14Z" fill="#F27F1B" />
                                                                        </svg>
                                                                    </label>
                                                            </div>
                                        
                                                        </>
                                                    )} */}

                                                
                                                    <div className="flex items-center">
                                                        {task.isValides === 1 ? (
                                                            <>
                                                                <span className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                                                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M12.5 22C6.977 22 2.5 17.523 2.5 12C2.5 6.477 6.977 2 12.5 2C18.023 2 22.5 6.477 22.5 12C22.5 17.523 18.023 22 12.5 22ZM11.503 16L18.573 8.929L17.16 7.515L11.503 13.172L8.674 10.343L7.26 11.757L11.503 16Z" fill="#038C4C" />
                                                                    </svg>
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <input
                                                                    onClick={() => {
                                                                        toggleDropdownActions(task.taskId);
                                                                        setSelectedTaskId(task.taskId);
                                                                    }}
                                                                    id={`radio-${task.taskId}`}
                                                                    type="radio"
                                                                    name="value1"
                                                                    className="w-3 h-3 hidden peer"
                                                                    checked
                                                                />
                                                                <label htmlFor={`radio-${task.taskId}`}
                                                                    className="relative flex items-center justify-center peer-checked:before:hidden before:block before:absolute before:w-full before:h-full before:bg-white w-5 h-5 cursor-pointer border-0 border-orange-500 rounded-full overflow-hidden"
>
                                                                    <svg width="25" height="24" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10.5 20C4.977 20 0.5 15.523 0.5 10C0.5 4.477 4.977 0 10.5 0C16.023 0 20.5 4.477 20.5 10C20.5 15.523 16.023 20 10.5 20ZM9.503 14L16.573 6.929L15.16 5.515L9.503 11.172L6.674 8.343L5.26 9.757L9.503 14Z" fill="#F27F1B" />
                                                                    </svg>
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>

                                                
                                                    <div className="relative inline-block text-left">

                                                        {openActionTaskId === task.taskId && (
                                                            <div className={`z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'right-full top-0' : 'right-full top-0'} mt-2 w-40 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                                role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton" style={{ position: 'absolute' }}>

                                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                                
                                                                {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                                    <>

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a onClick={() => openValidateModal(task.taskId,5,'EN_COURS','#012340')}  className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">

                                                                            <span>
                                                                                <svg width="18" height="18" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M7.47803 5H6.47803V11H7.47803V5ZM10.478 5H9.47803V11H10.478V5Z" fill="black" fillOpacity="0.6" />
                                                                                    <path d="M8.47803 2C9.66472 2 10.8248 2.35189 11.8115 3.01118C12.7981 3.67047 13.5672 4.60754 14.0213 5.7039C14.4754 6.80026 14.5943 8.00666 14.3627 9.17054C14.1312 10.3344 13.5598 11.4035 12.7207 12.2426C11.8816 13.0818 10.8125 13.6532 9.64857 13.8847C8.48469 14.1162 7.27829 13.9974 6.18193 13.5433C5.08557 13.0892 4.1485 12.3201 3.48921 11.3334C2.82992 10.3467 2.47803 9.18669 2.47803 8C2.47803 6.4087 3.11017 4.88258 4.23539 3.75736C5.36061 2.63214 6.88673 2 8.47803 2ZM8.47803 1C7.09356 1 5.74018 1.41054 4.58904 2.17971C3.43789 2.94888 2.54069 4.04213 2.01087 5.32122C1.48106 6.6003 1.34244 8.00776 1.61253 9.36563C1.88263 10.7235 2.54932 11.9708 3.52828 12.9497C4.50725 13.9287 5.75453 14.5954 7.1124 14.8655C8.47027 15.1356 9.87773 14.997 11.1568 14.4672C12.4359 13.9373 13.5291 13.0401 14.2983 11.889C15.0675 10.7378 15.478 9.38447 15.478 8C15.478 6.14348 14.7405 4.36301 13.4278 3.05025C12.115 1.7375 10.3345 1 8.47803 1Z" fill="black" fillOpacity="0.6" />
                                                                                </svg>
                                                                            </span>

                                                                            <span> REJETER </span>
                                                                        </a>
                                                                    </li>

                                                                    <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                                        <a onClick={() => openValidateModal(task.taskId,4,'1','#012340')}  className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                            <span>
                                                                                <svg width="18" height="18" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M12.5 22C6.977 22 2.5 17.523 2.5 12C2.5 6.477 6.977 2 12.5 2C18.023 2 22.5 6.477 22.5 12C22.5 17.523 18.023 22 12.5 22ZM11.503 16L18.573 8.929L17.16 7.515L11.503 13.172L8.674 10.343L7.26 11.757L11.503 16Z" fill="#038C4C"/>
                                                                                </svg>
                                                                            </span>

                                                                            <span> VALIDER </span>
                                                                        </a>
                                                                    </li>

                                                                    </>

                                                                    ) : null}
                                                    
                                                                </ul>

                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex justify-between items-center space-x-2'>

                                                <div className="flex items-center gap-2">

                                                    <svg width="18" height="18" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                                        <path d="M9 6H6.5V8.5H9V6ZM8.5 0.5V1.5H4.5V0.5H3.5V1.5H3C2.445 1.5 2.005 1.95 2.005 2.5L2 9.5C2 10.05 2.445 10.5 3 10.5H10C10.55 10.5 11 10.05 11 9.5V2.5C11 1.95 10.55 1.5 10 1.5H9.5V0.5H8.5ZM10 9.5H3V4H10V9.5Z" fill="black" fillOpacity="0.56" />
                                                    </svg>


                                                    <div className="text-[9px] font-semibold">
                                                        {<DateConverter dateStr={task.taskStartDate} />} - {task.taskNombreHeurs} h
                                                    </div>


                                                    { task.alerteDate && task.alerteDate.length > 0 ? (

                                                        <span  className=" cursor-pointer bg-white text-[#F27F1B] text-xs font-medium px-1 py-0 border border-[#F27F1B]  rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center space-x-1">
                                                            <svg width="12" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.37159 2.88649C2.44702 2.88649 2.5023 2.87642 2.57259 2.82114L4.25495 1.55042C4.34045 1.49042 4.38566 1.40985 4.38566 1.32456C4.38566 1.21914 4.3353 1.13385 4.25002 1.05328C4.0593 0.882493 3.71752 0.787136 3.41645 0.787136C3.23079 0.785998 3.04675 0.821724 2.875 0.892242C2.70325 0.96276 2.5472 1.06667 2.41591 1.19794C2.28461 1.32922 2.18068 1.48525 2.11014 1.65699C2.03959 1.82873 2.00384 2.01276 2.00495 2.19842C2.00495 2.38421 2.03516 2.56999 2.0853 2.68549C2.14059 2.81106 2.25116 2.88649 2.37159 2.88649ZM10.6233 2.88649C10.7489 2.88649 10.8494 2.80614 10.9096 2.68549C10.9649 2.57514 10.9949 2.38421 10.9949 2.19842C10.9949 1.41499 10.367 0.787136 9.57866 0.787136C9.2823 0.787136 8.94095 0.882493 8.75002 1.05328C8.66452 1.13364 8.61438 1.21914 8.61438 1.32456C8.61438 1.40985 8.65959 1.49021 8.73995 1.55042L10.4225 2.82114C10.4928 2.87642 10.5481 2.88649 10.6233 2.88649ZM2.29616 11.0579C2.3326 11.095 2.37617 11.1245 2.42426 11.1445C2.47235 11.1644 2.52398 11.1744 2.57604 11.174C2.62811 11.1735 2.67954 11.1625 2.72726 11.1417C2.77497 11.1208 2.81799 11.0906 2.85373 11.0527L3.64723 10.2641C4.47304 10.8747 5.47303 11.204 6.50002 11.2036C7.56973 11.2036 8.55416 10.8521 9.35259 10.2646L10.1463 11.0531C10.3019 11.2139 10.5481 11.2139 10.6987 11.0581C10.8444 10.9124 10.8494 10.6664 10.6936 10.5155L9.9303 9.75714C10.8107 8.86264 11.3032 7.65734 11.3013 6.40228C11.3013 3.75028 9.1518 1.59564 6.50002 1.59564C3.84823 1.59564 1.69873 3.75028 1.69873 6.40206C1.69732 7.65607 2.1878 8.8606 3.0648 9.75692L2.3013 10.5155C2.15066 10.6661 2.15066 10.9119 2.29638 11.0576M6.50002 10.3447C4.3203 10.3447 2.55245 8.58178 2.55245 6.40206C2.55245 4.22749 4.3203 2.45964 6.50002 2.45964C8.67459 2.45964 10.4375 4.22749 10.4375 6.40206C10.4375 8.58178 8.67459 10.3447 6.50002 10.3447ZM4.21488 6.95471H6.49488C6.69095 6.95471 6.84652 6.80385 6.84652 6.60799V3.56449C6.8468 3.51826 6.83791 3.47244 6.82035 3.42967C6.80279 3.38691 6.77691 3.34805 6.74422 3.31536C6.71153 3.28267 6.67268 3.2568 6.62991 3.23924C6.58715 3.22168 6.54132 3.21278 6.49509 3.21306C6.29902 3.21306 6.14838 3.36864 6.14838 3.56449V6.25635H4.21488C4.01388 6.25635 3.86345 6.41214 3.86345 6.60778C3.86345 6.80385 4.01388 6.95471 4.21488 6.95471Z" fill="#F27F1B" fillOpacity="0.6" />
                                                            </svg>
                                                            <p onClick={() => openModalAlerte(task.taskId,task.alerteDate)}  className="text-[10px] whitespace-nowrap mb-0 cursor-pointer"> {formatDate(task.alerteDate)} </p>
                                                            {/* lun 30 mai 12h00 */}
                                                        </span>

                                                    ) : (

                                                        <span onClick={() => openModalAlerte(task.taskId,'')} className=" cursor-pointer bg-white text-black text-xs font-medium px-1 py-0  rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center space-x-1">
                                                            <svg width="12" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.37159 2.88649C2.44702 2.88649 2.5023 2.87642 2.57259 2.82114L4.25495 1.55042C4.34045 1.49042 4.38566 1.40985 4.38566 1.32456C4.38566 1.21914 4.3353 1.13385 4.25002 1.05328C4.0593 0.882493 3.71752 0.787136 3.41645 0.787136C3.23079 0.785998 3.04675 0.821724 2.875 0.892242C2.70325 0.96276 2.5472 1.06667 2.41591 1.19794C2.28461 1.32922 2.18068 1.48525 2.11014 1.65699C2.03959 1.82873 2.00384 2.01276 2.00495 2.19842C2.00495 2.38421 2.03516 2.56999 2.0853 2.68549C2.14059 2.81106 2.25116 2.88649 2.37159 2.88649ZM10.6233 2.88649C10.7489 2.88649 10.8494 2.80614 10.9096 2.68549C10.9649 2.57514 10.9949 2.38421 10.9949 2.19842C10.9949 1.41499 10.367 0.787136 9.57866 0.787136C9.2823 0.787136 8.94095 0.882493 8.75002 1.05328C8.66452 1.13364 8.61438 1.21914 8.61438 1.32456C8.61438 1.40985 8.65959 1.49021 8.73995 1.55042L10.4225 2.82114C10.4928 2.87642 10.5481 2.88649 10.6233 2.88649ZM2.29616 11.0579C2.3326 11.095 2.37617 11.1245 2.42426 11.1445C2.47235 11.1644 2.52398 11.1744 2.57604 11.174C2.62811 11.1735 2.67954 11.1625 2.72726 11.1417C2.77497 11.1208 2.81799 11.0906 2.85373 11.0527L3.64723 10.2641C4.47304 10.8747 5.47303 11.204 6.50002 11.2036C7.56973 11.2036 8.55416 10.8521 9.35259 10.2646L10.1463 11.0531C10.3019 11.2139 10.5481 11.2139 10.6987 11.0581C10.8444 10.9124 10.8494 10.6664 10.6936 10.5155L9.9303 9.75714C10.8107 8.86264 11.3032 7.65734 11.3013 6.40228C11.3013 3.75028 9.1518 1.59564 6.50002 1.59564C3.84823 1.59564 1.69873 3.75028 1.69873 6.40206C1.69732 7.65607 2.1878 8.8606 3.0648 9.75692L2.3013 10.5155C2.15066 10.6661 2.15066 10.9119 2.29638 11.0576M6.50002 10.3447C4.3203 10.3447 2.55245 8.58178 2.55245 6.40206C2.55245 4.22749 4.3203 2.45964 6.50002 2.45964C8.67459 2.45964 10.4375 4.22749 10.4375 6.40206C10.4375 8.58178 8.67459 10.3447 6.50002 10.3447ZM4.21488 6.95471H6.49488C6.69095 6.95471 6.84652 6.80385 6.84652 6.60799V3.56449C6.8468 3.51826 6.83791 3.47244 6.82035 3.42967C6.80279 3.38691 6.77691 3.34805 6.74422 3.31536C6.71153 3.28267 6.67268 3.2568 6.62991 3.23924C6.58715 3.22168 6.54132 3.21278 6.49509 3.21306C6.29902 3.21306 6.14838 3.36864 6.14838 3.56449V6.25635H4.21488C4.01388 6.25635 3.86345 6.41214 3.86345 6.60778C3.86345 6.80385 4.01388 6.95471 4.21488 6.95471Z" fill="#012340" fillOpacity="0.6" />
                                                            </svg>
                                                        </span>

                                                    )}

                                                </div>


                                                <div className="relative inline-block text-xs">
                                                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                        <button onClick={() => toggleDropdownPropriete(task.taskId)} type="button" className={`inline-flex items-center pl-1 pr-1 py-1 text-[9px] font-medium text-center text-gray-900 bg-white  `} aria-haspopup="true" aria-expanded={openPropriete === task.taskId ? 'true' : 'false'} style={{ position: 'relative', backgroundColor: `${task.prioColor}20`, color: task.prioColor }} >
                                                            <span className={`text-[${task.prioColor}] whitespace-nowrap`}> {task.taskPriority} </span>
                                                            <svg width="13" height="13" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M16.59 8.79492L12 13.3749L7.41 8.79492L6 10.2049L12 16.2049L18 10.2049L16.59 8.79492Z" fill={task.prioColor} />
                                                            </svg>
                                                        </button>
                                                        ) :
                                                        <button  type="button" className={`inline-flex items-center pl-1 pr-1 py-1 text-[9px] font-medium text-center text-gray-900 bg-white  `} aria-haspopup="true" aria-expanded={openPropriete === task.taskId ? 'true' : 'false'} style={{ position: 'relative', backgroundColor: `${task.prioColor}20`, color: task.prioColor }} >
                                                            <span className={`text-[${task.prioColor}] whitespace-nowrap`}> {task.taskPriority} </span>
                                                        </button>
                                                    }

                                                    {/* Dropdown menu */}
                                                    {openPropriete === task.taskId && (
                                                        <div className={`z-50 origin-top-left absolute right-0 mt-2 w-40 px-5 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`} role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton">
                                                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                                {priorities.map((priority, idx) => (
                                                                <li key={idx} className="border-b border-[#f0f0f0] last:border-b-0 cursor-pointer">
                                                                    <a onClick={() => { OnSelectedPriority(task.taskId,priority) }} className="cursor-pointer flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                        <span>  {priority} </span>
                                                                    </a>
                                                                </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                        <div className="absolute  -bottom-7 left-0 right-0 flex items-center justify-center ">
                                                <div className="flex items-center space-x-5">

                                                    <button onClick={() => handlePageChangeTermines(currentPageTermines - 1)} disabled={currentPageTermines === 1} className="flex items-center justify-center w-13 h-13 bg-white border border-white rounded-full shadow-md hover:bg-gray-100 transition">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59L11.1249 12L15.7049 7.41Z" fill="#F27F1B"/>
                                                        </svg>
                                                    </button>
                                                    

                                                    <button onClick={() => handlePageChangeTermines(currentPageTermines + 1)} disabled={paginatedTasksTermines.length < itemsPerPageTermines} className="flex items-center justify-center w-13 h-13 bg-white border border-white rounded-full shadow-md hover:bg-gray-100 transition">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.70492 6L8.29492 7.41L12.8749 12L8.29492 16.59L9.70492 18L15.7049 12L9.70492 6Z" fill="#F27F1B"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                        </div>

                                </div>
                            ) : (
                            <NoteFound />

                            )}

                        </div>
                    </div>

            </div>

            <ActionModal
                buttonColor="#D32F2F"
                actionMessage={actionMessage}
                onDeleteMessage="OUI,VALIDER"
                onCloseMessage="ANNULER"
                id={idtaches}
                onDelete={(id) => { handleDeleteTask(idtaches); }}
                isOpen={isModalOpen}
                onClose={closeModal}/>

            <ValidateModal
                buttonColor="#D32F2F"
                actionMessage={actionMessage}
                onDeleteMessage={deleteMessage}
                onCloseMessage="ANNULER"
                id={idtaches}
                actions={position}
                states={StateSelecte}
                onDelete={() => { initchangeTaskState(idtaches,position); }}
                isOpen={isValidateModalOpen}
                onClose={closeModal}/>

            <AddTaskAlerteModal
                codes={id}
                taskId={idTask}
                dates={dates}
                buttonColor="#D32F2F"
                actionMessage="ALERTE" // Message de confirmation
                onDeleteMessage="VALIDER" // Texte du bouton de suppression
                onCloseMessage="ANNULER" // Texte du bouton d'annulation
                idModale="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                fetchTaskDetail={fetchProjectDetails} // Fonction appelée lors de la suppression
                getTaskByProjectId={getTaskByProjectId} // Fonction appelée lors de la suppression
                isOpen={isModalOpenAlert} // État d'ouverture du modal
                onClose={closeModalAlert} />

        </>

    );
};

export default TaskCard;
