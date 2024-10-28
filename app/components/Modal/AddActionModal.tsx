"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Users } from '../../interfaces/Users';

import {differenceInDays, parse } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

import { getUserIdFromToken } from '../../services/ApiService';
import { calculateHoursDifference, compareDateRanges } from '../../services/dateService';
import { getActionById, SaveTaskAction, updateActions } from '../../services/TaskActionServices';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('@/app/components/QuillEditor'), {ssr: false,});

import { Donnees } from '../../interfaces/Donnees';
import { useRouter,useParams } from 'next/navigation';

type AddActionModalProps = {
    buttonColor: string;
    actionMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    EndDate:string;
    startDate:string;
    id: number;
    taskId: number;
    setIsUser: React.Dispatch<React.SetStateAction<number>>; // Correction ici
    idModale: string;
    isOpen: boolean;
    onClose: () => void;
    fetchTaskDetails: (code: string) => Promise<void>;
    codes: string | undefined;
    actionId: number | undefined;
    isdisabled:  boolean;
    isShow:  boolean;
};

const AddActionModal: React.FC<AddActionModalProps> = ({
    buttonColor,
    actionMessage,
    onDeleteMessage,
    onCloseMessage,
    id,
    idModale,
    isOpen,
    onClose,
    fetchTaskDetails,
    codes,
    startDate,
    EndDate,
    taskId,
    actionId,
    isdisabled,
    isShow,
    setIsUser
    
}) => {

    const [selectedUser, setSelectedUser] = useState('');
    const [allUsers, setAllUsers] = useState<Users[] | null>(null);
    const [response, setResponse] = useState<BaseResponse<Users[]> | null>(null);
    const [data, setRes] = useState<BaseResponse<Donnees> | null>(null);

    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
    };


    const [libelle, setLibelle] = useState('');
    const [description, setDescription] = useState('');
    const [heurs, setHeurs] = useState('');
    const [nbDay, setNbDay] = useState<string>('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [msg, setMsg] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [Load, SetLoad] = useState(false);

    // const calculateDaysDifference = (date1: string, date2: string): string => {
    //     const parsedDate1 = parseISO(date1);
    //     const parsedDate2 = parseISO(date2);
    //     const daysDifference = differenceInDays(parsedDate2, parsedDate1)+1;
    //     return daysDifference.toString();
    // };


    const calculateDaysDifference = (date1: string, date2: string): string => {
        // Convertir les chaînes de caractères en objets Date
        const [day1, month1, year1] = date1.split('/').map(Number);
        const [day2, month2, year2] = date2.split('/').map(Number);
    
        // Créer des objets Date en mettant les heures à 0
        const startOfDate1 = new Date(year1, month1 - 1, day1, 0, 0, 0);
        const startOfDate2 = new Date(year2, month2 - 1, day2, 0, 0, 0);
    
        // Calcule la différence en jours
        const daysDifference = differenceInDays(startOfDate2, startOfDate1) + 1;
        return daysDifference.toString();
    };
    
    // Exemple d'utilisation
    const diff = calculateDaysDifference("25/10/2024 12:19", "26/10/2024 15:45");
    console.log(diff); // Affiche 2
    
    
    const fetchUserId = async () => {

        try {

            const token = localStorage.getItem('token');
            if (token) {

                const response = await getUserIdFromToken(token);
                if (response.code === 200 && response.data) {
                    setUserId(response.data);
                    setIsUser(response.data);

                } else {
                    // toast.error("Erreur lors de la récupération de l'ID utilisateur.");
                }
            } else {

                toast.error("Token introuvable dans le localStorage.");
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID utilisateur :', error);
            // toast.error("Erreur lors de la récupération de l'ID utilisateur.");

        }
    };

    const viders = async () => {
        setLibelle("");
        setDescription("");
        setDateDebut("");
        setDateFin("");
        setNbDay("");
        setHeurs("");
        setMsg("");
    };


    useEffect(() => {

        fetchUserId();
        viders();

        if (actionId! > 0) {
        getActionsById(actionId!)
        }

    }, [codes,actionId]);
    
    useEffect(() => {
        
        // Calculer le nombre de jours et heures si les dates de début et de fin sont définies
        if (dateDebut && dateFin) {
            const daysDifferenceString = calculateDaysDifference(dateDebut, dateFin);
            const daysDifference = Number(daysDifferenceString); // Convertir en nombre

            // Vérifier si daysDifference est négatif
            if (daysDifference < 0) {

                setNbDay(daysDifference.toString());
                setMsg("La différence de date est négative. Veuillez vérifier vos dates.");

            } else {
                setMsg("");
                setNbDay(daysDifference.toString());
            }

            const hoursDifference = calculateHoursDifference(dateDebut, dateFin);
            calculateTaskHours(dateDebut, dateFin);
            // setHeurs(hoursDifference);
        }

        // Comparer les plages de dates si toutes les dates sont définies
        if (dateDebut && dateFin && startDate && EndDate) {

            const taskDates = { start: startDate, end: EndDate };
            const actionDates = { start: dateDebut, end: dateFin };
            const { isValid, messages } = compareDateRanges(taskDates, actionDates);

            if (!isValid) {
                messages.forEach(message => setMessage(message));
                // alert(message);
            } else {
                setMessage('');
                setMsg("");
                console.log("Dates are valid, proceeding...");
            }
        }
    }, [selectedUser, dateDebut, dateFin, startDate, EndDate]);

    const getActionsById = async (actionId:number) => {

        try {

            const token = localStorage.getItem('token');
            
            if (token) {
                const response = await getActionById(actionId);
                const datas = response.data;

                if (response.code === 200 && response.data) {

                    setLibelle(datas.libelle);
                    setDescription(datas.description);
                    setDateDebut(datas.actionStartDate);
                    setDateFin(datas.actionEndDate);
                    setNbDay(datas.nombreJours);
                    setHeurs(datas.hours);

                } else {

                    toast.error("Erreur lors de la récupération de l'action.");
                }
            } else {

                toast.error("action introuvable.");
            }
        } catch (error) {

            console.error('Erreur lors de la récupération de l\'action:', error);
            toast.error("Erreur lors de la récupération de l'action.");

        }
    };

    const SaveAction = async () => {

        try {
            if (!libelle) {
                toast.error("Le nom du projet est requis.");
                return;
            }
            if (!dateDebut) {
                toast.error("La date de début est requise.");
                return;
            }
            if (!dateFin) {
                toast.error("La date de fin est requise.");
                return;
            }
            if (!description) {
                toast.error("La description est requise.");
                return;
            }
            if (!heurs) {
                toast.error("L'heurs du projet est requis.");
                return;
            }

                SetLoad(true);
                const taskData = {
                    libelle: libelle,
                    hours: heurs,
                    actionStartDate: dateDebut,
                    actionEndDate: dateFin,
                    description: description,
                    nombreJours: nbDay,
                    taskId: taskId!,
                    userId: userId!.toString(),
                };

                if (actionId! > 0) {
                    
                    const res = await updateActions(actionId!,taskData);
                    setRes(res);
                    setResponse(res);

                    if(res.code === 201){
                        toast.success(res.messages ?? 'Message par défaut');;
                        SetLoad(false);
                        onClose();
                        viders();
                        fetchTaskDetails(codes!);
                    }else{
                        SetLoad(false);
                        onClose();
                        viders();
                        fetchTaskDetails(codes!);
                        toast.success(res.messages ?? 'Message par défaut');
                    }

                }else{

                    const res = await SaveTaskAction(taskData);
                    setRes(res);
                    setResponse(res);

                    if(res.code === 201){
                        toast.success(res.messages ?? 'Message par défaut');;
                        SetLoad(false);
                        onClose();
                        viders();
                        fetchTaskDetails(codes!);
                    }else{
                        SetLoad(false);
                        onClose();
                        viders();
                        fetchTaskDetails(codes!);
                        toast.success(res.messages ?? 'Message par défaut');;
                    }
                }

            } catch (error) {
                onClose();
                viders();
                SetLoad(false);
            };
    };

    useEffect(() => {

        if(response){
            fetchTaskDetails(codes!)
            viders();
        }
    }, [response]);

    const calculateTaskHours = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Vérifie si les dates sont valides
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            setHeurs("");
            return 0; // Retourne 0 si les dates sont invalides
        }
    
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1; // +1 pour inclure le jour de début
    
        // Calcule le nombre d'heures
        const totalHours = totalDays > 0 ? totalDays * 8 : 0; // 8 heures par jour
        setHeurs(totalHours.toString());
    
        return totalHours;
    };

    return (

        <>

            <Toaster position="top-right" reverseOrder={false} />

            {isOpen && (

                <div id={idModale} tabIndex={-1} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

                    <div className="bg-white rounded-lg shadow-lg w-full md:max-w-2xl  max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5">
                            <h3 className="text-xl font-semibold text-gray-900">{actionMessage} </h3>
                            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>


                            <div className="p-4 md:p-5 space-y-4">

                                <div className="p-4 md:p-5 space-y-4">

                                    <div className="">
                                        <label className="block text-lg font-medium text-black dark:text-white" htmlFor="Username">Libellé de l'action <span className="text-red-700">  *</span></label>
                                        <input disabled={isdisabled}  value={libelle} onChange={(event) => { setLibelle(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text" name="Libelet" placeholder="Saisir le nom du projet"
                                        />
                                    </div>

                                    <div className="">
                                        <label className=" block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Description <span className="text-red-700">  *</span>  </label>
                                        {isShow==true ? (
                                            <div className="w-full rounded border border-stroke  py-10 pl-12 pr-4 text-black focus-visible:outline-none dark:border-strokedark  dark:text-white dark:focus:border-black" dangerouslySetInnerHTML={{ __html: description }}></div>

                                            ) : (
                                            <QuillEditor  value={description} onChange={setDescription} />
                                        )}
                                    </div>

                                    <div className=" flex flex-col gap-5.5 sm:flex-row space-x-2">

                                        <div className="w-full sm:w-1/2">
                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de debut <span className="text-red-700"> *</span> </label>
                                            <div className="relative">
                                                <input disabled={isdisabled}  className="px-2 w-full rounded border  border-stroke  py-2 pl-11.5 pr-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="datetime-local" placeholder=""   value={dateDebut} onChange={(e) => setDateDebut(e.target.value)}/>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-1/2">
                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de fin <span className="text-red-700">  *</span>  </label>
                                            <input disabled={isdisabled}  className="px-2 w-full rounded border border-stroke  py-2 px-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"  type="datetime-local" placeholder="" value={dateFin} onChange={(e) => setDateFin(e.target.value)}
                                            />
                                        </div>

                                    </div>

                                    {nbDay ? (
                                            <div className="">
                                                <p> La durée estimée de cette tâche est de {nbDay} Jours </p>
                                            </div>
                                    ) : null}

                                    <div>
                                        {msg ? (
                                            <>
                                                <div className="bg-red-100 border border-red-700 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                    <span className="text-red-800 font-medium">Erreur :</span> {msg}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>

                                    <div>
                                        {message ? (
                                            <div className="bg-red-100 border border-red-700 text-red-700 px-4 py-3 rounded relative" role="alert">
                                                <span className="text-red-800 font-medium">Erreur :</span> {message}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="">
                                        <label className="block text-lg font-medium text-black dark:text-white" htmlFor="Username">Nombre d'heures estimé pour cette action <span className="text-red-700">  * </span></label>
                                        <input disabled={isdisabled}  value={heurs} onChange={(event) => { setHeurs(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="number" name="heurs" placeholder="2H"/>
                                    </div>

                                </div>
                                
                            {isShow==true ? (

                                <div className="flex justify-end">
                                    <button onClick={onClose}
                                        type="button" className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg inline-flex items-center focus:outline-none focus:ring-4`} style={{ backgroundColor: buttonColor }}>
                                        {onCloseMessage}
                                    </button>
                                </div>

                            ) : (

                                <>

                                    <div className="space-x-4 flex items-center justify-end p-5">
                                            {!isdisabled ? (

                                                <button onClick={() => SaveAction()} type="button"
                                                    className="py-2.5 px-5 text-sm font-medium  text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-black focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                                    data-modal-hide="popup-modal" >
                                                    {onDeleteMessage}
                                                </button>

                                            ) : (
                                                <p className=""> </p>
                                            )}

                                            <button
                                                onClick={onClose}
                                                type="button"
                                                className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg inline-flex items-center focus:outline-none focus:ring-4`}
                                                style={{ backgroundColor: buttonColor }}>
                                                {onCloseMessage}
                                            </button>
                                    </div>

                                </>

                            )}

                            </div>

                    </div>

                </div>

        )}

        </>

    );
};

export default AddActionModal;
