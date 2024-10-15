import { differenceInDays } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Users } from '../../interfaces/Users';

import { getUserIdFromToken } from '../../services/ApiService';
import { calculateHoursDifference, compareDateRanges } from '../../services/dateService';
import { SaveTaskAction } from '../../services/TaskActionServices';
import QuillEditor from '../QuillEditor';


type AddActionModalProps = {
    buttonColor: string;
    actionMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    EndDate:string;
    startDate:string;
    id: number;
    taskId: number;
    idModale: string;
    isOpen: boolean;
    onClose: () => void;
    fetchTaskDetails: (code: string) => Promise<void>;
    codes: string | undefined;
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
    taskId
    
}) => {

    const [selectedUser, setSelectedUser] = useState('');
    const [allUsers, setAllUsers] = useState<Users[] | null>(null);
    const [response, setResponse] = useState<BaseResponse<Users[]> | null>(null);
    const navigate = useNavigate();

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

    const calculateDaysDifference = (date1: string, date2: string): string => {
        const parsedDate1 = parseISO(date1);
        const parsedDate2 = parseISO(date2);
        const daysDifference = differenceInDays(parsedDate2, parsedDate1)+1;
        return daysDifference.toString();
    };

    
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
            setHeurs(hoursDifference);
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
                console.log("Dates are valid, proceeding...");
            }
        }
    }, [selectedUser, dateDebut, dateFin, startDate, EndDate]);


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
        fetchUserId();
    }, [codes]);

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

            const res = await SaveTaskAction(taskData);
                setResponse(res);

                if(res.code === 201){
                    toast.success(res.messages ?? 'Message par défaut');
                    SetLoad(false);
                    onClose();
                    fetchTaskDetails(codes!);
                }else{
                    SetLoad(false);
                    onClose();
                    fetchTaskDetails(codes!);

                }

            } catch (error) {
                toast.error(`Erreur lors de l'ajout de l'action verifier votre connexion internet :`);
                SetLoad(false);
            };
    };

    useEffect(() => {

        if(response){
            fetchTaskDetails(codes!)
        }
    }, [response]);

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
                                        <input value={libelle} onChange={(event) => { setLibelle(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text" name="Libelet" placeholder="Saisir le nom du projet"
                                        />
                                    </div>

                                    <div className="">
                                        <label className=" block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Description <span className="text-red-700">  *</span>  </label>
                                        <QuillEditor value={description} onChange={setDescription} />
                                    </div>

                                    <div className=" flex flex-col gap-5.5 sm:flex-row">

                                        <div className="w-full sm:w-1/2">
                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de debut <span className="text-red-700"> *</span> </label>
                                            <div className="relative">
                                                <input className="w-full rounded border  border-stroke  py-2 pl-11.5 pr-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="date" placeholder=""   value={dateDebut} onChange={(e) => setDateDebut(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-1/2">

                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de fin <span className="text-red-700">  *</span>  </label>
                                            <input className="w-full rounded border border-stroke  py-2 px-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                type="date" placeholder="" value={dateFin} onChange={(e) => setDateFin(e.target.value)}
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
                                        <input value={heurs} onChange={(event) => { setHeurs(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="number" name="heurs" placeholder="2H"/>
                                    </div>

                                </div>

                                    <div className="space-x-4 flex items-center justify-end p-5">
                                        <button onClick={() => { SaveAction(); }} type="button"className="py-2.5 px-5 text-sm font-medium text-gray-900 text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data-modal-hide="popup-modal">
                                            {onDeleteMessage}
                                        </button>

                                        <button onClick={onClose} type="button" className={`py-2.5 px-5 text-sm font-medium text-white bg-#${buttonColor} hover:bg-#${buttonColor} focus:ring-4 focus:outline-none focus:ring-${buttonColor}-300 dark:focus:ring-${buttonColor}-800 rounded-lg inline-flex items-center`} style={{ backgroundColor: `${buttonColor}` }} >
                                            {onCloseMessage}
                                        </button>
                                    </div>
                            </div>

                    </div>

                </div>

        )}

        </>

    );
};

export default AddActionModal;
