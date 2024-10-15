import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { BaseResponse } from '../../interfaces/ApiResponse';
import { Department } from '../../interfaces/Global';
import { getUserIdFromToken } from '../../services/ApiService';
import { getDepartementById, SaveDepartement, updateDepartement } from '../../services/DepartementServices';


type AddDepModalModalProps = {

    buttonColor: string;
    DepMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    idModale: string;
    isOpen: boolean;
    onClose: () => void;
    fetchAllDepartement: () => Promise<void>;
    codes: string | undefined;
    departmentId: number | undefined;
    isdisabled:  boolean;
    isShow:  boolean;
};

const AddDepModalModal: React.FC<AddDepModalModalProps> = ({
    
    buttonColor,
    DepMessage,
    onDeleteMessage,
    onCloseMessage,
    idModale,
    isOpen,
    onClose,
    fetchAllDepartement,
    codes,
    isdisabled,
    isShow,
    departmentId

}) => {

    const [libelle, setLibelle] = useState('');
    const [sigle, setSigle] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [Load, SetLoad] = useState(false);
    const [response, setResponse] = useState<BaseResponse<Department[]> | null>(null);
    
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

    const viders = async () => {
        setLibelle("");
        setSigle("");
    };

    const SaveObs = async () => {

        SetLoad(true);

        if (!libelle) {
            SetLoad(false);
            toast.error("Le nom du departement est requis.");
            return;
        }
        if (!sigle) {
            SetLoad(false);
            toast.error("Le sigle du departement est requis.");
            return;
        }

        const debData = {
            libelle: libelle,
            sigle: sigle,
            userId: userId!.toString(),
        };

        try {

            if (departmentId! > 0) {

                const res = await updateDepartement(departmentId!,debData);
                setResponse(res);
    
                if (res.code === 200) {
                    toast.success(res.messages ?? 'Message par défaut');
                    SetLoad(false);
                    onClose();
                    fetchAllDepartement();
                    viders();

                } else {

                    SetLoad(false);
                    onClose();
                    fetchAllDepartement();
                    viders();
                }

            }else{

                const res = await SaveDepartement(debData);
                setResponse(res);
    
                if (res.code === 201) {
                    toast.success(res.messages ?? 'Message par défaut');
                    SetLoad(false);
                    onClose();
                    fetchAllDepartement();
                    viders();
                } else {
                    SetLoad(false);
                    onClose();
                    fetchAllDepartement();
                    viders();
                }


            }
            

            } catch (error) {
                SetLoad(false);
                console.error('Erreur lors de l\'ajout du projet :', error);
            }

    };


    const getDepartemenById = async (departmentId:number) => {

        try {

            const token = localStorage.getItem('token');
            
            if (token) {
                const response = await getDepartementById(departmentId);
                const datas = response.data;

                if (response.code === 200 && response.data) {

                    setLibelle(datas.departmentName);
                    setSigle(datas.departmentSigle);

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

    useEffect(() => {
        fetchUserId();
        viders();
        console.log(departmentId);

        if (departmentId! > 0) {
            getDepartemenById(departmentId!)
        }

    }, [departmentId]);


    return (

        <>

            <Toaster position="top-right" reverseOrder={false} />

            {isOpen && (

            <div id={idModale} tabIndex={-1} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-30 z-50">

                    <div className="bg-white rounded-lg shadow-lg w-full md:max-w-2xl  max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5">
                            <h3 className="text-xl font-semibold text-gray-900">{DepMessage}</h3>
                            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>


                            <div className="p-4 md:p-5 space-y-4">

                                <div className="mb-0">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username">Depatement <span className="text-red-700">  *</span></label>
                                    <input disabled={isdisabled} value={libelle} onChange={(event) => { setLibelle(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text" placeholder="Depatement"
                                    />
                                </div>

                                <div className="mb-0">
                                    <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="Username">Sigle<span className="text-red-700">  *</span></label>
                                    <input disabled={isdisabled} value={sigle} onChange={(event) => { setSigle(event.target.value); }} className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black" type="text"  placeholder="Sigle"
                                    />
                                </div>

                            </div>

                        {isShow == true ? (
                            <div className="space-x-4 flex items-center justify-end p-5">
                                <div className="flex justify-end">
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg inline-flex items-center focus:outline-none focus:ring-4`}
                                        style={{ backgroundColor: buttonColor }}>
                                        {onCloseMessage}
                                    </button>
                                </div>
                            </div>

                        ) : (

                            <>

                                <div className="space-x-4 flex items-center justify-end p-5">
                                        {!isdisabled ? (
                                            <button onClick={() => SaveObs()}
                                                type="button" className="py-2.5 px-5 text-sm font-medium text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data-modal-hide="popup-modal">
                                                {onDeleteMessage}
                                            </button>
                                        ) : (
                                            <button
                                                type="button" className="py-2.5 px-5 text-sm font-medium  text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data-modal-hide="popup-modal">
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

export default AddDepModalModal;
