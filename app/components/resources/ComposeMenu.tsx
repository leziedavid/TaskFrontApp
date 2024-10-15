import React, { useEffect, useState } from 'react';
import { ResponseRessource } from '../../interfaces/Ressource';
import { formatDate } from '../../services/DateUtils';

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

interface ComposeMenuProps {
    projects: ResponseRessource[];
    nomUsers: string;
}

const ComposeMenu: React.FC<ComposeMenuProps> = ({ projects, nomUsers }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [totalHours, setTotalHours] = useState(0);
    const [hours, setHours] = useState<number[]>([]);
    const [isOverLimit, setIsOverLimit] = useState(false);


    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    // const handleProjectClick = (index: number) => {
    //     setSelectedProjectIndex(selectedProjectIndex === index ? null : index);
    // };

    const handleProjectClick = (index: number) => {
        // setSelectedProjectIndex(selectedProjectIndex === index ? null : index);
        setSelectedProjectIndex(index);
        const taskHours = projects[index].tasks.map(task => calculateTaskHours(task.taskStartDate, task.taskEndDate));
        setHours(taskHours);
        setTotalHours(taskHours.reduce((acc, h) => acc + h, 0)); // Total des heures
        const total = taskHours.reduce((acc, h) => acc + h, 0); // Total des heures
        setTotalHours(total);
        setIsOverLimit(total > 40); // Vérifie si totalHours dépasse 40

    };

    const calculateTaskHours = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1; // +1 pour inclure le jour de début
        return totalDays > 0 ? totalDays * 8 : 0; // 8 heures par jour
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    
    

    return (
        <div className="mt-7  flex w-full h-screen bg-white">
            {/* Menu à gauche */}
            <div className={`w-64 bg-white shadow-xl rounded-lg p-4 ${isOpen ? 'block' : 'hidden md:block'} h-full`}>
                <div className="h-16 flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="w-full bg-[#012340] hover:bg-[#012340] flex items-center justify-center text-gray-100 py-2 rounded space-x-2 transition duration-150"
                    >
                        <span>Liste des Projets</span>
                    </button>
                </div>
                {isOpen && (
                    <div className="pt-4 pb-8 border-t border-gray-300  h-screen ">
                        <div className='overflow-y-auto  h-2/3'>
                        <div className='grid grid-cols-1 gap-2 '>
                            {projects.map((project, index) => (
                                <div
                                    key={project.projectId}
                                    className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-100 transition duration-150"
                                    onClick={() => handleProjectClick(index)}
                                >
                                    <h5 className="text-black font-medium truncate">{project.projectName}</h5>
                                </div>
                            ))}
                        </div>
                        </div>
                        
                    </div>
                )}
            </div>

            {/* Tableau des tâches à droite */}
            <div className="flex-1 px-2 h-full">
                <div className="p-4 bg-white rounded-lg shadow-md h-full">
                    <h2 className="text-xl font-bold">Tableau de bord des tâches</h2>
                    {selectedProjectIndex !== null && (
                        
                        <div className="p-4">
                            <h2 className="text-xl font-bold">  Projet :  {projects[selectedProjectIndex].projectName} </h2>
                            <table className="min-w-full border-collapse border border-stroke">
                                <thead>

                                    <tr className='border text-lg border-stroke bg-[#E3E3E3]'>
                                        <th className="px-4 py-2" colSpan={4}>
                                            Liste des tâches : {projects[selectedProjectIndex].tasks.length}
                                        </th>
                                    </tr>
                                    
                                    <tr className='mt-6'>
                                        <th className="pl-4 pr-3 text-left font-semibold text-gray-900 text-nowrap">Libellé</th>
                                        <th className="pl-4 pr-3 text-left font-semibold text-gray-900 text-nowrap">Date de début</th>
                                        <th className="pl-4 pr-3 text-left font-semibold text-gray-900 text-nowrap">Date de fin</th>
                                        <th className="pl-4 pr-3 text-left font-semibold text-gray-900 text-nowrap">Heures</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects[selectedProjectIndex].tasks.map((task, index) => (
                                        <tr key={task.taskId} className='border border-stroke'>
                                            <td className="text-left px-4 py-2 ">{task.taskName}</td>
                                            <td className="text-left px-4 py-2 text-nowrap">{formatDate(task.taskStartDate)}</td>
                                            <td className="text-left px-4 py-2 text-nowrap">{formatDate(task.taskEndDate)}</td>
                                            <td className="text-left px-4 py-2">{hours[index]} H </td>
                                        </tr>
                                    ))}

                                    <tr className='border border-stroke'>
                                        <td className=" text-lg  px-4 py-2 font-bold">Nombre total d’heures</td>
                                        <td colSpan={2} className=" px-4 py-2 font-bold"></td>

                                        <td className={`text-nowrap text-sm px-1 py-1 font-bold ${isOverLimit ? 'text-red-700' : 'text-green-700'}`}>
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
};

export default ComposeMenu;
