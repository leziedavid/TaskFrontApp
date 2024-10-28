
"use client";

import React, { useEffect, useState } from 'react'
import { ArrowDown, ArrowLeftIcon, CheckCircle, Clock, X } from 'lucide-react';
import Image from 'next/image';
import { BaseResponse } from '@/app/interfaces/ApiResponse';
import { Task,ProjectsDetails } from '@/app/interfaces/Global';
import { useRouter,useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { getProjectDetails,removeUserFromProject ,updateGroupLeader} from '@/app/services/ProjectService';
import { getFilteredTasks, getTaskByProjectId } from '@/app/services/TaskService';
import {formatDate} from '@/app/services/DateUtils';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';

import SkillBar from '@/app/components/Select2/SkillBar';
import AddModalLeaders from '@/app/components/Modal/AddModalLeaders';
import SupUsersActionModal from '@/app/components/Modal/SupUsersActionModal';
import TaskCard from '@/app/components/tabs/TaskCard';
import ProjectStep from '@/app/components/tabs/ProjectStep';
import AddFilesCard from '@/app/components/tabs/AddFilesCard';
import SelectPriorite from '@/app/components/Select2/SelectPriorite';
import SelectOneUsers from '@/app/components/Select2/SelectOneUsers';
import DateConverter from '@/app/components/DateConverter';

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

    const [response, setResponse] = useState<ProjectsDetails | null>(null);
    const [taches, setTasks] = useState<Task[] | null>(null);
    const [apiRes, setApiRes] = useState<BaseResponse<ApiResulte> | null>(null);

    const [tasksEnCours, setTasksEnCours] = useState<Task[]>([]);
    const [tasksEnAttente, setTasksEnAttente] = useState<Task[]>([]);
    const [tasksTermines, setTasksTermines] = useState<Task[]>([]);

    const [isOpenFiltre, setIsOpenFiltre] = useState(false);
    const toggleDropdownFiltre = () => { setIsOpenFiltre(!isOpenFiltre);};

    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [Priority, setPriority] = useState("");
    const [placeholder1, setPlaceholder1] = useState("Selectionner");
    const [state, setState] = useState("");
    const [Users, setUsers] = useState('');

    const [prioColor, SetPrioColor] = useState("");
    const [StateSelecte, setStateSelecte] = useState<string>('');
    const states = ['EN COURS', 'EN ATTENTE', 'TERMINER'];

    const [authorisation, setAuthorisation] = useState<string | null>(null);
    useEffect(() => {
        const auth = localStorage.getItem('authorisation');
        setAuthorisation(auth);
    }, []);

    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('styled-steps');

    const [isModalOpens, setIsModalOpens] = useState(false);

    const openModal = () => {
        setIsModalOpens(true);
    };
    const closeModal = () => {
        setIsModalOpens(false);
    };


    const handleTabClick = (tabId: React.SetStateAction<string>) => {
        setActiveTab(tabId);
    };

    const [selectedLeaderId, setSelectedLeaderId] = useState<number | null>(null);

    const fetchProjectDetails = async (code: string) => {
        try {
            const apiResponse = await getProjectDetails(code);
            setResponse(apiResponse.data);
            setOpenfiles(false);
            if (response && response.users.length > 0) {
                const defaultLeaderId = response?.users.find(user => user.leader)?.user.userId;
                if (defaultLeaderId) {
                    setSelectedLeaderId(defaultLeaderId);
                }
            }

        } catch (error) {
            console.error('Error fetching project details:', error);
            toast.error('Failed to fetch project details');
        }
    };
    const getTaskByProjectIds = async (code: string) => {

        try {
            const apiResponse = await getTaskByProjectId(code);
            setTasks(apiResponse.data);
            setOpenfiles(false);
        } catch (error) {
            toast.error('Failed to fetch Task ');
        }
    };

    useEffect(() => {

        if (id) {
            fetchProjectDetails(id);
            getTaskByProjectIds(id);
            setOpenfiles(false);
        }
        const defaultLeaderId = response?.users.find(user => user.leader)?.user.userId;
        if (defaultLeaderId) {
            setSelectedLeaderId(defaultLeaderId);
        }


    }, [id]);

    useEffect(() => {
        const defaultLeaderId = response?.users.find(user => user.leader)?.user.userId;
        if (defaultLeaderId) {
            setSelectedLeaderId(defaultLeaderId);
        }

    }, [response?.users]);

    useEffect(() => {

        if (taches) {

            const AllTask = taches;

            console.log(taches);

            const tasksEnCoursFiltered = AllTask.filter(task => task.taskState === 'EN_COURS');
            const tasksEnAttenteFiltered = AllTask.filter(task => task.taskState === 'EN_ATTENTE');
            const tasksTerminesFiltered = AllTask.filter(task => task.taskState === 'TERMINER');

            setTasksEnCours(tasksEnCoursFiltered);
            setTasksEnAttente(tasksEnAttenteFiltered);
            setTasksTermines(tasksTerminesFiltered);
        }

    }, [taches,response]);

    const handleCheckboxChange = async (userId: number) => {
        try {

                if (selectedLeaderId === userId) {
                    setSelectedLeaderId(null);
        
                } else {
                    const previousLeaderId = selectedLeaderId || 0;
                    setSelectedLeaderId(userId);
                    if (id) {
                        const Respond = await updateGroupLeader(id, previousLeaderId, userId);
                        setApiRes(Respond);
                        updateGroupLeader(id, previousLeaderId, userId); // Mettre à jour le leader dans votre base de données
                    }

                }

        } catch (error) {
            toast.error('Failed to remove user from project');
        }
    };

    const octetsEnMB = (tailleEnOctets: number): string => {
        const tailleEnMo = tailleEnOctets / (1024 * 1024);
        const tailleEnMoFormatee = tailleEnMo.toFixed(2);
        return `${tailleEnMoFormatee} MB`;
    };

    const handleClick = async (publicId: string) => {
        const url = `${process.env.NEXT_PUBLIC_FILE_BASE_URL}/${publicId}`;
        window.open(url, '_blank');
    };
    

    const [projectId, setProjectId]= useState('');
    const [userIdToRemove, setUserIdToRemove] = useState<number | null>(null);
    const [openfiles, setOpenfiles] = useState(false);

    const initRemoveUsers = async (projectId: string,userIdToRemoveParam: number) => {
        setProjectId(projectId);
        setUserIdToRemove(userIdToRemoveParam);
        openModal();
    };

    const handleDelete = () => {
        if(userIdToRemove){
            removeUsers(projectId,userIdToRemove)
        }
    }

    const removeUsers = async (projectId: string, userIdToRemove: number) => {
        try {
            const apiRespons = await removeUserFromProject(projectId, userIdToRemove);
                setApiRes(apiRespons);
        } catch (error) {
            toast.error('Failed to remove user from project');
        }
    };

    useEffect(() => {

        if (apiRes && apiRes.code == 200) {
            if (id) {
                fetchProjectDetails(id);
                setOpenfiles(false);
            }
            toast.success(apiRes.messages ?? 'Message par défaut');

        }else {
            // toast.error("Erreur lors de la  suppression de l'utilisateur sur le projet. Veuillez réessayer");
        }

    }, [apiRes]);

    // Option pour le modal :
    const [isModalOpenUsers, setIsModalOpen] = useState(false);

    const openModalUsers = () => {

        setIsModalOpen(true);
    };

    const closeModalUsers = () => {
        setIsModalOpen(false);
    };

    const handleAddFiles = (value: number) => {
        if(value==1){
            setOpenfiles(true);
        }else{
            setOpenfiles(false);
        }
    };

    const getFilteredTask = async () => {
        try {

            const apiResponse = await getFilteredTasks(
                id,
                Priority,
                state,
                Users ? parseInt(Users) : undefined,
                dateDebut,
                dateFin
            );
            setTasks(apiResponse.data ?? null);
        
            } catch (error) {
            toast.error('Failed to fetch projects');
            setTasks(null);
        }
    };
    

    const handleFilterClick = () => {
        getFilteredTask();
    };


    const handleClickBtn = (projectStartDate: string, projectEndDate: string) => {
        localStorage.setItem('projectStartDate',projectStartDate);
        localStorage.setItem('projectEndDate',projectEndDate);
        router.push(`/admin/tache/new-tache/${id}`);
    };


    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="bg-gray-300 p-4 flex items-center">
                <a onClick={() => navigateTo(`/admin/projet`)} className="flex items-center text-black font-bold cursor-pointer hover:underline">
                    <ArrowLeftIcon className="mr-2" /> {/* Flèche à gauche du texte */}
                    Retour
                </a>
                <h1 className="ml-4 font-bold">Détail du projet</h1>
            </div>

            <div className="min-h-full">

                <main className="py-10 px-2">

                    <div className="mt-8 grid grid-cols-1 gap-6  lg:grid-cols-2 mb-8">

                        <div className="space-y-6">

                            <section aria-labelledby="applicant-information-title">
                                <div className="bg-white  sm:rounded-lg">

                                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">

                                        <div className="mb-5">
                                            <input disabled value={response?.projects?.projectName ?? ""} className="bg-white text-[25px] font-bold w-full rounded-lg border border-stroke py-1 px-2 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text" name="Libelet" placeholder="" />
                                        </div>

                                        <div dangerouslySetInnerHTML={{ __html: response?.projects?.projectDescription ?? "" }}  className="mb-5" />

                                        <label className="mb-4.5 block text-lg font-medium text-black dark:text-white">DETAILS</label>

                                        <hr className="border-gray-900 my-6" />

                                        <div className="flex flex-wrap justify-between gap-2">
                                            <div>

                                                <a className="block" href="/invoice">
                                                    Date de creation
                                                </a>

                                            </div>

                                            <div className="" >

                                                <a className="block" href="/invoice">
                                                    Modifier le :
                                                </a>
                                            </div>

                                        </div>

                                        <div className="flex flex-wrap justify-between gap-2 mb-5">

                                            <div>
                                                <span className="mt-1.5 block">
                                                    <span className="font-medium text-black dark:text-white">
                                                        <DateConverter dateStr={response?.projects?.projectCreatedAt ?? ""} />
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="" >
                                                <span className="mt-1.5 block">
                                                    <span className="font-medium text-black dark:text-white">
                                                        <DateConverter dateStr={response?.projects?.projectUpdatedAt  ?? ""} />
                                                    </span>
                                                </span>
                                            </div>


                                        </div>

                                        <div className="mb-4 flex flex-col gap-2 xl:flex-row xl:items-start">

                                            <div className="w-full xl:w-1/2 flex-1">
                                                <label className="mb-2.5 block text-black dark:text-white">Date de Debut</label>
                                                <span className="text-lg w-full rounded-lg border border-stroke py-2 px-4 text-black text-right">
                                                    <DateConverter dateStr={response?.projects?.projectStartDate  ?? ""} />
                                                </span>
                                            </div>

                                            <div className="w-full xl:w-1/2 flex-1">
                                                <label className="mb-2.5 block text-black dark:text-white">Date de fin </label>
                                                <span className="text-lg w-full rounded-lg border border-stroke py-2 px-4 text-black text-right">
                                                    <DateConverter dateStr={response?.projects?.projectEndDate  ?? ""} />
                                                </span>
                                            </div>

                                        </div>

                                        <div>

                                            <span className="mt-1.5 block mb-3">
                                                <span className="font-medium text-black dark:text-white">ESTIMATIONS ET PROGRESSION </span>
                                            </span>
                                            <hr className="border-gray-900 my-6" />

                                            <div>
                                                <p className="mb-1.5 font-medium text-black dark:text-white">Temps restant :</p>
                                                <h4 className="mb-2 text-xl font-bold text-black dark:text-white">{response?.projects?.projectNombreJours ?? ""} jours</h4>

                                            <p className="mb-1.5 font-medium text-black dark:text-white">Progression:{response?.projects?.progress} </p>
                                                <div>
                                                    <SkillBar level={response?.projects?.progress ?? 0 } color="#038C4C" />{response?.projects?.progress ?? ""} %
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </section>

                        </div>

                        <section aria-labelledby="timeline-title" className="">

                            <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">

                                <h2 id="timeline-title" className="uppercase mb-8 text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <Clock /> Options sur le projet
                                </h2>

                                <div className="mt-6 flow-root">

                                    <div className="mb-4  border-gray-200 dark:border-gray-700">
                                        <ul className="flex flex-wrap -mb-px text-lg font-medium text-center" id="default-styled-tab" role="tablist">
                                            <li className="me-2" role="presentation">
                                                <button className={`text-[12px] inline-block p-4 ${activeTab === 'styled-steps' ? 'border-b-2 border-[#012340] text-[#012340] hover:text-gray-900 dark:text-gray-900 dark:hover:text-gray-900' : 'hover:text-gray-600 dark:hover:text-gray-300'}`} id="steps-styled-tab" onClick={() => handleTabClick('styled-steps')} type="button" role="tab" aria-controls="steps" aria-selected={activeTab === 'styled-steps' ? 'true' : 'false'}>ACTIVITÉS RÉCENTE</button>
                                            </li>

                                            <li className="me-2" role="presentation">
                                                <button className={`text-[12px] inline-block p-4 ${activeTab === 'styled-profile' ? 'border-b-2 border-[#012340] text-[#012340] hover:text-gray-900 dark:text-gray-900 dark:hover:text-gray-900' : 'hover:text-gray-600 dark:hover:text-gray-300'}`} id="profile-styled-tab" onClick={() => handleTabClick('styled-profile')} type="button" role="tab" aria-controls="profile" aria-selected={activeTab === 'styled-profile' ? 'true' : 'false'}>MEMBRES</button>
                                            </li>
                                            <li className="me-2" role="presentation">
                                                <button className={`text-[12px] inline-block p-4 ${activeTab === 'styled-dashboard' ? 'border-b-2 border-[#012340] text-[#012340] hover:text-[#012340] dark:text-gray-900 dark:hover:text-gray-900' : 'hover:text-gray-600 dark:hover:text-gray-300'}`} id="dashboard-styled-tab" onClick={() => handleTabClick('styled-dashboard')} type="button" role="tab" aria-controls="dashboard" aria-selected={activeTab === 'styled-dashboard' ? 'true' : 'false'}>FICHIERS</button>
                                            </li>
                                            <li className="me-2" role="presentation">
                                                <button className={`text-[12px] inline-block p-4 ${activeTab === 'styled-settings' ? 'border-b-2 border-[#012340] text-[#012340] hover:text-[#012340] dark:text-gray-900 dark:hover:text-gray-900' : 'hover:text-gray-600 dark:hover:text-gray-300'}`} id="settings-styled-tab" onClick={() => handleTabClick('styled-settings')} type="button" role="tab" aria-controls="settings" aria-selected={activeTab === 'styled-settings' ? 'true' : 'false'}>MESSAGES</button>
                                            </li>
                                        </ul>
                                    </div>


                                    <div id="default-styled-tab-content">

                                        <div className={`p-4 ${activeTab === 'styled-steps' ? 'block' : 'hidden'} rounded-lg bg-gray-50 dark:bg-gray-800`} id="styled-steps" role="tabpanel" aria-labelledby="steps-tab">

                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                <ProjectStep fetchProjectDetails={fetchProjectDetails} id={id} />
                                            </p>

                                        </div>

                                        <div className={`p-4 ${activeTab === 'styled-profile' ? 'block' : 'hidden'} rounded-lg bg-gray-50 dark:bg-gray-800`} id="styled-profile" role="tabpanel" aria-labelledby="profile-tab">

                                            {/* Tableau des utilisateur: */}

                                            <p className="text-sm text-gray-500 dark:text-gray-400">

                                                <div className="flex justify-end gap-4.5">
                                                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                        <button onClick={() => openModalUsers()} className="mb-2 flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-gray hover:bg-opacity-90" type="button" >
                                                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M15 12.5C17.21 12.5 19 10.71 19 8.5C19 6.29 17.21 4.5 15 4.5C12.79 4.5 11 6.29 11 8.5C11 10.71 12.79 12.5 15 12.5ZM6 10.5V7.5H4V10.5H1V12.5H4V15.5H6V12.5H9V10.5H6ZM15 14.5C12.33 14.5 7 15.84 7 18.5V20.5H23V18.5C23 15.84 17.67 14.5 15 14.5Z" fill="white" />
                                                            </svg>
                                                        </button>
                                                    ) : null}
                                                </div>

                                                <div className="overflow-x-auto">
                                                    <table className="font-inter w-full table-auto border-separate border-spacing-y-1 overflow-scroll text-left md:overflow-auto">
                                                        <thead className="w-full rounded-lg bg-[#ffffff] text-base font-semibold text-white">
                                                            <tr>
                                                                <th className="whitespace-nowrap py-3 px-3 text-[14px] font-bolde text-[#212B36] text-center">Utilisateur</th>
                                                                <th className="whitespace-nowrap py-3 px-3 text-[14px] font-bolde text-[#212B36] text-center">Fonction</th>
                                                                <th className="whitespace-nowrap py-3 text-[14px] font-bolde text-[#212B36] text-center">E-mail</th>
                                                                <th className="whitespace-nowrap py-3 text-[14px] font-bolde text-[#212B36] text-center">Contact</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {response && response.users.length > 0 ? (
                                                                response.users.map((user, index) => (

                                                                    <tr key={index} className="cursor-pointer bg-white drop-shadow-sm hover:shadow-lg">
                                                                        <td className="whitespace-nowrap py-3 px-3 text-[15px] font-bolde text-gray-600 text-center">
                                                                            <div className="flex items-center">
                                                                                <button className="whitespace-nowrap h-7 w-7 border-0 border-white dark:border-boxdark">
                                                                                    <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                                                </button>
                                                                                <div className="py-3 ml-2 text-[14px] whitespace-nowrap">
                                                                                    {user.leader && (
                                                                                        <span className="px-1 py-1 mr-2 bg-green-500 text-white rounded-md text-[12px]">
                                                                                            Leader
                                                                                        </span>
                                                                                    )}
                                                                                    {user.user.firstname} - {user.user.lastname}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3  py-3 text-[14px] font-normal text-gray-600 text-center">
                                                                            {user.user.fonction}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3  py-3 text-[14px] font-normal text-gray-600 text-center">
                                                                            {user.user.email}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-3  py-3 text-[14px] font-normal text-gray-600 text-center">
                                                                            {user.user.phone}
                                                                        </td>

                                                                        <td className="whitespace-nowrap px-3 text-[#000000] py-3 flex items-center justify-center space-x-2">
                                                                            {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (

                                                                                <>
                                                                                    <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                                                                                        <input type='checkbox' name={`autoSaver-${index}`} className='sr-only' checked={selectedLeaderId === user.user.userId}
                                                                                            onChange={() => handleCheckboxChange(user.user.userId)} />
                                                                                        <span className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${selectedLeaderId === user.user.userId ? 'bg-[#038C4C]' : 'bg-[#CCCCCE]'}`}>
                                                                                            <span className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${selectedLeaderId === user.user.userId ? 'translate-x-6' : ''}`}></span>
                                                                                        </span>
                                                                                    </label>


                                                                                    <div className="inline-flex items-center gap-x-1">
                                                                                        <button type='button' onClick={() => id && initRemoveUsers(id, user.user.userId)} className="text-red-600 hover:text-red-900">
                                                                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M19.5 6.91L18.09 5.5L12.5 11.09L6.91 5.5L5.5 6.91L11.09 12.5L5.5 18.09L6.91 19.5L12.5 13.91L18.09 19.5L19.5 18.09L13.91 12.5L19.5 6.91Z" fill="black" fillOpacity="0.6" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>
                                                                                </>

                                                                            ) : null}
                                                                        </td>
                                                                    </tr>

                                                                ))

                                                            ) : (

                                                                <tr className="cursor-pointer bg-white drop-shadow-sm hover:shadow-lg">
                                                                    <td className="whitespace-nowrap px-3 py-3 flex items-center justify-center space-x-2 text-gray-600">
                                                                        Aucun utilisateur trouvé
                                                                    </td>
                                                                </tr>
                                                            )}

                                                        </tbody>
                                                    </table>
                                                </div>

                                            </p>

                                        </div>

                                        <div className={`p-4 ${activeTab === 'styled-dashboard' ? 'block' : 'hidden'} rounded-lg bg-gray-50 dark:bg-gray-800`} id="styled-dashboard" role="tabpanel" aria-labelledby="dashboard-tab">

                                            <p className="text-sm text-gray-500 dark:text-gray-400">

                                                <div className=" items-center  p-4  sm:p-6 xl:p-10">
                                                    {response && response.projects.filesData.length > 0 ? (
                                                        response.projects.filesData.map((files, index) => (

                                                            <div key={files.publicId} className="mb-5 max-w-[557px] rounded-lg bg-[#d6d8d8] border border-stroke py-4 pl-4 pr-3 dark:border-strokedark dark:bg-meta-4 sm:pl-6">
                                                                <div className="flex justify-between">

                                                                    <div onClick={() => handleClick(files.publicId)} className="flex flex-grow gap-3">

                                                                        <div>
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M13 9V3.5L18.5 9M6 2C4.89 2 4 2.89 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2H6Z" fill="#012340" />
                                                                            </svg>
                                                                        </div>
                                                                        <div>
                                                                            <div className=" text-xsm font-medium text-[#012340] dark:text-white">
                                                                                {files.title}
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                    <div className='text-center'>
                                                                        <button>
                                                                            <svg className="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M0.854423 0.85186C1.2124 0.493879 1.79281 0.493879 2.15079 0.85186L7.0026 5.70368L11.8544 0.85186C12.2124 0.493879 12.7928 0.493879 13.1508 0.85186C13.5088 1.20984 13.5088 1.79024 13.1508 2.14822L8.29897 7.00004L13.1508 11.8519C13.5088 12.2098 13.5088 12.7902 13.1508 13.1482C12.7928 13.5062 12.2124 13.5062 11.8544 13.1482L7.0026 8.2964L2.15079 13.1482C1.79281 13.5062 1.2124 13.5062 0.854423 13.1482C0.496442 12.7902 0.496442 12.2098 0.854423 11.8519L5.70624 7.00004L0.854423 2.14822C0.496442 1.79024 0.496442 1.20984 0.854423 0.85186Z" fill=""></path>
                                                                            </svg>
                                                                        </button>
                                                                        <br />
                                                                        <span className='text-box'>
                                                                            {octetsEnMB(files.size)}
                                                                        </span>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <div className="mb-5 px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap items-center">
                                                                Aucun fichier trouvé
                                                            </div>
                                                        </tr>
                                                    )}

                                                    {openfiles ? (

                                                        <div className="items-center">
                                                            <AddFilesCard id={id} fetchProjectDetails={fetchProjectDetails} />
                                                            <div className="flex items-center space-x-8 mt-8">
                                                                
                                                                <button onClick={() => handleAddFiles(0)} className="font-medium text-[#03233F] flex items-center">
                                                                    <span className="font-bold">ANNULER L&apos;OPÉRATION</span>
                                                                </button>

                                                            </div>
                                                        </div>


                                                    ) : (
                                                        <>
                                                            {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                                                <button onClick={() => handleAddFiles(1)} className="font-medium text-[#03233F] flex items-center">
                                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                                                        <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#012340" />
                                                                    </svg>
                                                                    <span className="font-bold">AJOUTER D&apos;AUTRES FICHIERS</span>
                                                                </button>

                                                            ) : null}
                                                        </>
                                                    )}
                                                </div>

                                            </p>

                                        </div>

                                        <div className={`p-4 ${activeTab === 'styled-settings' ? 'block' : 'hidden'} rounded-lg bg-gray-50 dark:bg-gray-800`} id="styled-settings" role="tabpanel" aria-labelledby="settings-tab">

                                            <p className="text-sm text-gray-500 dark:text-gray-400">


                                            </p>

                                        </div>

                                    </div>


                                </div>

                                <div className="flex justify-center items-center mt-3">
                                    <div className="rounded-full bg-white p-2 drop-shadow-sm border-2 border-orange-400">
                                        <ArrowDown className="h-5 w-5" />
                                    </div>
                                </div>

                            </div>
                            
                        </section>
                        

                    </div>
                    
                    {(authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN') && response && (
                        <div className="flex justify-end gap-4.5 mb-3">
                            <button onClick={() => handleClickBtn(response.projects?.projectStartDate, response.projects?.projectEndDate)}
                                className="flex items-center justify-center rounded-lg border bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90 cursor-pointer"
                                type="button">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                    <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="white" />
                                </svg>
                                <span>TACHE</span>
                            </button>
                        </div>
                    )}

                    <div className="mb-3 flex flex-col gap-y-4 rounded-sm border border-stroke bg-white p-1 shadow-default dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="pl-2 text-title-lg font-semibold text-black dark:text-white">Les tâches</h3>
                        </div>

                        <div className="flex flex-col gap-4 2xsm:flex-row 2xsm:items-center">

                            <div className="flex space-x-2">
                                <button className="flex flex-row space-x-2 py-4 px-1 border-stroke bg-white rounded-xl text-title-lg text-black dark:text-white">
                                    <svg className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z" fill="black"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z" fill="black"></path>
                                    </svg>
                                </button>

                                <button onClick={toggleDropdownFiltre} className={`flex flex-row space-x-2 py-3 px-3 border-stroke bg-white rounded-xl text-title-lg text-black dark:text-white ${isOpenFiltre ? 'mb-2 bg-red-800' : 'mb-0'}`}>
                                    <svg className='mt-2' width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 12H11V10H7V12ZM0 0V2H18V0H0ZM3 7H15V5H3V7Z" fill="black" fillOpacity="0.6" />
                                    </svg>
                                    <span className="text-base font-medium">FILTRE</span>
                                </button>
                            </div>

                        </div>

                    </div>


                    {isOpenFiltre && (

                        <div className="mb-8 swim-lane flex flex-col gap-5.5">
                            <div draggable="false" className=" relative  justify-between rounded-lg border border-stroke bg-white p-7 shadow-default dark:border-strokedark dark:bg-boxdark">

                                <div>
                                    <div className="mb-5 flex flex-col gap-6 xl:flex-row">

                                        <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">Priorité</label>
                                            <SelectPriorite placeholder1={placeholder1} setPriority={setPriority} SetPrioColor={SetPrioColor} priorityValue={Priority} />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">Membre {Users} </label>
                                            <SelectOneUsers activeUser={Users} codes={id!} setUsers={setUsers} />
                                        </div>


                                        <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">Date debut</label>
                                        <input type="date"  placeholder=""  value={dateDebut}
                                            onChange={(e) => setDateDebut(e.target.value)} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">Date fin</label>
                                        <input type="date"
                                            placeholder=""
                                            value={dateFin}
                                            onChange={(e) => setDateFin(e.target.value)}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" />
                                        </div>

                                    </div>
                                </div>


                                <div className="flex justify-end gap-4.5 space-x-2">
                                    <button onClick={toggleDropdownFiltre}  className="flex justify-center rounded-lg border border-[#012340] py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white" type="button" >ANNULER</button>
                                
                                    <button onClick={handleFilterClick} className="flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90" type="button" >
                                        FILTRER
                                    </button>
                                </div>

                            </div>

                        </div>

                    )}

                    <TaskCard
                            tasksEnCours={tasksEnCours}
                            tasksEnAttente={tasksEnAttente}
                            tasksTermines={tasksTermines}
                            fetchProjectDetails={fetchProjectDetails}
                            getTaskByProjectId={getTaskByProjectIds}
                            id={id}
                            UserListe={response ? response.users : []}
                        />
                    
                </main>
            </div>

            <SupUsersActionModal
                buttonColor="#D32F2F"
                actionMessage=" Êtes-vous sûr de vouloir supprimer ce utilisateur ?"
                onDeleteMessage="OUI, SUPPRIMER"
                onCloseMessage="ANNULER"
                id={projectId}
                onDelete={() => { handleDelete();}}
                isOpen={isModalOpens}
                onClose={closeModal}
            />

            <AddModalLeaders
                codes={id}
                buttonColor="#D32F2F"
                actionMessage="AJOUTER UN MEMBRE À L'ÉQUIPE" // Message de confirmation
                onDeleteMessage="VALIDER" // Texte du bouton de suppression
                onCloseMessage="ANNULER" // Texte du bouton d'annulation
                id="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                fetchProjectDetails={fetchProjectDetails} // Fonction appelée lors de la suppression
                isOpen={isModalOpenUsers} // État d'ouverture du modal
                onClose={closeModalUsers}
            />

        </>
        
    )
}
