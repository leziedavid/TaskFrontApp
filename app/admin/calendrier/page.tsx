"use client";

import React, { useEffect, useState } from 'react'
import Pagination from '@/app/components/Pagination/Pagination';
import TablePreloader from '@/app/components/Preloader/TablePreloader';
import TableProject from '@/app/components/tabs/projetTabs';
import ProjetCard from '@/app/components/tabs/projetCard';
import SelectState from '@/app/components/Select2/SelectState';
import SelectPriorite from '@/app/components/Select2/SelectPriorite';
import SelectDepartment from '@/app/components/Select2/SelectDepartment';
import SelectAllUsers from '@/app/components/Select2/SelectAllUsers';
import PercentageSelect from '@/app/components/Select2/PercentageSelect';

import Image from 'next/image';
import DataNotFound from '@/app/components/error/DataNotFound';
import { getAllProjects, getFilteredProjects, projectsStatistics } from '@/app/services/ProjectService';
import { getProjectState } from '@/app/services/getStatistique';
import { Toaster } from 'react-hot-toast';
import { Project } from '@/app/interfaces/Global';
import { Department } from '@/app/interfaces/Department';
import { useRouter } from 'next/navigation';
import { TaskDataCalendar } from '@/app/interfaces/CalendarsData';
import { ActionDTO } from '@/app/interfaces/ActionDTO';
import DetailCalendarModal from '@/app/components/Modal/DetailCalendarModal';
import { getCalendarsData } from '@/app/services/CalendarsServices';
import { getActionsByTaskId } from '@/app/services/TaskActionServices';

const PAGE_SIZE = 8; // Nombre de trajets par page

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
};

const generateDaysInMonth = (year: number, month: number): number[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Function to group tasks by startDate and/or endDate
const groupTasksByDate = (tasks: TaskDataCalendar[]) => {
    const grouped: { [key: string]: TaskDataCalendar[] } = {};

    tasks.forEach(task => {
        const key = `${task.taskStartDate}-${task.taskEndDate}`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(task);
    });

    return grouped;
};

export default function Page() {

    const router = useRouter();
    const [tasks, setTasks] = useState<TaskDataCalendar[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('month');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedTasks, setSelectedTasks] = useState<TaskDataCalendar[]>([]);
    const [groupedTasks, setGroupedTasks] = useState<{ [key: string]: TaskDataCalendar[] }>({});

    // Option pour le modal :
    const [isModalOpenUsers, setIsModalOpen] = useState(false);
    const [data, setData] = useState<TaskDataCalendar | null>(null);
    const [actions, setActions] = useState<ActionDTO[]>([]);

    const fetchTasks = async (startDate: Date, endDate: Date) => {
        try {
            const response = await getCalendarsData(startDate, endDate);
            const tasksData = response.data;
            setTasks(tasksData);
            setGroupedTasks(groupTasksByDate(tasksData));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        const { start, end } = getMonthRange(currentDate);
        fetchTasks(start, end);
    }, [currentDate]);

    const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setViewType(event.target.value as 'day' | 'week' | 'month');
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'startDate') setStartDate(value);
        if (name === 'endDate') setEndDate(value);
    };

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    const handleButtonClick = (key: string) => {
        const tasksWithSameDates = tasks.filter(task => {
            const taskKey = `${task.taskStartDate}-${task.taskEndDate}`;
            return taskKey === key;
        });
        setSelectedTasks(tasksWithSameDates);
        console.log('Tasks with same dates:', tasksWithSameDates);

        scrollToBottom();

    };

    const getFilteredTasks = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return tasks.filter(task => {
            const taskStart = new Date(task.taskStartDate);
            const taskEnd = new Date(task.taskEndDate);
            return (
                (startDate === '' || taskStart <= end) &&
                (endDate === '' || taskEnd >= start)
            );
        });
    };

    const renderCalendar = () => {
        const filteredTasks = getFilteredTasks();
        const daysInMonth = generateDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const { start: monthStart, end: monthEnd } = getMonthRange(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);

        const daysToRender: (number | null)[] = Array((firstDayOfMonth + 6) % 7).fill(null).concat(daysInMonth);

        const numRows = Math.ceil(daysToRender.length / 7);

        return (
            <table className="w-full">
                <thead>
                    <tr className="grid grid-cols-7 rounded-t-sm bg-[#012340] text-white">
                        <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">Lundi</th>
                        <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Mardi</th>
                        <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Mercredi</th>
                        <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Jeudi</th>
                        <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Vendredi</th>
                        <th className="flex h-15 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5">Samedi</th>
                        <th className="flex h-15 items-center justify-center rounded-tr-sm p-1 text-xs font-semibold sm:text-base xl:p-5">Dimanche</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: numRows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="grid grid-cols-7">
                            {Array.from({ length: 7 }).map((_, colIndex) => {
                                const dayIndex = rowIndex * 7 + colIndex;
                                const day = daysToRender[dayIndex];
                                const date = day !== null ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;

                                const isCurrentDay = viewType === 'day' && date?.getDate() === currentDate.getDate();
                                const isDateInMonth = date && date >= monthStart && date <= monthEnd;
                                const tasksForDay = date ? filteredTasks.filter(task => {
                                    const taskStart = new Date(task.taskStartDate);
                                    const taskEnd = new Date(task.taskEndDate);
                                    return date >= taskStart && date <= taskEnd;
                                }) : [];

                                const groupedKey = `${tasksForDay[0]?.taskStartDate}-${tasksForDay[0]?.taskEndDate}`;
                                const hasMultipleTasks = groupedTasks[groupedKey]?.length > 1;

                                return (
                                    <td key={colIndex} className={`relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 ${isCurrentDay ? 'bg-blue-100' : ''}`}>
                                        {isDateInMonth && day !== null && (
                                            <>
                                                <span className="font-medium text-black dark:text-white">
                                                    {day}
                                                </span>
                                                {hasMultipleTasks ? (

                                                    <span onClick={() => handleButtonClick(groupedKey)} className="absolute top-1 right-1 p-1  text-black rounded" >
                                                        Voir plus
                                                    </span>

                                                ) : (
                                                    tasksForDay.map(task => (
                                                        <div key={task.taskId} className="absolute left-2 top-1 flex w-full flex-col rounded-sm border-l-[3px] bg-gray px-3 py-1 text-left" style={{ borderColor: getRandomColor() }}>
                                                            <span onClick={() => openModalCalendar(task)} className="vuetext-[11px] font-semibold text-black dark:text-white">
                                                                {task.taskName}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };


    const openModalCalendar = async (data: TaskDataCalendar) => {
        try {
            const response = await getActionsByTaskId(data.taskId);
            setActions(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
        setData(data);
        setIsModalOpen(true);
    };

    const closeModalUsers = () => {
        setIsModalOpen(false);
    };


    // Définir les fonctions pour défiler
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'  // Pour un défilement fluide
        });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Pour un défilement fluide
        });
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Calendrier</h1>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-2">

                <div className="p-4">
                    <div className="mb-4 flex items-center gap-4">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Mois précédent
                        </button>

                        <button
                            onClick={handleNextMonth}
                            className="p-2 border border-gray-300 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Mois suivant
                        </button>

                        {/* <select value={viewType} onChange={handleViewChange} className="p-2 border border-gray-300 rounded">
                            <option value="day">Jour</option>
                            <option value="week">Semaine</option>
                            <option value="month">Mois</option>
                        </select> */}

                        <span className="text-lg font-semibold uppercase">{currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                    </div>

                    <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        {renderCalendar()}
                    </div>

                    {selectedTasks.length > 0 && (
                        <div className="p-4 mt-4 border border-white bg-white rounded">
                            <h2 className="text-xl font-semibold">Tâches avec les mêmes dates :</h2>
                            <ul>
                                {selectedTasks.map((task, index) => (

                                    <ol key={task.taskId} className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-white rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">

                                        <li onClick={() => openModalCalendar(task)} className="flex items-center text-black dark:text-black cursor-pointer">
                                            <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-black rounded-full shrink-0 dark:border-black"> {index + 1} </span>
                                            {task.taskName}
                                            <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                                            </svg>
                                        </li>

                                    </ol>

                                ))}
                            </ul>
                        </div>
                    )}

                </div>


                <DetailCalendarModal
                    datas={data}
                    actions={actions}
                    buttonColor="#D32F2F"
                    actionMessage="DETAIL DE LA TACHE" // Message de confirmation
                    onDeleteMessage="VALIDER" // Texte du bouton de suppression
                    onCloseMessage="ANNULER" // Texte du bouton d'annulation
                    idModale="static-modal" // ID du modal (peut être utilisé pour les tests d'automatisation ou de styles CSS spécifiques)
                    isOpen={isModalOpenUsers} // État d'ouverture du modal
                    onClose={closeModalUsers} // Fonction de fermeture du modal
                />

            </div>

        </>

    )
}
