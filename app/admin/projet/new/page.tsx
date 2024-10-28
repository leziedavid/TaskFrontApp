"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import FileUpload from '@/app/components/FileUpload';
const QuillEditor = dynamic(() => import('@/app/components/QuillEditor'), {
    ssr: false,
});
import TableUsersSelecte from '@/app/components/tabs/TableUsersSelecte';

import { differenceInDays } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

import { BaseResponse } from '@/app/interfaces/ApiResponse';
import { Donnees } from '@/app/interfaces/Donnees';
import { FileObject } from '@/app/interfaces/FileObject';
import { Users } from '@/app/interfaces/Users';
import { UserState } from '@/app/interfaces/UserState';

// import Loading from '../../common/Loader/Loading';
import { Department } from '@/app/interfaces/Department';
import { getUserIdFromToken } from '@/app/services/ApiService';
import { SaveProject } from '@/app/services/ProjectService';


import SelectMultipleDepartment from '@/app/components/Select2/SelectMultipleDepartment';
import SelectPriorite2 from '@/app/components/Select2/SelectPriorite2';
import SelectState2 from '@/app/components/Select2/SelectState2';
import SelectUsersFilter from '@/app/components/Select2/SelectUsersFilter';
import dynamic from 'next/dynamic';
import { ArrowLeft as ArrowLeftIcon } from 'lucide-react';


const PAGE_SIZE = 8; // Nombre de trajets par page
export default function Page() {

    const router = useRouter();
    const navigateTo = (path: string) => {
        router.push(path);
    };

    const today = new Date().toISOString().split('T')[0];

    const [msg, setMsg] = useState('');
    const [libelle, setLibelle] = useState('');
    const [nbDay, setNbDay] = useState<string>('');
    const [dateDebut, setDateDebut] = useState(today);
    const [dateFin, setDateFin] = useState(today);
    const [description, setDescription] = useState('');
    const [Priority, setPriority] = useState("");
    const [state, setState] = useState("EN_ATTENTE");
    const [Departments, setDepartment]  = useState<string[]>([]);
    const [dataDepartment, setDataDepartment] = useState<Department[]>([]);
    const [Users, setUsers] =  useState<string[]>([]);
        const [Tablegenerate, setTablegenerate] = useState<Users[]>([]);
    const [DataGenerated, setDataGenerated] = useState<UserState>({usersId: [], leaderId: 0  });
    const [Load, SetLoad] = useState(false);
    const [titles, setTitles] = useState('');
    const [placeholder1, setPlaceholder1] = useState("Selectionnez la priorité");
    const [placeholder2, setPlaceholder2] = useState("Selectionnez le status");

    const [demarrer, setDemarrer] = useState("EN_ATTENTE");
    const [stateColor, SetStateColor] = useState("#2196F3");

    const [prioColor, SetPrioColor] = useState("#F27F1B");

    const [file, setFile] = useState<File | null>(null);
    
    const [fileObjects, setFileObjects] = useState<FileObject[]>([{ title: '', file: null }]);

    const [response, setResponse] = useState<BaseResponse<Donnees> | null>(null);

    const calculateDaysDifference = (date1: string, date2: string): string => {
        const parsedDate1 = parseISO(date1);
        const parsedDate2 = parseISO(date2);
        const daysDifference = differenceInDays(parsedDate2, parsedDate1)+1;
        return daysDifference.toString();
    };


    const [isOuiSelected, setIsOuiSelected] = useState(false);

    const handleOuiClick = () => {
        setIsOuiSelected(true);
        setDemarrer('EN_COURS');
        setState('EN_COURS');
        SetStateColor('#038C4C');
    };

    const handleNonClick = () => {
        setIsOuiSelected(false);
        setDemarrer('EN_ATTENTE');
        setState('EN_ATTENTE');
        SetStateColor('#2196F3');
    };

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


    useEffect(() => {

            // Calculer le nombre de jours si les dates de début et de fin sont définies
            if (dateDebut && dateFin) {
                calculateTaskHours(dateDebut,dateFin);
            }

            if (response && response.data && response.code === 201) {
                
                SetLoad(false);
                toast.success("Projet créé avec succès !");
                // Ajouter un délai de 3 secondes avant la redirection
                setTimeout(() => {
                    router.push("/admin/projet");
                }, 3000); // Délai de 3000 millisecondes (3 secondes)

            } else if (response) {
                
                SetLoad(false);
                toast.error("Erreur lors de la création du projet. Veuillez réessayer.");
            }

    }, [response,dateDebut, dateFin]);

    const AddData = async () => {

            SetLoad(true);

            if (!libelle) {
                SetLoad(false);
                toast.error("Le nom du projet est requis.");
                return;
            }
            
            if (!Priority) {
                SetLoad(false);
                toast.error("La priorité est requise.");
                return;
            }
            
                        
            if (!state) {
                SetLoad(false);
                toast.error("L'état du projet est requis.");
                return;
            }

            if (!dateDebut) {
                SetLoad(false);
                toast.error("La date de début est requise.");
                return;
            }
            
            if (!dateFin) {
                SetLoad(false);
                toast.error("La date de fin est requise.");
                return;
            }
            
            if (!description) {
                SetLoad(false);
                toast.error("La description est requise.");
                return;
            }

            
            if (!DataGenerated) {
                SetLoad(false);
                toast.error("La liste de l'equipe du projet est requise.");
                return;
            }

            const formData = new FormData();
            formData.append('projectName', libelle);
            formData.append('projectPriority', Priority);
            formData.append('projectStartDate', dateDebut);
            formData.append('projectEndDate', dateFin);
            formData.append('projectDescription', description);
            if(demarrer){
                formData.append('projectState', demarrer);
            }else{
                formData.append('projectState', state);
            }
            formData.append('projectNombreJours', nbDay);
            formData.append('prioColor', prioColor);
            formData.append('stateColor', stateColor);
            formData.append('progress', '0');
            formData.append('users', JSON.stringify(DataGenerated));
            formData.append('userId', userId!.toString());
            
            if (fileObjects && fileObjects.length > 0) {

                formData.append('nbfiles', String(fileObjects.length));
                fileObjects.forEach((fileObject, index) => {

                    if (fileObject.file) {
                        formData.append(`fichiers${index + 1}`, fileObject.file);
                        formData.append(`title${index + 1}`, fileObject.title);
                    }
                });
            }
        
            try {

                const apiResponse = await SaveProject(formData);
                setResponse(apiResponse);

            } catch (error) {
                SetLoad(false);
                console.error('Erreur lors de l\'ajout du projet :', error);
            }
    };


    const calculateTaskHours = (startDate: string, endDate: string) => {
        const parsedStartDate = parseISO(startDate);
        const parsedEndDate = parseISO(endDate);
        
        // Vérifie la différence de jours
        const daysDifference = differenceInDays(parsedEndDate, parsedStartDate);
    
        if (daysDifference < 0) {
            setMsg("La différence de jours est négative. Veuillez vérifier vos dates.");
            return; // Sort de la fonction si les dates sont invalides
        }
    
        const totalDays = daysDifference + 1; // +1 pour inclure le jour de début
        const finalyDate = totalDays.toString();
        setNbDay(finalyDate);
        return totalDays; // Retourne le nombre total de jours
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="bg-gray-300 p-4 flex items-center">
                <a onClick={() => navigateTo(`/admin/projet`)} className="flex items-center text-black font-bold cursor-pointer hover:underline">
                    <ArrowLeftIcon className="mr-2" /> {/* Flèche à gauche du texte */}
                    Retour
                </a>
                <h1 className="ml-4 font-bold">Ajouter un nouveau projet</h1>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
                <div className=" mb-10 col-span-5 xl:col-span-3">

                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

                        {/* <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h1 className="text-2xl font-semibold text-gray-900">NOUVEAU PROJET</h1>
                        </div> */}
                        
                        <div className="p-7">

                            <form>

                                <p className="mb-8 block text-lg font-medium text-black dark:text-white"> INFORMATION SUR LE PROJET</p>

                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username"> Nom du projet  <span className="text-red-700"> * </span> </label>
                                    <input value={libelle} onChange={(event) => { setLibelle(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text"  placeholder="Saisir le nom du projet"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Priorité <span className="text-red-700"> * </span> </label>
                                    <SelectPriorite2  placeholder1={placeholder1} setPriority={setPriority} SetPrioColor={SetPrioColor} priorityValue={Priority} />
                                </div>

                                <div className="mb-5">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Status <span className="text-red-700"> * </span> </label>
                                    <SelectState2 placeholder2={placeholder2} setState={setState} defaultDisabled={false} stateValue={state}  />
                                </div>
                                
                                <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">

                                    <div className="w-full sm:w-1/2">
                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de debut <span className="text-red-700"> * </span> </label>
                                        <div className="relative">
                                        {/* datetime-local */}
                                            <input className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="datetime-local"
                                                placeholder=""
                                                value={dateDebut}
                                                onChange={(e) => setDateDebut(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/2">

                                        <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date de fin <span className="text-red-700"> * </span> </label>
                                        <input
                                            className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="datetime-local"
                                            placeholder=""
                                            value={dateFin}
                                            onChange={(e) => setDateFin(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {nbDay ? (
                                    <div className="mb-5">
                                        <p> La durée de ce projet est estimée à {nbDay} Jours </p>
                                        <span className="text-red-800"> {msg}</span>
                                    </div>
                                        ) : (
                                    <div className="mb-5"> </div>
                                )}


                                <div className="mb-5">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Description <span className="text-red-700"> * </span> </label>
                                    <QuillEditor value={description} onChange={setDescription} />
                                </div>

                                <label className="mb-8 block text-lg font-medium text-black dark:text-white">
                                    INFORMATION SUR LE DEPARTEMENT
                                </label>

                                <div className="mb-10">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Departement <span className="text-red-700"> * </span> </label>
                                    <SelectMultipleDepartment setDepartment={setDepartment} departments={dataDepartment} />
                                </div>
                                
                                    {Departments.length >0 ? (
                                        <div className="mb-5">
                                            <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Assigner à des utilisateurs  <span className="text-red-700"> * </span>  </label>
                                            <SelectUsersFilter setUsers={setUsers} Departments={Departments} setTablegenerate={setTablegenerate} setDataGenerated={setDataGenerated} />
                                        </div>
                                        ): (
                                        <div className=""> </div>
                                    )}
                                
                                    {setTablegenerate.length > 0 && <TableUsersSelecte setTablegenerate={setTablegenerate}  Tablegenerate={Tablegenerate} setDataGenerated={setDataGenerated} />}


                                <label className="mb-4.5 block text-lg font-medium text-black dark:text-white"> FICHIERS </label>
                                <div className="mb-5">
                                    <FileUpload
                                        titles={titles}
                                        setTitles={setTitles}
                                        file={file}
                                        setFile={setFile}
                                        fileObjects={fileObjects}
                                        setFileObjects={setFileObjects}
                                        id={''}                                    />
                                </div>

                                <div className="flex justify-end gap-4.5 space-x-2">
                                    <button onClick={() => navigateTo(`/admin/projet`)}  className="flex justify-center rounded-lg border border-[#012340] py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"  type="button" >ANNULER</button>
                                    <button className="flex justify-center rounded-lg bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90" type="button" onClick={AddData} >
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
