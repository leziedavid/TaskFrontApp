"use client";

import React, { useEffect, useState } from 'react'
import Pagination from '@/app/components/Pagination/Pagination';
import TablePreloader from '@/app/components/Preloader/TablePreloader';
import TableProject from '@/app/components/tabs/projetTabs';
import ProjetCard from '@/app/components/tabs/projetCard';
import SelectState from '@/app/components/Select2/SelectState';
import SelectPriorite from '@/app/components/Select2/SelectPriorite';
import SelectDepartment from '@/app/components/Select2/SelectDepartment';
import SelectAllUsers from '@/app/components/Select2/SelectAllUsers';
import PercentageSelect from '@/app/components/Select2/PercentageSelect';

import Image from 'next/image';
import DataNotFound from '@/app/components/error/DataNotFound';
import { getAllProjects, getFilteredProjects, projectsStatistics } from '@/app/services/ProjectService';
import { getProjectState } from '@/app/services/getStatistique';
import { Toaster } from 'react-hot-toast';
import { Project } from '@/app/interfaces/Global';
import { Department } from '@/app/interfaces/Department';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10; // Nombre de trajets par page
export default function Page() {
    const router = useRouter();
    const [authorisation, setAuthorisation] = useState<string | null>(null);
    useEffect(() => {
        const auth = localStorage.getItem('authorisation');
        setAuthorisation(auth);
    }, []);

    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE); // Taille de la page
    const [response, setResponse] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Champs de recherche
    const [numeroCommande, setNumeroCommande] = useState<string>('');
    const [dateCreation, setDateCreation] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    const [activeItem, setActiveItem] = useState(0);

    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [Priority, setPriority] = useState("");
    const [departments, setDepartment] = useState("");
    const [state, setState] = useState("");
    const [users, setUsers] = useState<number[]>([]);

    const [sliderValue, setSliderValue] = useState(0);
    const [dataDepartment, setDataDepartment] = useState<Department[]>([]);
    const [placeholder1, setPlaceholder1] = useState("Sélectionnez un statut");
    const [placeholder2, setPlaceholder2] = useState("Sélectionnez une priorité");
    const [prioColor, SetPrioColor] = useState("");


    const [modes, setMode] = useState("Module");
    const [sortBy, setSortBy] = useState<string>('projectCreatedAt');
    const [totalPages, setTotalPages] = useState<number>(1);

    const [selectedInterval, setSelectedInterval] = useState<string>('0-10');
    const [selectedValue, setSelectedValue] = useState<number>(0);


    const navigateTo = (path: string) => {
        router.push(path);
    };

    // Donn"es statistique

    const [completedProjects, SetCompletedProjects] = useState("");
    const [inProgressProjects, SetInProgressProjects] = useState("");
    const [pendingProjects, SetPendingProjects] = useState("");
    const [totalProjects, SetTotalProjects] = useState("");
    // const authorisation = localStorage.getItem('authorisation');

    const handleSliderChange = (value: number) => setSliderValue(value);
    const handleIntervalChange = (interval: string) => {
        setSelectedInterval(interval);
        console.log('Intervalle sélectionné:', interval);
    };

    const fetchFilteredProjects = async () => {
        setLoading(true);
        try {
            const apiResponse = await getFilteredProjects(
                Priority,
                state,
                departments ? parseInt(departments) : undefined,
                users.length > 0 ? users : undefined,
                selectedInterval,
                dateDebut,
                dateFin,
                currentPage,
                pageSize
            );

            if (apiResponse && apiResponse.data) {
                setResponse(apiResponse.data.projects);
                setTotal(apiResponse.data.totalElements);
                // setResponse(apiResponse.data);

            } else {
                setResponse([]);
            }
        } catch (error) {
            console.error('Error fetching filtered projects:', error);
            setResponse([]);

        } finally {
            setLoading(false);
        }
    };

    const handleFilterClick = () => {
        setCurrentPage(1);
        fetchFilteredProjects();
    };

    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        fetchAllProject();
        fetchProjectsSate();
        setIsOpen(!isOpen);
    };

    const handleItemClick = (index: number) => {
        setActiveItem(index);
    };

    const selecteModes = (value: string) => {
        console.log(value);
        setMode(value);
        localStorage.setItem('mode', value);
    };

    const fetchProjectsSate = async () => {
        setLoading(true);
        try {
            const response = await getProjectState();

            if (response && response.data) {
                SetCompletedProjects(response.data.totalProjectsCompleted);
                SetInProgressProjects(response.data.totalProjectsInProgress);
                SetPendingProjects(response.data.totalProjectsPending);
                SetTotalProjects(response.data.totalProjects);

            }

        } catch (error) {

        } finally {
            setLoading(false);
        }
    };



    const fetchAllProject = async () => {
        try {
            setLoading(true);
            const res = await getAllProjects(currentPage, pageSize);
            if (res && res.data) {
                setResponse(res.data.projects);
                setTotal(res.data.totalElements);
            } else {
                setResponse([]);
            }
        } catch (err) {
            console.error('Error fetching trajets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProject();
        fetchProjectsSate();
    }, [currentPage, pageSize]);


    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Liste des projtes { users} </h1>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-2">

                <div className="border-stroke py-3 dark:border-strokedark sm:px-6 xl:px-7.5 flex justify-between items-center">
                    <nav>
                        <ol className="flex flex-wrap items-center gap-3">
                            <li style={activeItem === 0 ? { borderBottom: '2px solid white ' } : {}}>
                                <button className="flex items-center gap-3 font-medium" onClick={() => handleItemClick(0)}>
                                    <span className="hover:text-black font-medium text-sm">TOUS</span>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#000000] mb-1">
                                        <span className="text-sm font-medium text-white">{totalProjects}</span>
                                    </div>
                                </button>
                            </li>
                            {/* Répétez pour les autres éléments de la liste */}
                            <li style={activeItem === 1 ? { borderBottom: '2px solid white ' } : {}}>
                                <button className="flex items-center gap-3 font-medium" onClick={() => handleItemClick(1)}>
                                    <span className="hover:text-black text-sm font-medium">EN COURS</span>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D96941] mb-1">
                                        <span className="text-sm font-medium text-white">{inProgressProjects}</span>
                                    </div>
                                </button>
                            </li>
                            <li style={activeItem === 2 ? { borderBottom: '2px solid white ' } : {}}>
                                <button className="flex items-center gap-3 font-medium" onClick={() => handleItemClick(2)}>
                                    <span className="hover:text-black text-sm font-medium">EN ATTENTES</span>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#033F73] mb-1">
                                        <span className="text-sm font-medium text-white">{pendingProjects}</span>
                                    </div>
                                </button>
                            </li>
                            <li style={activeItem === 3 ? { borderBottom: '2px solid white ' } : {}}>
                                <button className="flex items-center gap-3 font-medium" onClick={() => handleItemClick(3)}>
                                    <span className="hover:text-black text-sm font-medium">TERMINES</span>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2E5902] mb-1">
                                        <span className="text-sm font-medium text-white">{completedProjects}</span>
                                    </div>
                                </button>
                            </li>
                        </ol>
                    </nav>

                    {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                        <button
                            onClick={() => navigateTo(`/admin/projet/new-project`)}
                            className="flex items-center text-white rounded-lg bg-[#012340] py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            type="button"
                        >
                            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path>
                            </svg>
                            <span className="text-sm font-medium">AJOUTER UN PROJET</span>
                        </button>
                    ) : null}
                </div>

                <div className="mt-3">

                    <div className="flex justify-between items-end mb-4">

                        <button onClick={toggleDropdown} className={`flex space-x-2 justify-center rounded-lg border border-[#012340] py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white
                            ${isOpen ? 'bg-[#012340]' : 'bg-white'}`}
                            type="button" >
                            <svg className='mt-1' width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {isOpen ? (
                                    <path d="M7 12H11V10H7V12ZM0 0V2H18V0H0ZM3 7H15V5H3V7Z" fill="white" fillOpacity="0.6" />
                                ) : (
                                    <path d="M7 12H11V10H7V12ZM0 0V2H18V0H0ZM3 7H15V5H3V7Z" fill="black" fillOpacity="0.6" />
                                )}
                            </svg>

                            <span className={` text-sm font-medium ${isOpen ? 'text-white' : ''}`}> FILTRE</span>
                        </button>

                        {modes == "Liste" ? (

                            <button onClick={() => selecteModes('Module')} className=" border shadow-sm flex flex-row space-x-2 py-3 px-3 border-stroke bg-white rounded-lg  text-title-lg   text-black dark:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 15H20V13H4V15ZM4 19H20V17H4V19ZM4 11H20V9H4V11ZM4 5V7H20V5H4Z" fill="#F27F1B" fillOpacity="0.38" />
                                </svg>
                                <span className="text-sm font-medium"> LISTE</span>
                            </button>

                        ) : (

                            <button onClick={() => selecteModes('Liste')} className=" border  shadow-sm flex flex-row space-x-2 py-3 px-3 border-stroke bg-white rounded-lg  text-title-lg   text-black dark:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V9C3 9.39782 3.15804 9.77936 3.43934 10.0607C3.72064 10.342 4.10218 10.5 4.5 10.5H9C9.39782 10.5 9.77936 10.342 10.0607 10.0607C10.342 9.77936 10.5 9.39782 10.5 9V4.5C10.5 4.10218 10.342 3.72064 10.0607 3.43934C9.77936 3.15804 9.39782 3 9 3ZM9 9H4.5V4.5H9V9ZM19.5 3H15C14.6022 3 14.2206 3.15804 13.9393 3.43934C13.658 3.72064 13.5 4.10218 13.5 4.5V9C13.5 9.39782 13.658 9.77936 13.9393 10.0607C14.2206 10.342 14.6022 10.5 15 10.5H19.5C19.8978 10.5 20.2794 10.342 20.5607 10.0607C20.842 9.77936 21 9.39782 21 9V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM19.5 9H15V4.5H19.5V9ZM9 13.5H4.5C4.10218 13.5 3.72064 13.658 3.43934 13.9393C3.15804 14.2206 3 14.6022 3 15V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H9C9.39782 21 9.77936 20.842 10.0607 20.5607C10.342 20.2794 10.5 19.8978 10.5 19.5V15C10.5 14.6022 10.342 14.2206 10.0607 13.9393C9.77936 13.658 9.39782 13.5 9 13.5ZM9 19.5H4.5V15H9V19.5ZM19.5 13.5H15C14.6022 13.5 14.2206 13.658 13.9393 13.9393C13.658 14.2206 13.5 14.6022 13.5 15V19.5C13.5 19.8978 13.658 20.2794 13.9393 20.5607C14.2206 20.842 14.6022 21 15 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V15C21 14.6022 20.842 14.2206 20.5607 13.9393C20.2794 13.658 19.8978 13.5 19.5 13.5ZM19.5 19.5H15V15H19.5V19.5Z" fill="#F27F1B" />
                                </svg>
                                <span className="text-sm font-medium"> MODULE </span>
                            </button>
                        )}

                    </div>

                    {isOpen && (
                    
                        <div className="mb-4 p-4 border rounded-lg shadow-sm">

                            <h2 className="text-lg font-semibold mb-2">Filtre sur les projets</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">

                                <SelectState placeholder2={placeholder2} setState={setState} defaultDisabled={false} stateValue={''} />
                                <SelectPriorite placeholder1={placeholder1} setPriority={setPriority} SetPrioColor={SetPrioColor} priorityValue={''} />

                                <SelectDepartment setDepartment={setDepartment} departments={dataDepartment} />
                                <SelectAllUsers setUsers={setUsers} departementId={departments ? parseInt(departments) : undefined} />
                                <PercentageSelect value={selectedInterval} onChange={handleIntervalChange} />

                            </div>

                            <div className="flex justify-end gap-4"> {/* Ajustez la valeur ici pour plus d'espace */}
                                <button
                                    onClick={toggleDropdown}
                                    className="flex justify-center rounded-lg border border-[#012340] py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                    type="button"
                                >
                                    ANNULER
                                </button>
                                <button
                                    onClick={handleFilterClick}
                                    className="flex justify-center text-white rounded-lg bg-[#012340] py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                    type="button"
                                >
                                    FILTRER
                                </button>
                            </div>


                        </div>
                        
                    )}

                    <div className="mb-4 p-4 border rounded-lg ">

                        {loading ? (

                            <>
                                <div className="mx-4 lg:mx-auto max-w-5xl py-7">
                                    <TablePreloader />
                                </div>
                            </>

                        ) : (


                            <div>
                                {response && response.length ? (

                                modes === 'Liste' ? (
                                    <TableProject response={response} fetchProjects={fetchAllProject} />
                                ) : (
                                    <ProjetCard response={response} fetchProjects={fetchAllProject} />
                                )

                                ) : (
                                    <DataNotFound />
                                )}

                                {response && response.length ? (
                                    <Pagination
                                        currentPage={currentPage}
                                        pageSize={pageSize}
                                        total={total || 0}
                                        onPageChange={setCurrentPage}
                                        onPageSizeChange={setPageSize}
                                    />

                                ) : null}

                            </div>

                        )}

                    </div>
                    

                </div>

            </div>

        </>

    )
}
