"use client";

import React, { useCallback, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { BaseResponse } from '@/app/interfaces/ApiResponse';
import { Donnees } from '@/app/interfaces/Donnees';
import { getUserIdFromToken } from '@/app/services/ApiService';
import { calculateDaysDifference, calculateHoursDifference, compareDateRangesTask } from '@/app/services/dateService';
import { fetchTaskById, SaveTask, updateTask } from '@/app/services/TaskService';
import SelectPriorite2 from '@/app/components/Select2/SelectPriorite2';
import SelectState2 from '@/app/components/Select2/SelectState2';
import QuillEditor from '@/app/components/QuillEditor';
import SelectOneUsers from '@/app/components/Select2/SelectOneUsers';
import { Task } from '@/app/interfaces/Global';

const PAGE_SIZE = 8; // Nombre de trajets par page

interface ApiResulte {
    code: number;
    data: string;
    message: string;
}
export default function Page() {

    const router = useRouter();

    const navigateTo = (path: string) => {
        localStorage.removeItem('projectStartDate');
        localStorage.removeItem('projectEndDate');
        router.push(path);
    };

    const [msg, setMsg] = useState('');
    const [activeUser, setActiveUser] = useState('');
    const [libelle, setLibelle] = useState('');
    const [heurs, setHeurs] = useState('');
    const [nbDay, setNbDay] = useState<string>('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [description, setDescription] = useState('');
    const [Priority, setPriority] = useState("");
    const [state, setState] = useState("EN_ATTENTE");
    const [User, setUsers] = useState('');
    const [Load, SetLoad] = useState(false);
    const [placeholder1, setPlaceholder1] = useState("Selectionnez la priorité");
    const [placeholder2, setPlaceholder2] = useState("Selectionnez le status");
    const [stateColor, SetStateColor] = useState("#2196F3");
    const [prioColor, SetPrioColor] = useState("#F27F1B");

    const [response, setResponse] = useState<BaseResponse<Donnees> | null>(null);
    const [apiRes, setApiRes] = useState<Task | null>(null);
;
    const { id, codes } = useParams<{ id: string, codes: string }>();
    const [userId, setUserId] = useState<number | null>(null);
    
    const getTask = async (taskId: string) => {
        try {
            const res = await fetchTaskById(taskId);
            const datas = res.data;
            setApiRes(datas);
            setLibelle(datas.taskName);
            setHeurs(datas.taskNombreHeurs);
            setNbDay(datas.taskNombreJours);
            setDateDebut(datas.taskStartDate);
            setDateFin(datas.taskEndDate);
            setDescription(datas.taskDescription);
            setUsers(datas.assigned);
            setPriority(datas.taskPriority);
            setState(datas.taskState);
            SetPrioColor(datas.prioColor);

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ID utilisateur :', error);
            toast.error("Erreur lors de la récupération de l'ID utilisateur.");
        }
    };
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
            toast.error("Erreur lors de la récupération de l'ID utilisateur.");
        }
    };

    

    useEffect(() => {
        getTask(id!);
        fetchUserId();

    }, [id]);

    useEffect(() => {

        if (dateDebut && dateFin) {
            const daysDifferenceString = calculateDaysDifference(dateDebut, dateFin);
            const daysDifference = Number(daysDifferenceString);

            // Vérifier si daysDifference est négatif
            if (daysDifference < 0) {

                const daysDifferenceStr = daysDifference.toString();
                setNbDay(daysDifferenceStr);
                setMsg("La différence de date donne un nombre  négative. Veuillez vérifier vos dates.");

            } else {

                // Convertir en chaîne et mettre à jour le nombre de jours
                setMsg("");
                const daysDifferenceStr = daysDifference.toString();
                setNbDay(daysDifferenceStr);
            }

            const hoursDifference = calculateHoursDifference(dateDebut, dateFin);
            setHeurs(hoursDifference);

        }

        if (response && response.data && response.code === 201) {
            SetLoad(false);
            toast.success("Connexion réussie !");
            navigateTo(`admin/projet/${codes}`);
        } else if (response) {
            SetLoad(false);
            toast.error("Erreur lors de la connexion. Veuillez réessayer.");
        }
    }, [response, dateDebut, dateFin, codes]);

    const AddData = async () => {
        try {
            if (!libelle) {
                toast.error("Le nom du projet est requis.");
                return;
            }
            if (!Priority) {
                toast.error("La priorité est requise.");
                return;
            }
            if (!state) {
                toast.error("L'état du projet est requis.");
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
                toast.error("L'heure du projet est requise.");
                return;
            }
            if (!User) {
                toast.error("L'attribution de la tâche à un membre de l'équipe est requise.");
                return;
            }

            SetLoad(true);

            const taskData = {
                taskName: libelle,
                taskNombreHeurs: heurs,
                taskPriority: Priority,
                taskStartDate: dateDebut,
                taskEndDate: dateFin,
                taskDescription: description,
                taskState: state,
                taskNombreJours: nbDay,
                prioColor: prioColor,
                stateColor: stateColor,
                progress: '0',
                assigned: User,
                projectCodes: codes, // Utilisation de codes ici
                userId: userId!.toString(),
            };

            const response = await updateTask(id!, taskData);
            toast.success("Projet mis à jour avec succès");
                if(response){
                    SetLoad(false);
                    getTask(id!);
                }

        } catch (error) {
            console.error('Erreur lors de l\'ajout du projet :', error);
            toast.error(`Erreur lors de l'ajout du projet :`);
            SetLoad(false);
        }
    };
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="rounded-sm bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className=" mb-10 col-span-5 xl:col-span-3">
                    <div className="rounded-sm  bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h1 className="text-2xl font-semibold text-gray-900">Modifier les informations sur la tâche</h1>
                        </div>

                        <div className="p-7">
                            
                            <form>
                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username">Nom de la tâche <span className="text-red-700"> *</span></label>
                                    <input value={libelle} onChange={(event) => { setLibelle(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text" name="Libelet" placeholder="Saisir le nom du projet" />
                                </div>
                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username">Priorité <span className="text-red-700"> *</span></label>
                                    <SelectPriorite2 placeholder1={placeholder1} setPriority={setPriority} SetPrioColor={SetPrioColor} priorityValue={Priority} />
                                </div>
                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username">Status </label>
                                    <SelectState2 placeholder2={placeholder2} setState={setState} defaultDisabled={true} stateValue={state} />
                                </div>

                                <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">
                                    <div className="w-full sm:w-1/2">
                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de debut <span className="text-red-700"> *</span> </label>
                                        <div className="relative">
                                            <input className=" px-2 w-full rounded border  border-stroke  py-2 pl-11.5 pr-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="datetime-local"
                                                placeholder="" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de fin <span className="text-red-700"> *</span> </label>
                                        <input className=" px-2 w-full rounded border border-stroke  py-2 px-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="datetime-local" placeholder="" value={dateFin} onChange={(e) => setDateFin(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {nbDay ? (
                                    <div className="mb-5">
                                        <p> La durée estimée de cette tâche est de {nbDay} Jours </p>
                                        <span className="text-red-800"> {msg}</span>
                                    </div>
                                ) : (
                                    <div className="mb-5"> </div>
                                )}
                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Description <span className="text-red-700"> *</span> </label>
                                    <QuillEditor value={description} onChange={setDescription} />
                                </div>
                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username">Nombre d'heures estimé pour cette tâche.<span className="text-red-700"> *</span></label>
                                    <input value={heurs} onChange={(e) => setHeurs(e.target.value)} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="number" name="Libelet" placeholder="Saisir le nom du projet" />
                                </div>
                                <label className="mb-4.5 block text-lg font-medium text-black dark:text-white">
                                    UTILISATEUR
                                </label>
                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Attribuer la tâche à un membre de l'équipe <span className="text-red-700"> *</span> </label>
                                    <SelectOneUsers codes={codes!} activeUser={User} setUsers={setUsers} />
                                </div>

                                    <div className="mb-10 flex justify-end gap-4.5 space-x-2">
                                        <button  onClick={() => navigateTo(`/admin/projet/${codes}`)}  className="flex justify-center rounded-lg border border-[#012340] py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white" type="button">ANNULER</button>
                                        <button className="flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90" type="button" onClick={AddData}>
                                            AJOUTER
                                        </button>
                                    </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>

        </>

    )
}
