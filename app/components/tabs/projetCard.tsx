"use client";

import React, { useCallback,useEffect, useState } from 'react'
import ActionModal from '../Modal/ActionModal';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { changePriority, changeState, deleteProject } from '../../services/ProjectService';
import DateConverter from '../DateConverter';
import { Project } from '../../interfaces/Global';
import toast, { Toaster } from 'react-hot-toast';
import {formatDate} from '../../services/DateUtils';
import { useRouter } from 'next/navigation';
import UserListeModal from '../Modal/UserListeModal';
import SkillBar from '../Select2/SkillBar';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
import NoteFound from '../error/NoteFound';


interface ProjectProps {
    response: Project[] | []; // Utilisation de l'interface Project pour le tableau de projets
    fetchProjects: () => void;
}

const ProjetCard: React.FC<ProjectProps> = ({ response, fetchProjects }) => {

    const authorisation = localStorage.getItem('authorisation');
    const router = useRouter();

    const [openProjectId, setOpenProjectId] = useState<number | null>(null);
    const [openState, setOpenState] = useState<number | null>(null);
    const [selectedStates, setSelectedStates] = useState<string>('');
    const states = ['EN_COURS', 'EN_ATTENTE', 'TERMINER'];
    const [openPropriete, setOpenPropriete] = useState<number | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const priorities = ['MOYENNE', 'FAIBLE', 'ELEVEE'];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [projectIdToDelete, setProjectIdToDelete] = useState<number | null>(null);
    const [responses, setResponses] = useState<BaseResponse<Project> | null>(null);
    const [selectedColors, setSelectedColors] = useState<string>('');


    const [projectsId, setProjectsId] = useState<number | null>(null);
    const [projectsCode, setProjectsCode] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const toggleDropdown = (projectId: number) => {
        setOpenProjectId(openProjectId === projectId ? null : projectId);
    };

    const toggleDropdownState = (projectId: number) => {
        setOpenState(openState === projectId ? null : projectId);
    };

    const toggleDropdownPropriete = (projectId: number) => {
        setOpenPropriete(openPropriete === projectId ? null : projectId);
    };

    const formatProjectState = (state: string): string => {
        return state.replace('_', ' ');
    };

    const SelectedState = (id: number,state:string) => {
        setId(id);
        setSelectedStates(state);
                
        if (state === "EN_COURS") {
            setSelectedColors('#038C4C');
        } else if (state === "EN_ATTENTE") {
            setSelectedColors('#F27F1B');
        } else if (state === "TERMINER") {
            setSelectedColors('#012340');
        }
    };

    const SelectedOpPriority = (id: number,priority :string) => {
        setId(id);
        setSelectedPriority(priority);
        if (priority === "ELEVEE") {
            setSelectedColors('#033F73');
        } else if (priority === "MOYENNE") {
            setSelectedColors('#F27F1B');
        } else if (priority === "FAIBLE") {
            setSelectedColors('#F27F1B');
        }
    };

    const openModal = (id: number,codes:string) => {
        setId(id);
        setProjectsCode(codes);
        setProjectsId(id);
        setIsModalOpen(true);
        setModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalOpen(false);

    };

    const handleDeleteProject = async (idprojet: number | null) => {
        try {
            if (idprojet) {
                const apiResponse = await deleteProject(idprojet);
                setResponses(apiResponse);
                if (apiResponse && apiResponse.code === 200) {
                    toast.success("Projet supprimé avec succès !");
                    fetchProjects(); // Récupération des projets après suppression
                } else {
                    toast.error("Erreur lors de la suppression du projet. Veuillez réessayer.");
                }
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du projet :', error);
            toast.error("Erreur lors de la connexion. Veuillez réessayer.");
        }
        closeModal();
    };

    const changeProjectPriority = async () => {
    
        try {
            if (id) {
                const apiResponse = await changePriority(id, selectedPriority, selectedColors);
                setResponses(apiResponse);
                if (apiResponse && apiResponse.code === 200) {
                    toast.success("Priorité mise à jour avec succès !");
                    fetchProjects();
                } else {
                    toast.error("Erreur lors de la mise à jour de la priorité. Veuillez réessayer");
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la priorité :', error);
            toast.error("Erreur lors de la mise à jour de la priorité. Veuillez vérifier votre connexion.");
        }
    };
    
    const changeStateProject = async () => {

    
        try {
            if (id) {
                const apiResponse = await changeState(id, selectedStates, selectedColors);
                setResponses(apiResponse);
                if (apiResponse && apiResponse.code === 200) {
                    toast.success("Statut mis à jour avec succès!");
                    fetchProjects();
                } else {
                    toast.error("Erreur lors de la mise à jour du statut. Veuillez réessayer");
                }
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            toast.error("Erreur lors de la mise à jour du statut. Veuillez vérifier votre connexion.");
        }
    };
    
    useEffect(() => {
        if (selectedPriority) {
            changeProjectPriority();
        }
    }, [selectedPriority]); // On appelle changeProjectPriority uniquement lors de la modification de selectedPriority
    
    useEffect(() => {
        if (selectedStates) {
            changeStateProject();
        }
    }, [selectedStates]); // On appelle changeStateProject uniquement lors de la modification de selectedStates
    

    const openModalUsers = (id: number,codes:string) => {
        setId(id);
        setProjectsCode(codes);
        setProjectsId(id);
        setModalOpen(true);
    };



    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            
            <section className="container px-0 mx-aut">

                <div className=" p-0 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">

                    {response && response.length > 0 ? (

                        response.map((project, index) => (

                            <div key={project.projectId} className="rounded-xl border border-stroke bg-white  dark:border-strokedark dark:bg-boxdark">

                                <div className="p-3">

                                    <div className="flex justify-between gap-3 mb-4">
                                        <div className='space-x-4'>
                                            {/* Premier boutton */}

                                            <div className="relative inline-block sm:text-[5px] text-left">

                                                <button
                                                    onClick={() => toggleDropdownPropriete(project.projectId)}
                                                    type="button"
                                                    className={`inline-flex self-center items-center pl-1 pr-1 py-1 sm:text-[10px] text-sm font-medium text-center text-gray-900 bg-white rounded border-[1.5px] border-[${project.prioColor}]`}
                                                    aria-haspopup="true" aria-expanded={openPropriete === project.projectId ? 'true' : 'false'}
                                                    style={{ position: 'relative', borderColor: project.prioColor, color: project.prioColor }}>

                                                    <span className={`text-[${project.prioColor}] sm:text-[10px]  whitespace-nowrap`}> PRIORITE {project.projectPriority} </span>
                                                    <svg width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.59 8.79492L12 13.3749L7.41 8.79492L6 10.2049L12 16.2049L18 10.2049L16.59 8.79492Z"  fill={project.prioColor} />
                                                    </svg>
                                                </button>

                                                {openPropriete === project.projectId && (
                                                    // bottom-0
                                                    <div
                                                        className={`z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'left-full top-0' : 'left-full'} mt-2 w-40 px-5 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                        role="menu"
                                                        aria-orientation="vertical"
                                                        aria-labelledby="dropdownMenuIconButton"
                                                        style={{ position: 'absolute' }}>

                                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">

                                                            {priorities.map((priority, idx) => (

                                                                <li key={idx} className="border-b border-[#f0f0f0] last:border-b-0">
                                                                    <a onClick={() => { SelectedOpPriority(project.projectId ,priority) }} href="#" className="cursor-pointer  space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                        <span>  {priority} </span>
                                                                    </a>
                                                                </li>

                                                            ))}

                                                        </ul>
                                                    </div>
                                                )}
                                                
                                            </div>

                                            {/* deuxieme boutton */}

                                            <div className="relative inline-block text-left">

                                                <button
                                                    onClick={() => toggleDropdownState(project.projectId)}
                                                    type="button"
                                                    className={`space-x-1 inline-flex self-center items-center sm:text-[10px] p-1 text-sm font-medium text-center text-gray-900 bg-white rounded`}
                                                    aria-haspopup="true" aria-expanded={openState === project.projectId ? 'true' : 'false'}
                                                    style={{ position: 'relative' }}>

                                                    <div className={`w-2.5 h-2.5 bg-[${project.stateColor}] rounded-full`}> </div>

                                                    <span className={`sm:text-[10px]  whitespace-nowrap`}> {formatProjectState(project.projectState)} </span>

                                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.59 8.79492L12 13.3749L7.41 8.79492L6 10.2049L12 16.2049L18 10.2049L16.59 8.79492Z" fill="#E3E3E3" />
                                                    </svg>
                                                </button>

                                                {openState === project.projectId && (

                                                    <div
                                                        className={` z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'right-full top-0' : 'right-full bottom-0'} mt-2 w-40 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                        role="menu"
                                                        aria-orientation="vertical"
                                                        aria-labelledby="dropdownMenuIconButton"
                                                        style={{ position: 'absolute' }}>

                                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">

                                                            {states.map((state, idx) => (
                                                                <li key={idx} className="border-b border-[#f0f0f0] last:border-b-0">
                                                                    <a onClick={() => { SelectedState(project.projectId,state) }} href="#" className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                        <span>  {formatProjectState(state)} </span>
                                                                    </a>
                                                                </li>
                                                            ))}

                                                        </ul>
                                                    </div>
                                                )}

                                            </div>

                                        </div>
                                        {/* Dernier bouton */}

                                        <div className="relative inline-block text-left">
                                        
                                            <button
                                                onClick={() => toggleDropdown(project.projectId)}
                                                type="button"
                                                className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900  rounded-lg"
                                                aria-haspopup="true"
                                                aria-expanded={openProjectId === project.projectId ? 'true' : 'false'}
                                                style={{ position: 'relative' }}
                                            >
                                                <svg
                                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 4 15"
                                                >
                                                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                                </svg>
                                            </button>

                                            {openProjectId === project.projectId && (
                                                
                                                <div
                                                    className={`z-50 origin-top-left absolute ${index === 0 || index === 1 ? 'right-full top-0' : 'right-full top-0'} mt-2 w-40 rounded-lg shadow-lg bg-white divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600`}
                                                    role="menu" aria-orientation="vertical" aria-labelledby="dropdownMenuIconButton" style={{ position: 'absolute' }}>

                                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">

                                                        <li className="border-b border-[#f0f0f0] last:border-b-0 cursor-pointer hover:underline">
                                                            <a onClick={() => navigateTo(`/admin/projet/new-project/${project.projectCodes}`)}  className="cursor-pointer hover:underline space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                    <span>
                                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M12.6666 13.3336H3.33329C3.15648 13.3336 2.98691 13.4038 2.86188 13.5288C2.73686 13.6538 2.66662 13.8234 2.66662 14.0002C2.66662 14.177 2.73686 14.3466 2.86188 14.4716C2.98691 14.5967 3.15648 14.6669 3.33329 14.6669H12.6666C12.8434 14.6669 13.013 14.5967 13.138 14.4716C13.263 14.3466 13.3333 14.177 13.3333 14.0002C13.3333 13.8234 13.263 13.6538 13.138 13.5288C13.013 13.4038 12.8434 13.3336 12.6666 13.3336ZM3.33329 12.0002H3.39329L6.17329 11.7469C6.47782 11.7166 6.76264 11.5824 6.97995 11.3669L12.98 5.3669C13.2128 5.12088 13.3387 4.79257 13.3299 4.45392C13.3212 4.11527 13.1786 3.7939 12.9333 3.56023L11.1066 1.73356C10.8682 1.50963 10.5558 1.38114 10.2288 1.37253C9.90187 1.36393 9.58314 1.47581 9.33329 1.6869L3.33329 7.6869C3.1178 7.90421 2.98362 8.18903 2.95329 8.49356L2.66662 11.2736C2.65764 11.3712 2.67031 11.4696 2.70373 11.5618C2.73715 11.654 2.79049 11.7377 2.85995 11.8069C2.92225 11.8687 2.99612 11.9176 3.07735 11.9507C3.15857 11.9839 3.24555 12.0007 3.33329 12.0002ZM10.18 2.6669L12 4.4869L10.6666 5.7869L8.87995 4.00023L10.18 2.6669Z" fill="#033F73" />
                                                                        </svg>

                                                                    </span>
                                                                    <span> Modifier </span>
                                                            </a>
                                                        </li>


                                                        <li className="border-b border-[#f0f0f0] last:border-b-0 cursor-pointer hover:underline">
                                                        <a onClick={() => navigateTo(`/admin/projet/${project.projectCodes}`)} className=" cursor-pointer hover:underline space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                <span>
                                                                    <svg className="" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M14.3626 7.36301C14.5653 7.64701 14.6666 7.78967 14.6666 7.99967C14.6666 8.21034 14.5653 8.35234 14.3626 8.63634C13.4519 9.91367 11.1259 12.6663 7.99992 12.6663C4.87325 12.6663 2.54792 9.91301 1.63725 8.63634C1.43459 8.35234 1.33325 8.20967 1.33325 7.99967C1.33325 7.78901 1.43459 7.64701 1.63725 7.36301C2.54792 6.08567 4.87392 3.33301 7.99992 3.33301C11.1266 3.33301 13.4519 6.08634 14.3626 7.36301Z" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                        <path d="M10 8C10 7.46957 9.78929 6.96086 9.41421 6.58579C9.03914 6.21071 8.53043 6 8 6C7.46957 6 6.96086 6.21071 6.58579 6.58579C6.21071 6.96086 6 7.46957 6 8C6 8.53043 6.21071 9.03914 6.58579 9.41421C6.96086 9.78929 7.46957 10 8 10C8.53043 10 9.03914 9.78929 9.41421 9.41421C9.78929 9.03914 10 8.53043 10 8Z" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                    </svg>
                                                                </span>
                                                                <span> Detail</span>
                                                            </a>
                                                        </li>

                                                        <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                            <a href="#" className="space-x-2 flex px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer hover:underline">
                                                                <span>
                                                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M7.25006 10C6.97939 10 6.76672 9.78 6.76672 9.5V2.5C6.76672 2.22 6.97939 2 7.25006 2C7.52072 2 7.73339 2.22 7.73339 2.5V9.5C7.73339 9.78 7.52072 10 7.25006 10Z" fill="#038C4C" />
                                                                        <path d="M7.25001 15.0002C3.78934 15.0002 0.966675 12.1802 0.966675 8.72015C0.966675 6.31015 2.37801 4.08015 4.56267 3.04015C4.80434 2.93015 5.09434 3.04015 5.20068 3.29015C5.30701 3.54015 5.20068 3.84015 4.95901 3.95015C3.11267 4.82015 1.92367 6.69015 1.92367 8.72015C1.92367 11.6302 4.31134 14.0002 7.24034 14.0002C10.1693 14.0002 12.557 11.6302 12.557 8.72015C12.557 6.70015 11.368 4.82015 9.52168 3.95015C9.40519 3.89559 9.31436 3.79549 9.26906 3.67179C9.22377 3.54809 9.2277 3.41086 9.28001 3.29015C9.38634 3.04015 9.67634 2.93015 9.91801 3.04015C12.1027 4.07015 13.514 6.30015 13.514 8.72015C13.514 12.1802 10.6913 15.0002 7.23067 15.0002H7.25001Z" fill="#038C4C" />
                                                                    </svg>

                                                                </span>
                                                                <span> Démarrer </span>
                                                            </a>
                                                        </li>

                                                        <li className="border-b border-[#f0f0f0] last:border-b-0">
                                                            <a onClick={() => openModal(project.projectId,project.projectCodes)} className="space-x-2 flex px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                                                                <span>
                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M4.00004 12.6667C4.00004 13.4 4.60004 14 5.33337 14H10.6667C11.4 14 12 13.4 12 12.6667V4.66667H4.00004V12.6667ZM12.6667 2.66667H10.3334L9.66671 2H6.33337L5.66671 2.66667H3.33337V4H12.6667V2.66667Z" fill="#C62828" />
                                                                    </svg>
                                                                </span>
                                                                <span> Supprimer </span>
                                                            </a>
                                                        </li>

                                                    </ul>
                                                </div>
                                            )}

                                        </div>

                                    </div>

                                        <div className="flex items-center text-[14px] md:text-[16px] mb-1">
                                            <div className="relative flex items-center">
                                                <div className="border-l-4 border-blue-900 h-full absolute left-0"></div>
                                                <div className={`border-l-4 h-full absolute left-0 bg-${project.prioColor}`} style={{ color: project.prioColor }}></div>

                                                <div className="flex flex-col items-start pl-4 cursor-pointer hover:underline">

                                                    <a onClick={() => navigateTo(`/admin/projet/${project.projectCodes}`)} >
                                                        <p className="mb-3 text-[14px] md:text-[14px] font-medium text-black dark:text-white dark:hover:text-primary">
                                                            {project.projectName}
                                                        </p>
                                                    </a>

                                                </div>
                                                
                                            </div>
                                        </div>

                                        <p className='mb-2'>

                                            <div className="flex justify-between items-center mb-2">
                                                {/* Div à gauche */}
                                                <div className="flex items-center">
                                                    <h3 className="pl-0 text-[14px] md:text-[15px] font-semibold text-black dark:text-white">{project.progress} %</h3>
                                                </div>

                                                <div className="flex pl-3 md:pl-10 lg:pl-20 xl:pl-30 cursor-pointer hover:underline">
                                                    <UserIcon  onClick={() => openModalUsers(project.projectId,project.projectCodes)}  className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                    <UserIcon  onClick={() => openModalUsers(project.projectId,project.projectCodes)}  className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                                </div>
                                                
                                            </div>

                                            <SkillBar level={project.progress} color="#038C4C" />
                                        </p>

                                        <div className="flex items-center">

                                            <span  className=" whitespace-nowrap inline-block bg-gray-200 rounded-full px-0 font-semibold text-gray-700 mr-2 mb-0 text-[12px] md:text-[10px]">
                                                <svg width="18" height="18" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block align-middle">
                                                    <path d="M9 6H6.5V8.5H9V6ZM8.5 0.5V1.5H4.5V0.5H3.5V1.5H3C2.445 1.5 2.005 1.95 2.005 2.5L2 9.5C2 10.05 2.445 10.5 3 10.5H10C10.55 10.5 11 10.05 11 9.5V2.5C11 1.95 10.55 1.5 10 1.5H9.5V0.5H8.5ZM10 9.5H3V4H10V9.5Z" fill="black" fillOpacity="0.56" />
                                                </svg>
                                                <DateConverter dateStr={project.projectStartDate}/> au <DateConverter dateStr={project.projectEndDate}/>
                                            </span>

                                            <span className="inline-block bg-gray-200 rounded-md shadow-sm px-5 py-1 font-semibold text-gray-700 mr-0 mb-0 text-[8px] md:text-[10px]">
                                                {project.projectNombreJours} Jours
                                            </span>
                                        </div>

                                </div>

                            </div>

                        ))

                    ) : (

                        <NoteFound />
                    )}

                </div>

            </section>

                <ActionModal
                    buttonColor="#D32F2F"
                    actionMessage=" Êtes-vous sûr de vouloir supprimer ce projet ?"
                    onDeleteMessage="OUI, SUPPRIMER"
                    onCloseMessage="ANNULER"
                    id={id}
                    onDelete={() => { handleDeleteProject(id); }}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />

            <UserListeModal
                isOpen={modalOpen}
                onClose={closeModal}
                title="Liste des membres du projet"
                id={projectsCode}
                onAccept={() => { }}
                onDecline={() => { }}
            />
    
        </>
    );
};

export default ProjetCard;

