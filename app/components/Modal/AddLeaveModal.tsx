"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { BaseResponse } from '../../interfaces/ApiResponse';
import { Leave } from '../../interfaces/Leave';
import { getLeavesById, saveLeaves, updateLeave } from '../../services/LeaveServices';

type AddLeaveModalProps = {
    userId: number | undefined;
    leaveId: number | undefined;
    isdisabled: boolean;
    isShow: boolean;
    buttonColor: string;
    leaveMessage: string;
    onDeleteMessage: string;
    onCloseMessage: string;
    idModale: string;
    isOpen: boolean;
    onClose: () => void;
    fetchAllUser: () => Promise<void>;
};

const LeaveTypes = ['Vacation', 'Congé de maladie', 'Congé personnel']; // Exemple de types de congé
const Statuses = ['En attente', 'Approuvé', 'Rejeté']; // Exemple de statuts

const AddLeaveModal: React.FC<AddLeaveModalProps> = ({
    userId,
    leaveId,
    isdisabled,
    isShow,
    buttonColor,
    leaveMessage,
    onDeleteMessage,
    onCloseMessage,
    idModale,
    isOpen,
    onClose,
    fetchAllUser,
}) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [leaveType, setLeaveType] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);
    const [response, setResponse] = useState<BaseResponse<Leave[]> | null>(null);

    const clearFields = () => {
        setStartDate('');
        setEndDate('');
        setLeaveType('');
        setStatus('');
        setDescription('');
    };

    // Fonction pour convertir UTC en format local pour affichage
        const convertToLocal = (utcDate: string): string => {
            const date = new Date(utcDate);
            return date.toISOString().slice(0, -1); // Retirer le 'Z' de la fin
        };

        const convertToUTC = (localDate: string): string => {
            const date = new Date(localDate);
            return date.toISOString();
        };
    const saveLeave = async () => {
        setLoad(true);

        if (!startDate || !endDate || !leaveType || !status) {
            setLoad(false);
            toast.error("Tous les champs requis doivent être remplis.");
            return;
        }

        const leaveData = {
            userId: userId,
            startDate: convertToUTC(startDate),
            endDate: convertToUTC(endDate),
            leaveType,
            status,
            description,
        };

        try {
            let res;
            if (leaveId) {
                res = await updateLeave(leaveId, leaveData);
            } else {
                res = await saveLeaves(leaveData);
            }
            setResponse(res);
            if (res.code === 200 || res.code === 201) {
                toast.success(res.messages ?? 'Message par défaut');
                fetchAllUser();
                onClose();
                clearFields();
            } else {
                toast.error(res.messages ?? 'Message par défaut');
            }
        } catch (error) {
            toast.error("Erreur lors de la sauvegarde du congé.");
            console.error('Erreur lors de la sauvegarde du congé :', error);
        } finally {
            setLoad(false);
        }
    };

    const getLeaveById = async (id: number) => {
        try {
            const response = await getLeavesById(id);
            const data = response.data;

            if (response.code === 200 && data) {
                setStartDate(convertToLocal(response.data.startDate));
                setEndDate(convertToLocal(response.data.endDate));
                setLeaveType(data.leaveType);
                setStatus(data.status);
                setDescription(data.description);
            } else {
                toast.error("Erreur lors de la récupération du congé.");
            }
        } catch (error) {
            toast.error("Erreur lors de la récupération du congé.");
            console.error('Erreur lors de la récupération du congé:', error);
        }
    };

    useEffect(() => {
        if (leaveId) {
            getLeaveById(leaveId);
        } else {
            clearFields();
        }
    }, [leaveId]);

    const handleCheckboxChange = (type: 'leaveType' | 'status', value: string) => {
        if (type === 'leaveType') {
            setLeaveType(value);
        } else if (type === 'status') {
            setStatus(value);
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            {isOpen && (
                <div id={idModale} tabIndex={-1} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5">
                            <h3 className="text-xl font-semibold text-gray-900">{leaveMessage}</h3>
                            <button onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                                <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                            <div className="mb-0">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="startDate">Date de début <span className="text-red-700"> *</span></label>
                                <input
                                    type="datetime-local"
                                    disabled={isdisabled}
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                    className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                />
                            </div>
                            <div className="mb-0">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="endDate">Date de fin <span className="text-red-700"> *</span></label>
                                <input
                                    type="datetime-local"
                                    disabled={isdisabled}
                                    value={endDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                    className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                />
                            </div>
                            <div className="mb-0">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="leaveType">Type de congé <span className="text-red-700"> *</span></label>
                                <div className='flex gap-3'>
                                {LeaveTypes.map((type) => (
                                    <div key={type} className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            id={type}
                                            name="leaveType"
                                            value={type}
                                            checked={leaveType === type}
                                            onChange={() => handleCheckboxChange('leaveType', type)}
                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor={type} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{type}</label>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <div className="mb-0">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="status">Statut <span className="text-red-700"> *</span></label>
                                <div className='flex gap-3'>
                                {Statuses.map((statusOption) => (
                                    <div key={statusOption} className="flex items-center mb-2">
                                        <input
                                            type="radio"
                                            id={statusOption}
                                            name="status"
                                            value={statusOption}
                                            checked={status === statusOption}
                                            onChange={() => handleCheckboxChange('status', statusOption)}
                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor={statusOption} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{statusOption}</label>
                                    </div>
                                ))}
                                </div>
                                
                            </div>
                            <div className="mb-0">
                                <label className="mb-3 block text-lg font-medium text-black dark:text-white" htmlFor="description">Description</label>
                                <textarea
                                    disabled={isdisabled}
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    className="w-full rounded-lg border border-stroke py-2 px-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                />
                            </div>
                        </div>
                        <div className="space-x-4 flex items-center justify-end p-5">
                                <>
                                    {!isdisabled ? (
                                        <button onClick={saveLeave} type="button" className="py-2.5 px-5 text-sm font-medium text-white bg-[#012340] rounded-lg border border-gray-200  focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            {leaveId ? onDeleteMessage : "Sauvegarder"}
                                        </button>
                                    ) : (
                                        <button type="button"
                                            className="py-2.5 px-5 text-sm font-medium text-white bg-[#012340] rounded-lg border border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" >
                                            {onDeleteMessage}
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        type="button"
                                        className={`py-2.5 px-5 text-sm font-medium text-white rounded-lg inline-flex items-center focus:outline-none focus:ring-4`}
                                        style={{ backgroundColor: buttonColor }}
                                    >
                                        {onCloseMessage}
                                    </button>
                                </>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddLeaveModal;
