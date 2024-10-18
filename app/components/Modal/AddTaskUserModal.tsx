"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { BaseResponse } from '../../interfaces/ApiResponse';
import SelectTaskUsers from '../Select2/SelectTaskUsers';
import { updateUsersTask } from '../../services/TaskService';
import { TaskDTO } from '../../interfaces/ModelsTask';

type AddTaskUserModalProps = {
    buttonColor: string;
    actionMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    id: number;
    idModale: string;
    isOpen: boolean;
    onClose: () => void;
    fetchTaskDetail: (code: string) => Promise<void>;
    codes: string | undefined;
    taskId: number | undefined;
};

const AddTaskUserModal: React.FC<AddTaskUserModalProps> = ({

    buttonColor,
    actionMessage,
    onDeleteMessage,
    onCloseMessage,
    id,
    idModale,
    isOpen,
    onClose,
    fetchTaskDetail,
    codes,
    taskId

}) => {

    const [selectedUser, setSelectedUser] = useState('');
    const [response, setResponse] = useState<BaseResponse<TaskDTO> | null>(null);

    const updateUsers = async () => {
    
        try {
            const res = await updateUsersTask(Number(taskId!), Number(selectedUser) );
            toast.success("L'utilisateur a attribué avec succès !");
            setResponse(res);
            fetchTaskDetail(codes!);
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

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
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="fullName" > Attribuer la tâche à un membre de l'équipe <span className="text-red-700">  *</span>  </label>
                                <SelectTaskUsers setUsers={setSelectedUser} idproject={id} />
                            </div>
                        </div>

                        <div className="space-x-4 flex items-center justify-end p-5">

                            <button onClick={() => { updateUsers();
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

export default AddTaskUserModal;
