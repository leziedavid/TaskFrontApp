"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Users } from '../../interfaces/Users';
import FileUpload from '../../components/FileUpload';
import QuillEditor from '../QuillEditor';
import { FileObject } from '../../interfaces/FileObject';
import { getUserIdFromToken } from '../../services/ApiService';
import { getObsById, SaveTaskObs, updateObs } from '../../services/TaskObsServices';
import { FilesDTO, TaskDetailsDTO } from '../../interfaces/ModelsTask';

type AddObsModalProps = {
    buttonColor: string;
    actionMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    id: number;
    idModale: string;
    isOpen: boolean;
    onClose: () => void;
    fetchTaskDetails: (code: string) => Promise<void>;
    codes: string | undefined;
    taskId: number;
    obsId: number | undefined;
    isdisabled:  boolean;
    isShow:  boolean;
};

const AddObsModal: React.FC<AddObsModalProps> = ({
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
    taskId,
    isdisabled,
    isShow,
    obsId

}) => {

    const [selectedUser, setSelectedUser] = useState('');
    const [allUsers, setAllUsers] = useState<Users[] | null>(null);
    const [response, setResponse] = useState<BaseResponse<Users[]> | null>(null);
    const [filesListe, setFiles] = useState<FilesDTO[] | null>(null);
    
    const [titles, setTitles] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileObjects, setFileObjects] = useState<FileObject[]>([{ title: '', file: null }]);
    const [libelle, setLibelle] = useState('');
    const [description, setDescription] = useState('');
    const [Load, SetLoad] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const fetchUserId = async () => {

        try {

            const token = localStorage.getItem('token');
            if (token) {
                const response = await getUserIdFromToken(token);
                if (response.code === 200 && response.data) {
                    setUserId(response.data);
                    console.log(userId);
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

    const viders = async () => {
        setLibelle("");  // Assurez-vous que setLibelle est défini quelque part dans votre composant
        setDescription("");  // Assurez-vous que setDescription est défini quelque part dans votre composant
        setFileObjects([]);  // Vider le tableau fileObjects
    };

    // Fonction octetsEnMB ajustée
    const octetsEnMB = (tailleEnOctets: number): string => {
        const tailleEnMo = tailleEnOctets / (1024 * 1024);
        const tailleEnMoFormatee = tailleEnMo.toFixed(2);
        return `${tailleEnMoFormatee} MB`;
    };

    const getObsByIds = async (obsIds:number) => {

        try {

            const token = localStorage.getItem('token');
            if (token) {
                const response = await getObsById(obsIds);
                const datas = response.data;
                const data: FilesDTO[] =response.data.filesData
                setFiles(data);

                if (response.code === 200 && response.data) {

                    setLibelle(datas.libelle);
                    setDescription(datas.description);

                } else {

                    toast.error("Erreur lors de la récupération de l'observation.");
                }
            } else {

                toast.error("Observation introuvable.");
            }
        } catch (error) {

            console.error('Erreur lors de la récupération de l\'observation:', error);
            toast.error("Erreur lors de la récupération de l'observation.");

        }
    };
    
    useEffect(() => {
        
        fetchUserId();
        viders();

        if (obsId! > 0) {
            getObsByIds(obsId!)
        }

    }, [codes,obsId]);

    const SaveObs = async () => {

        SetLoad(true);

        if (!libelle) {
            SetLoad(false);
            toast.error("Le nom du projet est requis.");
            return;
        }
        if (!description) {
            SetLoad(false);
            toast.error("Le nom du projet est requis.");
            return;
        }


        const formData = new FormData();
        formData.append('libelle', libelle);
        formData.append('description', description);
        formData.append('userId', userId!.toString());
        formData.append('taskId', taskId!.toString());

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

            if (obsId! > 0) {
                const res = await updateObs(obsId!,formData);
                setResponse(res);
    
                if (res.code === 200) {
                    toast.success(res.messages ?? 'Message par défaut');
                    SetLoad(false);
                    onClose();
                    fetchTaskDetails(codes!);
                } else {
                    SetLoad(false);
                    onClose();
                    fetchTaskDetails(codes!);
                }

            }else{

                const res = await SaveTaskObs(formData);
                setResponse(res);
    
                if (res.code === 201) {
                    toast.success(res.messages ?? 'Message par défaut');
                    SetLoad(false);
                    onClose();
                    fetchTaskDetails(codes!);
                } else {
                    SetLoad(false);
                    onClose();
                    fetchTaskDetails(codes!);
    
                }


            }
            

            } catch (error) {
                SetLoad(false);
                console.error('Erreur lors de l\'ajout du projet :', error);
            }

    };

    const handleClick = async (publicId: string) => {
        const url = `${process.env.NEXT_PUBLIC_FILE_BASE_URL}/${publicId}`;
        window.open(url, '_blank');
    };
    


    return (

        <>

            <Toaster position="top-right" reverseOrder={false} />

            {isOpen && (

            <div id={idModale} tabIndex={-1} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-30 z-50">

                    <div className="bg-white rounded-lg shadow-lg w-full md:max-w-2xl  max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5">
                            <h3 className="text-xl font-semibold text-gray-900">{actionMessage}</h3>
                            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg
                                    className="w-3 h-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>


                            <div className="p-4 md:p-5 space-y-4">

                                <div className="mb-0">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username">Libellé de l&apos;observation  <span className="text-red-700">  *</span></label>
                                    <input disabled={isdisabled} value={libelle} onChange={(event) => { setLibelle(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text" name="Libelet" placeholder="Saisir le libellé de l'observation"
                                    />
                                </div>

                                <div className="mb-0">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Description <span className="text-red-700">  *</span>  </label>
                                    {isShow == true ? (

                                        <div  className="w-full rounded border border-stroke  py-10 pl-12 pr-4 text-black focus-visible:outline-none dark:border-strokedark  dark:text-white dark:focus:border-black" dangerouslySetInnerHTML={{ __html: description }}></div>

                                    ) : (
                                        <QuillEditor  value={description} onChange={setDescription} />
                                    )}
                                </div>

                                <div className="p-2 sm:p-6 xl:p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filesListe && filesListe.length > 0 ? (
                                            filesListe.map((item) => (
                                                item.size > 0 ? (

                                                    <div key={item.fileId} className="mb-0 max-w-[557px] rounded-lg bg-[#d6d8d8] border border-stroke py-4 pl-4 pr-3 dark:border-strokedark dark:bg-meta-4 sm:pl-6">
                                                        <div className="flex justify-between">
                                                            <div className="flex flex-grow gap-3">
                                                                <div onClick={() => handleClick(item.publicId)}>
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                                        <path d="M13 9V3.5L18.5 9M6 2C4.89 2 4 2.89 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2H6Z" fill="#012340" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-[#012340] dark:text-white">
                                                                        {item.title}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <button onClick={() => handleClick(item.publicId)}>
                                                                    <svg className="fill-current" width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M0.854423 0.85186C1.2124 0.493879 1.79281 0.493879 2.15079 0.85186L7.0026 5.70368L11.8544 0.85186C12.2124 0.493879 12.7928 0.493879 13.1508 0.85186C13.5088 1.20984 13.5088 1.79024 13.1508 2.14822L8.29897 7.00004L13.1508 11.8519C13.5088 12.2098 13.5088 12.7902 13.1508 13.1482C12.7928 13.5062 12.2124 13.5062 11.8544 13.1482L7.0026 8.2964L2.15079 13.1482C1.79281 13.5062 1.2124 13.5062 0.854423 13.1482C0.496442 12.7902 0.496442 12.2098 0.854423 11.8519L5.70624 7.00004L0.854423 2.14822C0.496442 1.79024 0.496442 1.20984 0.854423 0.85186Z" fill=""/>
                                                                    </svg>
                                                                </button>
                                                                <br />
                                                                <span className="text-box text-sm">
                                                                    {octetsEnMB(item.size)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                ) : null
                                            ))
                                        ) : (
                                            <p> </p>
                                        )}
                                    </div>
                                </div>

                                {isShow == true ? (

                                    <p> </p>

                                    ) : (
                                        <>
                                            <label className="mb-0 block text-lg font-medium text-black dark:text-white"> FICHIERS <span className="text-red-600 text-sm"> (Facultatif)</span>  </label>
                                            <div className="mb-0">
                                                <FileUpload
                                                titles={titles}
                                                setTitles={setTitles}
                                                file={file}
                                                setFile={setFile}
                                                fileObjects={fileObjects}
                                                setFileObjects={setFileObjects} 
                                                id={''}                                                />
                                            </div>
                                        </>
                                    )}



                            </div>

                        {isShow == true ? (
                            <div className="space-x-4 flex items-center justify-end p-5">
                                <div className="flex justify-end">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg inline-flex items-center focus:outline-none focus:ring-4`}
                                        style={{ backgroundColor: buttonColor }}
                                    >
                                        {onCloseMessage}
                                    </button>
                                </div>
                            </div>

                        ) : (

                            <>
                                <div className="space-x-4 flex items-center justify-end p-5">
                                        {!isdisabled ? (
                                            <button onClick={() => SaveObs()}
                                                type="button" className="py-2.5 px-5 text-sm font-medium  text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data-modal-hide="popup-modal">
                                                {onDeleteMessage}
                                            </button>
                                        ) : (
                                            <button
                                                // onClick={() => EditAction()}
                                                type="button" className="py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data-modal-hide="popup-modal">
                                                {onDeleteMessage}
                                            </button>
                                        )}

                                        <button
                                            onClick={onClose} type="button" className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg inline-flex items-center focus:outline-none focus:ring-4`}
                                            style={{ backgroundColor: buttonColor }} >
                                            {onCloseMessage}
                                        </button>
                                </div>
                            </>
                        )}

                    </div>

            </div>

        )}

        </>

    );
};

export default AddObsModal;
