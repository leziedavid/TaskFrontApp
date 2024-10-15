import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { BaseResponse } from '../../interfaces/ApiResponse';
import SelectTaskUsers from '../Select2/SelectTaskUsers';
import { updateUsersTask } from '../../services/TaskService';
import {TaskDTO } from '../../interfaces/ModelsTask';
import { ActionDTO } from '@/app/interfaces/ActionDTO';
import { TaskDataCalendar } from '../../interfaces/CalendarsData';
import taskImages from '../../images/task-01.jpg';
import DateConverter from '../DateConverter';

type DetailCalendarModallProps = {
    datas: TaskDataCalendar | null;
    actions: ActionDTO[] | [];
    buttonColor: string;
    actionMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    idModale: string;
    isOpen: boolean;
    onClose: () => void;


};

const DetailCalendarModall: React.FC<DetailCalendarModallProps> = ({
    datas,
    actions,
    buttonColor,
    actionMessage,
    onDeleteMessage,
    onCloseMessage,
    idModale,
    isOpen,
    onClose,



}) => {

    const [selectedUser, setSelectedUser] = useState('');
    const [response, setResponse] = useState<BaseResponse<TaskDTO> | null>(null);

    return (

        <>

            <Toaster position="top-right" reverseOrder={false} />
            
            {isOpen && (

                <div id={idModale} tabIndex={-1} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

                    <div className="bg-white rounded-lg shadow-lg w-full md:max-w-2xl">
                        <div className="flex items-center justify-between p-4">
                            <h5 className="text-xl font-semibold text-gray-900"> {datas?.project.projectName}  :

                                {datas?.project?.projectStartDate ? (
                                    ( <DateConverter dateStr={datas.project.projectStartDate} />)
                                    ) : (
                                        <p>La date de début du projet n&apos;est pas disponible.</p>
                                    )}
                            </h5>
                            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>


                        <div className="p-4 md:p-5 space-y-4">

                            {/* <div className="swim-lane flex flex-col gap-5.5"> */}
                                {/* <h4 className="text-xl font-semibold text-black dark:text-white">In Progress (01)</h4> */}
                                <div draggable="true" className="task relative flex cursor-move justify-between rounded-sm  border-stroke bg-white p-7  dark:border-strokedark dark:bg-boxdark">
                                    <div className='overflow-y-auto'>
                                        <h5 className="mb-4 text-lg font-medium text-black dark:text-white">{datas?.taskName}</h5>
                                                <p>{datas?.assignedUser.firstname} - {datas?.assignedUser.lastname}</p>
                                        <div className="my-4">
                                            {/* <img src={taskImages} alt="Task"  /> */}
                                        </div>

                                        <div className="flex flex-col gap-2">

                                            {actions?.length ? (
                                                actions.map((item) => (
                                                    <label key={item.actionId} htmlFor={`taskCheckbox${item.actionId}`} className="cursor-pointer">
                                                        <div className="relative flex items-center pt-0.5">
                                                            <input type="checkbox" id={`taskCheckbox${item.actionId}`} className="taskCheckbox sr-only" checked={item.isValides === 1} />
                                                            <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark dark:bg-boxdark-2">
                                                                <span className={`text-white ${item.isValides === 1 ? '' : 'opacity-0'}`}>
                                                                    <svg className="fill-current" width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z" fill="" />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            
                                                            <p>{item.libelle}</p>
                                                        </div>
                                                    </label>
                                                ))
                                            ) : (
                                                <div className="py-2 px-5">Aucune action trouvée</div>
                                            )}
                                        </div>


                                    </div>
                                </div>
                            {/* </div> */}

                        </div>

                        <div className="space-x-4 flex items-center justify-end p-5">
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

export default DetailCalendarModall;
