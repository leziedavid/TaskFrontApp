"use client";

import React, {useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { updateAlerteDate, } from '../../services/TaskService';
import { TaskDTO } from '../../interfaces/ModelsTask';

type AddTaskAlerteModalProps = {
    buttonColor: string;
    actionMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    idModale: string;
    dates: string;
    isOpen: boolean;
    onClose: () => void;
    fetchTaskDetail: (code: string) => Promise<void>;
    getTaskByProjectId: (code: string) => Promise<void>;
    codes: string | undefined;
    taskId: number | null;
};

const AddTaskAlerteModal: React.FC<AddTaskAlerteModalProps> = ({

    buttonColor,
    actionMessage,
    onDeleteMessage,
    onCloseMessage,
    idModale,
    isOpen,
    onClose,
    fetchTaskDetail,
    getTaskByProjectId,
    codes,
    taskId,
    dates

}) => {

    const [response, setResponse] = useState<BaseResponse<TaskDTO> | null>(null);
    const [alert, setAlert] = useState('');

    const updateAlerte = async () => {
    
        try {
            const res = await updateAlerteDate(Number(taskId!), alert );

            if (res.code === 200) {
                const message = res.messages || "Message par défaut"; // Fournir un message par défaut si undefined
                toast.success(message);
                setResponse(res);
                fetchTaskDetail(codes!);
                getTaskByProjectId(codes!);
                onClose();
            }


        } catch (error) {
            console.error('Error updating task:', error);
        }
    }


    useEffect(() => {
        if (dates) {
        setAlert(dates)
        }
    }, [dates]);

    return (

        <>

            <Toaster position="top-right" reverseOrder={false} />
        
            {isOpen && (

                <div id={idModale} tabIndex={-1} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

                    <div className="bg-white rounded-lg shadow-lg w-full md:max-w-2xl">
                        <div className="flex items-center justify-between p-5">
                            <h3 className="text-xl font-semibold text-gray-900">{actionMessage}</h3>
                            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>


                        <div className="p-4 md:p-5 space-y-4">
                            <div className="mb-5">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Date et heure <span className="text-red-700">  *</span>  </label>

                                {/* datetime-local */}
                                <input className="w-full rounded border  border-stroke  py-2 pl-11.5 pr-4.5 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                    type="datetime-local"
                                    placeholder=""
                                    value={alert}
                                    onChange={(e) => setAlert(e.target.value)}
                                // required
                                />

                            </div>
                        </div>

                        <div className="space-x-4 flex items-center justify-end p-5">

                            <button onClick={() => { updateAlerte();
                            }} type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 text-white focus:outline-none bg-[#012340] rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" data-modal-hide="popup-modal">
                                {onDeleteMessage}
                            </button>

                            <button onClick={onClose} type="button" className={`py-2.5 px-5 text-sm font-medium text-white bg-#${buttonColor} hover:bg-#${buttonColor} focus:ring-4 focus:outline-none focus:ring-${buttonColor}-300 dark:focus:ring-${buttonColor}-800 rounded-lg inline-flex items-center`}
                                style={{ backgroundColor: `${buttonColor}` }} >
                                {onCloseMessage}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );
};

export default AddTaskAlerteModal;
