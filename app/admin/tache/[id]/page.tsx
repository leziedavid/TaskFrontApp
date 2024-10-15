
"use client";

import { BaseResponse } from '@/app/interfaces/ApiResponse';
import { fetchTaskDetails } from '@/app/services/TaskService';
import { ArrowDown, Clock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import AddActionModal from '@/app/components/Modal/AddActionModal';
import AddObsModal from '@/app/components/Modal/AddObsModal';
import AddTaskUserModal from '@/app/components/Modal/AddTaskUserModal';
import DeleteActionModal from '@/app/components/Modal/DeleteActionModal';
import { TaskDetailsDTO } from '@/app/interfaces/ModelsTask';
import { removeAction, updateActionStatus } from '@/app/services/TaskActionServices';
import { removeObs } from '@/app/services/TaskObsServices';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
import DateConverter from '@/app/components/DateConverter';
import { formatDate } from '@/app/services/DateUtils';
import ToggleSwitch from '@/app/components/ToggleSwitch/ToggleSwitch';
import DataNotFound from '@/app/components/error/DataNotFound';


interface ApiResulte {
    code: number;
    data: string;
    message: string;
    }


export default function Page() {


    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const [response, setResponse] = useState<TaskDetailsDTO | null>(null);
    const [apiRes, setApiRes] = useState<BaseResponse<ApiResulte> | null>(null);

    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('styled-settings');
    const [idProject, setIdProject] = useState(Number);
    const [startDate, setStartDate] = useState('');
    const [EndDate, setEndDate] = useState('');
    const [isdisabled, setIsdisabled] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [taskId, setTaskId] = useState(Number);
    const [actionId, setActionId] = useState(Number);
    const [obsId, setObsId] = useState(Number);
    const [otherUser, setOtherUser] = useState(Number);
    const [isUser, setIsUser] = useState(Number);
    
    const [actionMessage, setActionMessage] = useState('');
    const [onDeleteMessage, setOnDeleteMessage] = useState('');

    const [isModalOpens, setIsModalOpens] = useState(false);
    const [isopenActionSup, setIspenActionSup] = useState(false);

    const [actionSup, setActionDelete] = useState(false);
    const [supObs, setObsDelete] = useState(false);

    const [isModalOpenObs, setIsModalOpenObs] = useState(false);
    const [isModalOpenActions, setIsModalOpenActions] = useState(false);

    const authorisation = localStorage.getItem('authorisation');

    const closeModalObs = () => {
        setIsModalOpenObs(false);
        setObsId(0);
    };

    const closeModalActions = () => {
        setIsModalOpenActions(false);
        setActionId(0);
    };

    const openObsSup = (idObs: number,) => {
        setIspenActionSup(true);
        setObsId(idObs);
        setObsDelete(true);
        setActionMessage('Êtes-vous sûr de vouloir supprimer cette observation ?');
        setOnDeleteMessage('OUI, SUPPRIMER');
    };
    
    const openActionSup = (idActions: number,) => {
        setIspenActionSup(true);
        setActionId(idActions);
        setObsDelete(true);
        setActionMessage('Êtes-vous sûr de vouloir supprimer cette action ?');
        setOnDeleteMessage('OUI, SUPPRIMER');
    };

    const openActionEdit = (idActions: number, idTask: number, projectId: number, StartDate: string, EndDate: string) => {
        setIsdisabled(false);
        setIsShow(false);
        setActionId(idActions);
        setTaskId(idTask);
        setStartDate(StartDate);
        setEndDate(EndDate);
        setIdProject(projectId);
        setIsModalOpenActions(true);
        setActionMessage("MODIFICATION DE L'ACTION SUR CETTE TACHE");
        setOnDeleteMessage('MODIFIER');
    };

    const openActionShow = (idActions: number, idTask: number, projectId: number, StartDate: string, EndDate: string) => {
        setIsdisabled(true);
        setIsShow(true);
        setActionId(idActions);
        setTaskId(idTask);
        setStartDate(StartDate);
        setEndDate(EndDate);
        setIdProject(projectId);
        setIsModalOpenActions(true);
        setActionMessage("DETAIL");
        setOnDeleteMessage('');
    };

    const openModalObsShow = (obsIds: number, idTask: number, projectId: number) => {
        setIsShow(true);
        setObsId(obsIds);
        setTaskId(idTask);
        setIdProject(projectId);
        setIsModalOpenObs(true);
        setIsdisabled(true);
        setActionMessage("DETAIL");
        setOnDeleteMessage('');
    };

    const handleDeleteAction = async () => {

        try {
            const res = await removeAction(actionId!);
            if (res.code === 200) {
                toast.success(res.messages);
                setIspenActionSup(false);
                fetchTaskDetail(id!);
            } else {
                toast.success("erueur verifier votre connexion");
            }
        } catch (error) {
            toast.error('Failed to remove action');
        }
    }

    const handleDeleteObs = async () => {

        try {
            const res = await removeObs(obsId!);
            if (res.code === 200) {
                toast.success(res.messages);
                setIspenActionSup(false);
                fetchTaskDetail(id!);
            } else {
                toast.success("erueur verifier votre connexion");
            }
        } catch (error) {
            toast.error('Failed to remove observation');
        }
    }

    const openModalObs = (idTask: number, projectId: number) => {
        setTaskId(idTask);
        setIdProject(projectId);
        setIsModalOpenObs(true);
        setActionMessage("AJOUTER UNE OBSERVATION SUR CETTE TACHE");
        setOnDeleteMessage('VALIDER');
    };

    const openModalObsEdit = (obsIds: number, idTask: number, projectId: number) => {
        setIsdisabled(false);
        setIsShow(false);
        setObsId(obsIds);
        setTaskId(idTask);
        setIdProject(projectId);
        setIsModalOpenObs(true);
        setActionMessage("MODIFICATION UNE OBSERVATION SUR CETTE TACHE");
        setOnDeleteMessage('MODIFIER');
    };

    const openModalActions = (idTask: number, projectId: number, StartDate: string, EndDate: string) => {
        setIsdisabled(false);
        setIsShow(false);
        setTaskId(idTask);
        setStartDate(StartDate);
        setEndDate(EndDate);
        setIdProject(projectId);
        setIsModalOpenActions(true);
        setActionMessage('AJOUTER UNE ACTION SUR CETTE TACHE');
        setOnDeleteMessage('VALIDER');
        setActionId(0);

    };

    const closeModal = () => {
        setIsModalOpens(false);
        setIsModalOpenActions(false);
        setIspenActionSup(false);
        setIsdisabled(false);
        setIsShow(false);
    };

    const handleTabClick = (tabId: React.SetStateAction<string>) => {
        setActiveTab(tabId);
    };

    const fetchTaskDetail = async (code: string) => {
        try {
            const apiResponse = await fetchTaskDetails(code);
            setResponse(apiResponse.data);
            setOtherUser(apiResponse.data.assignedUsers[0].userId);

        } catch (error) {
            console.error('Error fetching project details:', error);
            toast.error('Failed to fetch project details');
        }
    };

    useEffect(() => {
        fetchTaskDetail(id!);
    }, [id]);


    const handleIconClick = (iconName: string) => {
        alert(`${iconName} icon clicked!`); // Remplacez par l'action souhaitée
    };

    // Fonction octetsEnMB ajustée
    const octetsEnMB = (tailleEnOctets: number): string => {
        const tailleEnMo = tailleEnOctets / (1024 * 1024);
        const tailleEnMoFormatee = tailleEnMo.toFixed(2);
        return `${tailleEnMoFormatee} MB`;
    };

    useEffect(() => {

        if (apiRes && apiRes.code == 200) {
            fetchTaskDetail(id!);
            toast.success(apiRes.messages ?? 'Message par défaut');
        } else {

        }

    }, [apiRes]);

    // Option pour le modal :
    const [isModalOpenUsers, setIsModalOpen] = useState(false);

    const openModalUsers = (idTask: number, projectId: number) => {
        setTaskId(idTask);
        setIdProject(projectId);
        setIsModalOpen(true);
    };

    const closeModalUsers = () => {
        setIsModalOpen(false);
    };

    // Fonction de troncature
    const truncateDescription = (description: string, maxLength: number = 20): string => {

        if (description.length > maxLength) {
            return `${description.substring(0, maxLength)}...`;
        }
        return description;
    };

    const handleCheckboxChange = async (actionId: number, currentValue: number) => {

        const newValue = currentValue === 0 ? 1 : 0;
        if (id !== undefined) {
            const res = await updateActionStatus(actionId, newValue, id);
            if (res.code === 200) {
                toast.success(res.messages ?? 'Message par défaut');
            }
            setResponse(prev => prev ? {
                ...prev, actions: prev.actions.map(action => action.actionId === actionId ? { ...action, isValides: newValue } : action)
            } : null);
        } else {
            console.error("id is undefined");
        }
    };

    const handleDelete = () => {

        if (actionId > 0) {
            handleDeleteAction();
            setObsId(0);
        }
        if(obsId > 0) {
            handleDeleteObs();
            setActionId(0);
        }
    };


    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="min-h-full">
                
                <main className="py-10 px-2">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Détail sur la tache</h1>
                </div>

                    <div className="mt-8 grid grid-cols-1 gap-6  lg:grid-cols-2 mb-8">

                        <div className="space-y-6">

                            <section aria-labelledby="applicant-information-title">
                                <div className="bg-white shadow sm:rounded-lg">

                                    <div className="px-4 py-5 sm:px-6">

                                    </div>

                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">

                                    {response ? (

                                        <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-4 pb-4">

                                                <section className="bg-white dark:bg-gray-900">

                                                    <div className="container px-0 py-0 mx-auto">

                                                        <div className="mb-3 text-[20px] mt-5">
                                                            <input disabled value={response.tasks[0]?.taskName} className=" mb-5 bg-white text-[25px] font-bold w-full rounded-lg border border-stroke py-1 px-2 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text" name="Libelet" placeholder="" />
                                                            <div className=" mb-3 w-full rounded border border-stroke px-3 py-10 pl-11.5 pr-4.5 text-black focus-visible:outline-none dark:border-strokedark  dark:text-white dark:focus:border-black" dangerouslySetInnerHTML={{ __html: response.tasks[0]?.taskDescription }}></div>
                                                        </div>


                                                        <label className="mb-4 block text-lg font-medium text-black dark:text-white">DETAILS</label>
                                                        <hr className="border-gray-900 my-6" />

                                                        <div className="relative mb-3">

                                                            {response && response.assignedUsers.length > 0 ? (

                                                                response.assignedUsers.map((user, index) => (
                                                                    <>
                                                                        <div className="flex items-center space-x-2 rounded-lg border border-stroke p-2">
                                                                            <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                                            <span> {user.firstname} {user.lastname}  </span>
                                                                        </div>
                                                                    </>
                                                                ))

                                                            ) : (
                                                                <span> {response.tasks[0]?.taskNombreJours} </span>
                                                            )}

                                                            {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
                                                                    <button onClick={() => openModalUsers(response.tasks[0]?.taskId, response.tasks[0]?.projectId)} type="button" className="inline-flex w-full px-1 py-1 rounded-lg border border-black text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                                                                        <div className="inline-flex items-center">
                                                                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M2.74905 13.4394V16.2519H5.56155L13.8566 7.95687L11.0441 5.14438L2.74905 13.4394ZM16.0316 5.78188C16.3241 5.48938 16.3241 5.01688 16.0316 4.72438L14.2766 2.96937C13.9841 2.67688 13.5116 2.67688 13.2191 2.96937L11.8466 4.34187L14.6591 7.15438L16.0316 5.78188Z" fill="#012340" />
                                                                            </svg>
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            ) : null}

                                                        </div>

                                                        <div className="flex flex-wrap justify-between gap-2">

                                                            <div>

                                                                <a className="block" href="">
                                                                    Date de creation :
                                                                </a>

                                                            </div>

                                                            <div className="" >

                                                                <a className="block" href="">
                                                                    Modifier le :
                                                                </a>
                                                            </div>

                                                        </div>

                                                        <div className="flex flex-wrap justify-between gap-2 mb-3">

                                                            <div>
                                                                <span className="mt-1.5 block">
                                                                    <span className="font-medium text-black dark:text-white">
                                                                        <DateConverter dateStr={response.tasks[0]?.taskCreatedAt} />
                                                                    </span>
                                                                </span>
                                                            </div>

                                                            <div className="" >
                                                                <span className="mt-1.5 block">
                                                                    <span className="font-medium text-black dark:text-white">
                                                                        <DateConverter dateStr={response.tasks[0]?.taskUpdatedAt} />
                                                                    </span>
                                                                </span>
                                                            </div>

                                                        </div>


                                                        <div className="mb-4 flex flex-col-6 gap-2 xl:flex-row xl:items-start">

                                                            <div className="w-full xl:w-1/2 flex-2">
                                                                <label className="mb-2 block text-black dark:text-white">Date de Debut :</label>
                                                                <span className="text-lg rounded-lg border border-stroke py-2 px-2 text-black text-right">
                                                                    <DateConverter dateStr={response.tasks[0]?.taskStartDate} />
                                                                </span>
                                                            </div>

                                                            <div className="w-full xl:w-1/2 flex-2">
                                                                <label className="mb-2 block text-black dark:text-white">Date de fin :</label>
                                                                <span className="text-lg rounded-lg border border-stroke py-2 px-2 text-black text-left">
                                                                    <DateConverter dateStr={response.tasks[0]?.taskEndDate} />
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-5">
                                                            <label className="mb-2.5 block text-black dark:text-white">Temps</label>
                                                            <input disabled value={response.tasks[0]?.taskNombreHeurs} className=" bg-white text-lg w-full rounded-lg border border-stroke py-2 px-4 text-black " />
                                                        </div>

                                                        <div className="mb-5">
                                                            <label className="mb-2.5 block text-black dark:text-white">Nombre de jour</label>
                                                            <input disabled value={response.tasks[0]?.taskNombreJours} className=" bg-white text-lg w-full rounded-lg border border-stroke py-2 px-4 text-black " />
                                                        </div>

                                                    </div>

                                                </section>

                                        </div>

                                        ) : (
                                        
                                        <DataNotFound />
                                        )}

                                    </div>

                                </div>
                            </section>

                        </div>

                        <section aria-labelledby="timeline-title" className="">

                            <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">

                                <h2 id="timeline-title" className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <Clock /> PARAMETRAGE
                                </h2>



                                {otherUser && isUser && otherUser == isUser || authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (

                                    <div className="p-6 bg-gray-100 border-[#E3E3E3] border rounded-lg dark:bg-gray-800 md:p-8">

                                        <div>
                                            <div className="mb-4  border-gray-200 dark:border-gray-700">
                                                <ul className="flex flex-wrap -mb-px text-lg font-medium text-center" id="default-styled-tab" role="tablist">

                                                    <li className="me-2" role="presentation">
                                                        <button
                                                            className={`text-sm inline-block p-4 ${activeTab === 'styled-settings' ? 'border-b-2 border-[#012340] text-[#012340] hover:text-[#012340] dark:text-gray-900 dark:hover:text-gray-900' : 'hover:text-gray-600 dark:hover:text-gray-300'}`}
                                                            id="settings-styled-tab"
                                                            onClick={() => handleTabClick('styled-settings')}
                                                            type="button">
                                                            ACTIONS
                                                        </button>


                                                    </li>
                                                    <li className="me-2" role="presentation">
                                                        <button className={`text-sm inline-block p-4 ${activeTab === 'styled-dashboard' ? 'border-b-2 border-[#012340] text-[#012340] hover:text-[#012340] dark:text-gray-900 dark:hover:text-gray-900' : 'hover:text-gray-600 dark:hover:text-gray-300'}`} id="dashboard-styled-tab" onClick={() => handleTabClick('styled-dashboard')} type="button" role="tab" aria-controls="dashboard" aria-selected={activeTab === 'styled-dashboard' ? 'true' : 'false'}>OBSERVATIONS</button>
                                                    </li>

                                                </ul>
                                            </div>

                                            <div id="default-styled-tab-content">

                                                <div className={`p-4 ${activeTab === 'styled-dashboard' ? 'block' : 'hidden'} rounded-lg bg-gray-50 dark:bg-gray-800`} id="styled-dashboard" role="tabpanel" aria-labelledby="dashboard-tab">

                                                    <p className="text-sm text-gray-500 dark:text-gray-400">

                                                        <div className="flex justify-end gap-4.5">

                                                            <button
                                                                onClick={() => {
                                                                    if (response) {
                                                                        openModalObs(response.tasks[0]?.taskId, response.tasks[0]?.projectId);
                                                                    }
                                                                }}
                                                                className="mb-2 flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90"
                                                                type="button"
                                                            >
                                                                + OBSERVATION
                                                            </button>

                                                        </div>

                                                        <div className="overflow-x-auto">
                                                        {response && response.observations.length > 0 ? (

                                                            <table className="font-inter whitespace-nowrap uppercase  w-full table-auto border-separate border-spacing-y-1 overflow-scroll text-left md:overflow-auto">

                                                                <thead className="w-full rounded-lg bg-[#ffffff] text-base font-semibold text-white">
                                                                    <tr>
                                                                        <th className="whitespace-nowrap py-3 px-3 text-[15px] font-bold text-[#212B36]">Libelle</th>
                                                                        <th className="whitespace-nowrap py-3 px-3 text-[15px] font-bold text-[#212B36]">Description</th>
                                                                        <th className="whitespace-nowrap py-3 text-[15px] font-bold text-[#212B36]">Action</th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                            
                                                                {response.observations.map((obs, index) => (

                                                                            <tr key={obs.observationId} className="cursor-pointer bg-white drop-shadow-sm hover:shadow-lg">
                                                                                <td className="whitespace-nowrap py-3 text-[#000000] px-3 text-[15px] font-normal">{obs.libelle}</td>
                                                                                <td className="whitespace-nowrap px-3 text-[#000000] py-3 text-[15px] font-normal ">
                                                                                    <div className="flex items-center">
                                                                                        <span className="mr-2">
                                                                                            <DateConverter dateStr={obs.observationCreatedAt} /> -
                                                                                        </span>
                                                                                        <div dangerouslySetInnerHTML={{ __html: truncateDescription(obs.description) }} />
                                                                                    </div>
                                                                                </td>

                                                                                <td className="whitespace-nowrap px-3 text-[#000000] py-3 flex items-center justify-center space-x-2">
                                                                                    <button onClick={() => openModalObsEdit(obs.observationId, response.tasks[0]?.taskId, response.tasks[0]?.projectId)} className="focus:outline-none" aria-label="Icon 1">
                                                                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M3.49878 17.7505V21.5005H7.24878L18.3088 10.4405L14.5588 6.69055L3.49878 17.7505ZM21.2088 7.54055C21.5988 7.15055 21.5988 6.52055 21.2088 6.13055L18.8688 3.79055C18.4788 3.40055 17.8488 3.40055 17.4588 3.79055L15.6288 5.62055L19.3788 9.37055L21.2088 7.54055Z" fill="#003D63" />
                                                                                        </svg>
                                                                                    </button>
                                                                                    <button onClick={() => openObsSup(obs.observationId)} className="focus:outline-none" aria-label="Icon 2">
                                                                                        <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M1.5 16.5C1.5 17.6 2.4 18.5 3.5 18.5H11.5C12.6 18.5 13.5 17.6 13.5 16.5V4.5H1.5V16.5ZM14.5 1.5H11L10 0.5H5L4 1.5H0.5V3.5H14.5V1.5Z" fill="#C62828" />
                                                                                        </svg>
                                                                                    </button>
                                                                                    <button onClick={() => openModalObsShow(obs.observationId, response.tasks[0]?.taskId, response.tasks[0]?.projectId)} className="focus:outline-none" aria-label="Icon 3" >
                                                                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M12.5 9.5C11.7044 9.5 10.9413 9.81607 10.3787 10.3787C9.81607 10.9413 9.5 11.7044 9.5 12.5C9.5 13.2956 9.81607 14.0587 10.3787 14.6213C10.9413 15.1839 11.7044 15.5 12.5 15.5C13.2956 15.5 14.0587 15.1839 14.6213 14.6213C15.1839 14.0587 15.5 13.2956 15.5 12.5C15.5 11.7044 15.1839 10.9413 14.6213 10.3787C14.0587 9.81607 13.2956 9.5 12.5 9.5ZM12.5 17.5C11.1739 17.5 9.90215 16.9732 8.96447 16.0355C8.02678 15.0979 7.5 13.8261 7.5 12.5C7.5 11.1739 8.02678 9.90215 8.96447 8.96447C9.90215 8.02678 11.1739 7.5 12.5 7.5C13.8261 7.5 15.0979 8.02678 16.0355 8.96447C16.9732 9.90215 17.5 11.1739 17.5 12.5C17.5 13.8261 16.9732 15.0979 16.0355 16.0355C15.0979 16.9732 13.8261 17.5 12.5 17.5ZM12.5 5C7.5 5 3.23 8.11 1.5 12.5C3.23 16.89 7.5 20 12.5 20C17.5 20 21.77 16.89 23.5 12.5C21.77 8.11 17.5 5 12.5 5Z" fill="black" />
                                                                                        </svg>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                ))}


                                                                </tbody>
                                                            </table>


                                                            ) : (
                                                                <DataNotFound />
                                                            )}


                                                        </div>

                                                        {response && response.observations.length > 0 ? (
                                                            <a onClick={() => navigateTo(`/admin/tache/new-/${id}`)} type="button" className="flex items-center justify-center w-full text-white bg-[#012340] hover:bg-[#012340] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#012340] dark:hover:bg-[#012340] focus:outline-none dark:focus:ring-[#012340]">
                                                                <span className="mr-2">VOIR PLUS</span>
                                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12.5 4.5L11.09 5.91L16.67 11.5H4.5V13.5H16.67L11.09 19.09L12.5 20.5L20.5 12.5L12.5 4.5Z" fill="white" />
                                                                </svg>
                                                            </a>
                                                        ) : null}

                                                    </p>

                                                </div>

                                                <div className={`p-4 ${activeTab === 'styled-settings' ? 'block' : 'hidden'} rounded-lg bg-gray-50 dark:bg-gray-800`} id="styled-settings" role="tabpanel" aria-labelledby="settings-tab">

                                                    <p className="text-sm text-gray-500 dark:text-gray-400">

                                                        <div className="flex justify-end gap-4.5">

                                                            <button
                                                                onClick={() => {
                                                                    const taskId = response?.tasks[0]?.taskId;
                                                                    const projectId = response?.tasks[0]?.projectId;
                                                                    const taskStartDate = response?.tasks[0]?.taskStartDate;
                                                                    const taskEndDate = response?.tasks[0]?.taskEndDate;
                                                                    if (taskId && projectId && taskStartDate && taskEndDate) {
                                                                        openModalActions(taskId, projectId, taskStartDate, taskEndDate);
                                                                    }
                                                                }}
                                                                className="mb-2 flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90"
                                                                type="button"
                                                            >
                                                                + ACTION
                                                            </button>

                                                        </div>

                                                        <div className="overflow-x-auto">

                                                        {response && response.actions.length > 0 ? (

                                                            <table className="font-inter w-full table-auto border-separate border-spacing-y-1 overflow-scroll text-left md:overflow-auto">
                                                                <thead className="whitespace-nowrap uppercase w-full rounded-lg bg-[#ffffff] text-base font-semibold text-white">
                                                                    <tr>
                                                                        <th className="whitespace-nowrap py-3 px-3 text-sm  text-[#212B36]">Date et Heures de debut</th>
                                                                        <th className="whitespace-nowrap py-3 px-3 text-sm  text-[#212B36]">Libelle</th>
                                                                        <th className="whitespace-nowrap py-3 px-3 text-sm  text-[#212B36]">Status</th>
                                                                        <th className="whitespace-nowrap py-3 text-sm   text-[#212B36] ">Action</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>

                                                                        {response.actions.map((action, index) => (

                                                                            <tr key={index} className="cursor-pointer bg-white drop-shadow-sm hover:shadow-lg">
                                                                                <td className="whitespace-nowrap py-3 text-[#000000] px-3 text-[15px] font-normal">
                                                                                    {formatDate(action.actionStartDate)}
                                                                                </td>

                                                                                <td className="whitespace-nowrap px-3 text-[#000000] py-3 text-[15px] font-norma "> {action.libelle}</td>

                                                                                <td className="whitespace-nowrap px-3 text-[#000000] py-3 text-[15px] font-normal ">
                                                                                    <ToggleSwitch isChecked={action.isValides === 1} onChange={() => handleCheckboxChange(action.actionId, action.isValides)} />
                                                                                </td>

                                                                                <td className="whitespace-nowrap px-3 text-[#000000] py-3 flex space-x-2 ">

                                                                                    <button onClick={() => openActionEdit(action.actionId, response.tasks[0]?.taskId, response.tasks[0]?.projectId, response.tasks[0]?.taskStartDate, response.tasks[0]?.taskEndDate)} className="focus:outline-none" aria-label="Icon 1" >
                                                                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M3.49878 17.7505V21.5005H7.24878L18.3088 10.4405L14.5588 6.69055L3.49878 17.7505ZM21.2088 7.54055C21.5988 7.15055 21.5988 6.52055 21.2088 6.13055L18.8688 3.79055C18.4788 3.40055 17.8488 3.40055 17.4588 3.79055L15.6288 5.62055L19.3788 9.37055L21.2088 7.54055Z" fill="#003D63" />
                                                                                        </svg>
                                                                                    </button>
                                                                                    <button onClick={() => openActionSup(action.actionId)} className="focus:outline-none" aria-label="Icon 2" >
                                                                                        <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M1.5 16.5C1.5 17.6 2.4 18.5 3.5 18.5H11.5C12.6 18.5 13.5 17.6 13.5 16.5V4.5H1.5V16.5ZM14.5 1.5H11L10 0.5H5L4 1.5H0.5V3.5H14.5V1.5Z" fill="#C62828" />
                                                                                        </svg>
                                                                                    </button>
                                                                                    <button onClick={() => openActionShow(action.actionId, response.tasks[0]?.taskId, response.tasks[0]?.projectId, response.tasks[0]?.taskStartDate, response.tasks[0]?.taskEndDate)} className="focus:outline-none" aria-label="Icon 3">
                                                                                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M12.5 9.5C11.7044 9.5 10.9413 9.81607 10.3787 10.3787C9.81607 10.9413 9.5 11.7044 9.5 12.5C9.5 13.2956 9.81607 14.0587 10.3787 14.6213C10.9413 15.1839 11.7044 15.5 12.5 15.5C13.2956 15.5 14.0587 15.1839 14.6213 14.6213C15.1839 14.0587 15.5 13.2956 15.5 12.5C15.5 11.7044 15.1839 10.9413 14.6213 10.3787C14.0587 9.81607 13.2956 9.5 12.5 9.5ZM12.5 17.5C11.1739 17.5 9.90215 16.9732 8.96447 16.0355C8.02678 15.0979 7.5 13.8261 7.5 12.5C7.5 11.1739 8.02678 9.90215 8.96447 8.96447C9.90215 8.02678 11.1739 7.5 12.5 7.5C13.8261 7.5 15.0979 8.02678 16.0355 8.96447C16.9732 9.90215 17.5 11.1739 17.5 12.5C17.5 13.8261 16.9732 15.0979 16.0355 16.0355C15.0979 16.9732 13.8261 17.5 12.5 17.5ZM12.5 5C7.5 5 3.23 8.11 1.5 12.5C3.23 16.89 7.5 20 12.5 20C17.5 20 21.77 16.89 23.5 12.5C21.77 8.11 17.5 5 12.5 5Z" fill="black" />
                                                                                        </svg>
                                                                                    </button>
                                                                                </td>

                                                                            </tr>
                                                                        ))}

                                                                </tbody>
                                                            </table>

                                                                ) : (
                                                                    <DataNotFound />
                                                                )}
                                                        </div>

                                                        {response && response.actions.length > 0 ? (
                                                            <a onClick={() => navigateTo(`/admin/tache/new-actions/${id}`)} type="button" className="flex items-center justify-center w-full text-white bg-[#012340] hover:bg-[#012340] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 me-2 mb-2 dark:bg-[#012340] dark:hover:bg-[#012340] focus:outline-none dark:focus:ring-[#012340]">
                                                                <span className="mr-2">VOIR PLUS</span>
                                                                <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12.5 4.5L11.09 5.91L16.67 11.5H4.5V13.5H16.67L11.09 19.09L12.5 20.5L20.5 12.5L12.5 4.5Z" fill="white" />
                                                                </svg>
                                                            </a>
                                                        ) : null}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ) : null}


                                <div className="flex justify-center items-center mt-3">
                                    <div className="rounded-full bg-white p-2 drop-shadow-sm border-2 border-orange-400">
                                        <ArrowDown className="h-5 w-5" />
                                    </div>
                                </div>

                            </div>
                            
                        </section>
                        

                    </div>

                </main>
            </div>


            <DeleteActionModal
                buttonColor="#D32F2F"
                actionMessage={actionMessage}
                onDeleteMessage={onDeleteMessage}
                onCloseMessage="ANNULER"
                id={actionId}
                onDelete={handleDelete}
                // onDelete={() => { handleDeleteAction(); }}
                isOpen={isopenActionSup}
                onClose={closeModal}
            />


            <AddObsModal
                codes={id}
                id={idProject}
                taskId={taskId}
                obsId={obsId}
                isdisabled={isdisabled}
                isShow={isShow}
                buttonColor="#D32F2F"
                actionMessage={actionMessage}
                onDeleteMessage={onDeleteMessage}// Texte du bouton de suppression
                onCloseMessage="ANNULER" // Texte du bouton d'annulation
                idModale="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                fetchTaskDetails={fetchTaskDetail} // Fonction appelée lors de la suppression
                isOpen={isModalOpenObs} // État d'ouverture du modal
                onClose={closeModalObs} // Fonction de fermeture du modal
            />

            <AddActionModal
                codes={id}
                id={idProject}
                taskId={taskId}
                EndDate={EndDate}
                startDate={startDate}
                actionId={actionId}
                isdisabled={isdisabled}
                isShow={isShow}
                setIsUser={setIsUser}
                buttonColor="#D32F2F"
                actionMessage={actionMessage} // Message de confirmation
                onDeleteMessage={onDeleteMessage} // Texte du bouton de suppression
                onCloseMessage="ANNULER" // Texte du bouton d'annulation
                idModale="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                fetchTaskDetails={fetchTaskDetail} // Fonction appelée lors de la suppression
                isOpen={isModalOpenActions} // État d'ouverture du modal
                onClose={closeModalActions} // Fonction de fermeture du modal
            />

            <AddTaskUserModal
                codes={id}
                id={idProject}
                taskId={taskId}
                buttonColor="#D32F2F"
                actionMessage="ASSIGNER LA TACHE A UN AUTRE MEMBRE" // Message de confirmation
                onDeleteMessage="VALIDER" // Texte du bouton de suppression
                onCloseMessage="ANNULER" // Texte du bouton d'annulation
                idModale="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                fetchTaskDetail={fetchTaskDetail} // Fonction appelée lors de la suppression
                isOpen={isModalOpenUsers} // État d'ouverture du modal
                onClose={closeModalUsers} // Fonction de fermeture du modal
            />

        </>
        
    )
}
