"use client";

import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { NotificationDTO } from '../../interfaces/Notification'; // Assurez-vous que le chemin est correct
import { getNotificationsByProjectId } from '../../services/NotifService';
import DateConverter from '../DateConverter';
import { Clock } from 'lucide-react';

interface ProjectStepProps {
    fetchProjectDetails: (code: string) => Promise<void>;
    id: string | undefined; //
}

const ProjectStep: React.FC<ProjectStepProps> = ({id}) => {

    const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);

    const toggleAccordion = (index: number) => {
        switch (index) {
            case 1:
                setIsOpen1(!isOpen1);
                break;
            case 2:
                setIsOpen2(!isOpen2);
                break;
            case 3:
                setIsOpen3(!isOpen3);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (id) {
            getNotificationsByProjectId(id)
                .then((data) => {
                    setNotifications(data);
                })
                .catch((error) => {
                    toast.error('Erreur lors de la récupération des notifications.');
                    console.error(error);
                });
        }
    }, [id]);


    const extractHour = (isoString: string): string => {
        // Créez un objet Date à partir de la chaîne ISO
        const date = new Date(isoString);
        
        // Obtenez l'heure et les minutes en format 24h
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        
        // Retournez l'heure au format HH:mm
        return `${hours}:${minutes}`;
    };
    
    


    return (

        <>
            <Toaster position="top-right" reverseOrder={false} />
            
            <section className="bg-white dark:bg-gray-900">

                <ol className="overflow-hidden space-y-18 px-5">

                    {notifications && notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                            
                            <li key={notif.entityId} className=" relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-[#BDBDBD] after:inline-block after:absolute after:-bottom-11 after:left-4 lg:after:left-5">
                        
                                <a className="flex font-medium w-full mt-5">
                                    <span className="w-8 h-8 bg-[#012340] relative z-20 border-2 after:bg-[#BDBDBD] rounded-full flex justify-center items-center mr-3 text-sm text-white lg:w-10 lg:h-10">
                                        <Clock />
                                    </span>

                                    <div className="block">
                                        <h4 className="text-base text-black  mb-1"><DateConverter dateStr={notif.createdAt} /> </h4>
                                        <p className="text-lg text-black max-w-lg mb-1 ">{notif.title} </p>
                                        <p className="text-[12px] text-gray-600 max-w-lg mb-2 ">@ { extractHour(notif.createdAt)} min par {notif.userAddBBy[0].firstname} {notif.userAddBBy[0].lastname}   </p>
                                    </div>
                                </a>

                            </li>
                        ))

                        ) : (
                            <ol className="overflow-hidden space-y-18">
                                <li className="whitespace-nowrap px-3 py-3 flex space-x-2 text-gray-600">
                                    Aucun notification trouvé
                                </li>
                            </ol>
                    )}

                </ol>

            </section>

        </>

    );
};

export default ProjectStep;
