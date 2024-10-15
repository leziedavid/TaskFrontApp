"use client";

import React, { useEffect, useState } from 'react'

import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { Project } from '@/app/interfaces/Global';
import { useRouter,useParams } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';
import QuillEditor from '@/app/components/QuillEditor';
import TableUsersSelecte from '@/app/components/tabs/TableUsersSelecte';

import {differenceInDays } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

import { BaseResponse } from '@/app/interfaces/ApiResponse';
import { Donnees } from '@/app/interfaces/Donnees';
import { FileObject } from '@/app/interfaces/FileObject';
import { Users } from '@/app/interfaces/Users';
import { UserState } from '@/app/interfaces/UserState';
// import { Project } from '@/app/interfaces/Projects';

import { getProjectByCodes, SaveProject, updateProject } from '@/app/services/ProjectService';
import { getUserIdFromToken } from '@/app/services/ApiService';
import { Department } from '@/app/interfaces/Department';
import SelectMultipleDepartment from '@/app/components/Select2/SelectMultipleDepartment';
import SelectUsersFilter from '@/app/components/Select2/SelectUsersFilter';
import SelectPriorite2 from '@/app/components/Select2/SelectPriorite2';
import SelectState2 from '@/app/components/Select2/SelectState2';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';

const PAGE_SIZE = 8; // Nombre de trajets par page
export default function Page() {

    const router = useRouter();
    const navigateTo = (path: string) => {
        router.push(path);
    };

    const [libelle, setLibelle] = useState('');
    const [nbDay, setNbDay] = useState<string>('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [description, setDescription] = useState('');
    const [Priority, setPriority] = useState('');
    const [state, setState] = useState('EN_ATTENTE');
    const [Department, setDepartment] = useState('');
    const [Users, setUsers] = useState<string[]>([]);
    const [userid, setUserid] = useState(localStorage.getItem('token'));
    const [Tablegenerate, setTablegenerate] = useState<Users[]>([]);
    const [DataGenerated, setDataGenerated] = useState<UserState>({ usersId: [], leaderId: 0 });
    const [Load, SetLoad] = useState(false);
    const [titles, setTitles] = useState('');
    const [placeholder1, setPlaceholder1] = useState('Selectionnez la priorité');
    const [placeholder2, setPlaceholder2] = useState('Selectionnez le status');
    const [demarrer, setDemarrer] = useState('EN_ATTENTE');
    const [stateColor, SetStateColor] = useState('#2196F3');
    const [prioColor, SetPrioColor] = useState('#F27F1B');

    const { id } = useParams<{ id: string }>();
    const [response, setResponse] = useState<BaseResponse<Donnees> | null>(null);
    const [apiRes, setApiRes] = useState<Project | null>(null);


    // Utilisation de useState pour stocker l'ID de l'utilisateur
    const [userId, setUserId] = useState<number | null>(null);
    // Appel du service pour récupérer l'ID de l'utilisateur à partir du token
    const fetchUserId = async () => {

                try {
                    
                    const token = localStorage.getItem('token');
                    if (token) {
                        const response = await getUserIdFromToken(token);
    
                        if (response.code === 200 && response.data) {
    
                            setUserId(response.data);
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
        fetchUserId(); // Appel de la fonction au montage du composant
    }, []); // Le tableau vide [] assure que useEffect ne se déclenche qu'une fois, équivalent à componentDidMount

    const projectByCodes = async (code: string) => {
        try {
            const res = await getProjectByCodes(code);
            const datas = res.data;
            setApiRes(datas);

            // Met à jour les états avec les données du projet
            setLibelle(datas.projectName);
            setNbDay(datas.projectNombreJours);
            setDateDebut(datas.projectStartDate);
            setDateFin(datas.projectEndDate);
            setDescription(datas.projectDescription);
            setPriority(datas.projectPriority);
            setState(datas.projectState);
            // Met à jour d'autres états nécessaires comme couleur, etc.
            SetPrioColor(datas.prioColor);
            SetStateColor(datas.stateColor);
            // Met à jour d'autres états selon les besoins
        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    };

    useEffect(() => {
        projectByCodes(id!);
    }, [id]);

    const calculateDaysDifference = (date1: string, date2: string): string => {
        const parsedDate1 = parseISO(date1);
        const parsedDate2 = parseISO(date2);
        const daysDifference = differenceInDays(parsedDate2, parsedDate1) + 1;
        return daysDifference.toString();
    };

    useEffect(() => {
        // Calculer le nombre de jours si les dates de début et de fin sont définies
        if (dateDebut && dateFin) {
            const daysDifference = calculateDaysDifference(dateDebut, dateFin);
            setNbDay(daysDifference);
        }
    }, [dateDebut, dateFin]);

    const handleOuiClick = () => {
        setDemarrer('EN_COURS');
        setState('EN_COURS');
        SetStateColor('#038C4C');
    };

    const handleNonClick = () => {
        setDemarrer('EN_ATTENTE');
        setState('EN_ATTENTE');
        SetStateColor('#2196F3');
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append('projectName', libelle);
            formData.append('projectPriority', Priority);
            formData.append('projectStartDate', dateDebut);
            formData.append('projectEndDate', dateFin);
            formData.append('projectDescription', description);
            formData.append('projectState', state);
            formData.append('projectNombreJours', nbDay);
            formData.append('prioColor', prioColor);
            formData.append('stateColor', stateColor);
            formData.append('progress', '0');
            formData.append('userId', userId!.toString());

            const response = await updateProject(id!, formData);
            toast.success("Projet mis à jour avec succès");
            if(response){
                projectByCodes(id!);
            }
            setTimeout(() => {
                router.push("/admin/projet");
            }, 3000);

        } catch (error) {
            toast.error('Erreur lors de la mise à jour du projet :');
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className=" bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className=" mb-10 col-span-5 xl:col-span-3">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h1 className="text-2xl font-semibold text-gray-900">Modifier les informatios sur le projet : {libelle}</h1>
                        </div>

                        <div className="p-7">
                        
                        <div className=" bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                            <div className=" mb-10 col-span-5 xl:col-span-3">
                                <div className=" bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                                    <div className="p-7">
                                        <form>

                                            <div className="mb-5">
                                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username"> Nom du projet  <span className="text-red-700"> * </span> </label>
                                                <input value={libelle} onChange={(event) => { setLibelle(event.target.value); }}
                                                    className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                    type="text"
                                                    name="Libelet"
                                                    placeholder="Saisir le nom du projet"
                                                />
                                            </div>

                                            <div className="mb-5">
                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Priorité <span className="text-red-700"> * </span> </label>
                                                <SelectPriorite2
                                                    placeholder1={placeholder1}
                                                    setPriority={setPriority}
                                                    SetPrioColor={SetPrioColor}
                                                    priorityValue={Priority}
                                                />
                                            </div>

                                            <div className="mb-5">
                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Status <span className="text-red-700"> * </span> </label>
                                                <SelectState2 placeholder2={placeholder2} setState={setState}   defaultDisabled={false} stateValue={state} />
                                            </div>

                                            <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">
                                                <div className="w-full sm:w-1/2">
                                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de debut <span className="text-red-700"> * </span> </label>
                                                    <div className="relative">
                                                        <input
                                                            className=" px-2 w-full rounded border border-stroke py-2 pl-11.5 pr-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                            type="datetime-local"
                                                            value={dateDebut}
                                                            onChange={(e) => setDateDebut(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="w-full sm:w-1/2">
                                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de fin <span className="text-red-700"> * </span> </label>
                                                    <input
                                                        className=" px-2 w-full rounded border border-stroke py-2 px-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                        type="datetime-local"
                                                        value={dateFin}
                                                        onChange={(e) => setDateFin(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {nbDay ? (
                                                <div className="mb-5">
                                                    <p>La durée estimée de ce projet est de {nbDay} Jours</p>
                                                </div>
                                            ) : (
                                                <div className="mb-5"> </div>
                                            )}

                                            <div className="mb-5">
                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Description <span className="text-red-700"> * </span> </label>
                                                <QuillEditor value={description} onChange={setDescription} />
                                            </div>

                                                <div className="flex justify-end gap-4.5 space-x-2">
                                                    <button
                                                        className="flex justify-center rounded-lg border border-[#012340] py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                                        onClick={() => navigateTo(`/admin/projet`)}
                                                        type="button"
                                                    >
                                                        ANNULER
                                                    </button>
                                                    <button onClick={handleSubmit}  className="flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90" type="button">
                                                        MODIFIER
                                                    </button>
                                                </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </div>

                    </div>
                </div>
            </div>

        </>

    )
}
