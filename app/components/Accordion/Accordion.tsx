import React, { useState } from 'react';
import { ResponseRessource } from '../../interfaces/Ressource';
import { formatDate } from '../../services/DateUtils';
import { useRouter } from 'next/navigation';

interface Task {
    id: number;
    libelle: string;
    dateDeb: string; // Format YYYY-MM-DD
    dateFin: string; // Format YYYY-MM-DD
    heures: number;
}

interface Project {
    id: number;
    name: string;
    tasks: Task[];
}

const projects: Project[] = [
    {
        id: 1,
        name: "Projet 1",
        tasks: [
            { id: 1, libelle: "Tâche 1", dateDeb: "2024-09-01", dateFin: "2024-09-05", heures: 10 },
            { id: 2, libelle: "Tâche 2", dateDeb: "2024-09-06", dateFin: "2024-09-10", heures: 15 },
        ],
    },
    {
        id: 2,
        name: "Projet 2",
        tasks: [
            { id: 3, libelle: "Tâche 1", dateDeb: "2024-09-11", dateFin: "2024-09-15", heures: 25 },
            { id: 4, libelle: "Tâche 2", dateDeb: "2024-09-16", dateFin: "2024-09-20", heures: 20 },
        ],
    },
];

interface ApiRessourceProps {
    project: ResponseRessource[];
}



const Accordion: React.FC<ApiRessourceProps> = ({project}) => {

    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (

        <div className='grid grid-cols-1 space-y-2'>
                {project.map((project, index) => {
                    
                    const totalHours = project.tasks.reduce((acc, task) => acc + Number(task.taskNombreHeurs), 0);

                    const isOverLimit = totalHours > 40;
                    const taskCount = project.tasks.length; // Compte le nombre de tâches

                    return (

                        <div key={project.projectId} className="bg-white ">
                            <div className="max-w-full mx-auto">
                            
                                <div className="px-8">
                                    
                                    <div className=''>
                                        <h5 id={`accordion-heading-${project.projectId}`}>
                                            <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-gray-500" onClick={() => toggleAccordion(index)} aria-expanded={openIndex === index} aria-controls={`accordion-body-${project.projectId}`}>

                                            <span className="text-black flex items-center space-x-5 ">
                                                <span className=" "> {project.projectName} </span>

                                                {totalHours < 40 ? (
                                                    <a onClick={() => navigateTo(`/admin/projet/${project.projectCodes}`)}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 1.5C9.22568 1.53366 6.57448 2.65072 4.6126 4.6126C2.65072 6.57448 1.53366 9.22568 1.5 12C1.53366 14.7743 2.65072 17.4255 4.6126 19.3874C6.57448 21.3493 9.22568 22.4663 12 22.5C14.7743 22.4663 17.4255 21.3493 19.3874 19.3874C21.3493 17.4255 22.4663 14.7743 22.5 12C22.4663 9.22568 21.3493 6.57448 19.3874 4.6126C17.4255 2.65072 14.7743 1.53366 12 1.5ZM18 12.75H12.75V18H11.25V12.75H6V11.25H11.25V6H12.75V11.25H18V12.75Z" fill="#012340" />
                                                        </svg>
                                                    </a>
                                                ) : null}
                                                

                                            </span>

                                                
                                                <svg className={`w-3 h-3 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                                                </svg>

                                            </button>
                                        </h5>
                                    </div>
                                    
                                    {openIndex === index && (
                                        <div id={`accordion-body-${project.projectId}`} className="">
                                            <table className="min-w-full border-collapse border border-stroke">
                                                
                                                <thead>
                                                    <tr className='border text-lg border-stroke bg-[#E3E3E3]'>
                                                        <th className=" px-4 py-2" colSpan={4}>
                                                            Lites des tâches : {taskCount}
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className=" pl-4 pr-3 text-left  font-semibold text-gray-900 sm:pl-6 px-4 py-2">Libellé</th>
                                                        <th className="pl-4 pr-3 text-left  font-semibold text-gray-900 sm:pl-6 px-4 py-2">Date de début</th>
                                                        <th className="pl-4 pr-3 text-left  font-semibold text-gray-900 sm:pl-6 px-4 py-2">Date de fin</th>
                                                        <th className="pl-4 pr-3 text-left  font-semibold text-gray-900 sm:pl-6 px-4 py-2">Heures</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {project.tasks.map(task => (
                                                        <tr key={task.taskId} className='border border-stroke'>
                                                            <td className="text-left px-4 py-2">{task.taskName}</td>
                                                            <td className="text-left px-4 py-2"> {formatDate(task.taskStartDate)} </td>
                                                            <td className="text-left px-4 py-2"> {formatDate(task.taskEndDate)} </td>
                                                            <td className="text-left px-4 py-2">{task.taskNombreHeurs} h </td>
                                                        </tr>
                                                    ))}

                                                    <tr className='border border-stroke'>
                                                        <td className=" text-lg  px-4 py-2 font-bold">Nombre total d’heures</td>
                                                        <td colSpan={2} className=" px-4 py-2 font-bold"></td>

                                                        <td className={` text-lg px-4 py-2 font-bold ${isOverLimit ? 'text-red-700' : 'text-green-700'}`}>
                                                            {totalHours} / 40 h {isOverLimit ? '(Indisponible)' : 'Disponible'}
                                                        </td>

                                                    </tr>
                                                </tbody>

                                            </table>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    );

                })}
        </div>
    );
};

export default Accordion;
