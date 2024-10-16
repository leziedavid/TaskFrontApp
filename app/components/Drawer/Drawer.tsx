// components/Drawer.tsx
import React from 'react';
import { TaskDataCalendar } from '@/app/interfaces/CalendarsData';


interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTasks: TaskDataCalendar[]; // Utilisation de TaskDataCalendar
    openModalCalendar: (task: TaskDataCalendar) => void; // Changement ici aussi
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, selectedTasks, openModalCalendar }) => {
    return (
        <div
            className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} bg-white w-80 dark:bg-gray-800`}
            tabIndex={-1}
            aria-labelledby="drawer-right-label"
        >
            <h5 id="drawer-right-label" className="inline-flex items-center mb-4 text-base font-semibold text-black dark:text-gray-400">
                <svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                Tâches avec les mêmes dates
            </h5>
            <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close menu</span>
            </button>

            {/* Affichage des tâches */}
            {selectedTasks.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Tâches :</h2>
                    <ul>
                        {selectedTasks.map((task, index) => (
                            <li key={task.taskId} className="flex items-center p-3 text-sm text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => openModalCalendar(task)}>
                                <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-black rounded-full">{index + 1}</span>
                                {task.taskName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Drawer;
