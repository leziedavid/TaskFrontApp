import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { NotificationDTO } from '../../interfaces/Notification'; // Assurez-vous que le chemin est correct
import { getNotificationsByProjectId } from '../../services/NotifService';
import DateConverter from '../DateConverter';

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

                <ol className="overflow-hidden space-y-18">

                    {notifications && notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                            <li key={notif.entityId} className=" relative flex-1 after:content-[''] after:w-0.5 after:h-full after:bg-[#BDBDBD] after:inline-block after:absolute after:-bottom-11 after:left-4 lg:after:left-5">
                        
                            <a className="flex font-medium w-full">
                                <span className="w-28 h-8 bg-[#012340] relative z-20 border-2 after:bg-[#BDBDBD] rounded-full flex justify-center items-center mr-3 text-sm text-white lg:w-10 lg:h-10">
                                <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.9375 0C9.22274 6.04224e-06 9.50295 0.0626184 9.74998 0.181544C9.997 0.30047 10.2021 0.471519 10.3448 0.6775H11.375C11.806 0.6775 12.2193 0.820258 12.524 1.07437C12.8288 1.32848 13 1.67313 13 2.0325V10.1625C13 11.0609 12.572 11.9225 11.8101 12.5578C11.0483 13.1931 10.0149 13.55 8.9375 13.55H1.625C1.19402 13.55 0.780698 13.4072 0.475951 13.1531C0.171205 12.899 0 12.5544 0 12.195V2.0325C0 1.67313 0.171205 1.32848 0.475951 1.07437C0.780698 0.820258 1.19402 0.6775 1.625 0.6775H2.65525C2.79787 0.471519 3.003 0.30047 3.25002 0.181544C3.49705 0.0626184 3.77726 6.04224e-06 4.0625 0H8.9375ZM8.7945 4.99927L5.34787 7.8739L4.19819 6.91524C4.04495 6.79183 3.83971 6.72354 3.62667 6.72509C3.41364 6.72663 3.20985 6.79788 3.05921 6.9235C2.90857 7.04911 2.82312 7.21904 2.82126 7.39667C2.81941 7.57431 2.90131 7.74545 3.04931 7.87323L4.71494 9.26278C4.79794 9.33202 4.89648 9.38695 5.00494 9.42442C5.1134 9.46189 5.22966 9.48118 5.34706 9.48118C5.46447 9.48118 5.58072 9.46189 5.68918 9.42442C5.79765 9.38695 5.89619 9.33202 5.97919 9.26278L9.94419 5.95726C10.0196 5.89431 10.0795 5.81959 10.1203 5.73736C10.1611 5.65514 10.182 5.56701 10.182 5.47803C10.182 5.38904 10.1609 5.30093 10.12 5.21872C10.0792 5.13652 10.0193 5.06184 9.94378 4.99893C9.86829 4.93603 9.77868 4.88614 9.68007 4.85212C9.58146 4.81809 9.47578 4.8006 9.36906 4.80063C9.26234 4.80066 9.15667 4.81822 9.05809 4.8523C8.9595 4.88638 8.86994 4.93633 8.7945 4.99927ZM8.53125 1.355H4.46875C4.37367 1.35497 4.28158 1.38276 4.20854 1.43352C4.13549 1.48427 4.08612 1.55479 4.069 1.63277L4.0625 1.69375V2.37125C4.06247 2.45053 4.09579 2.52732 4.15666 2.58823C4.21753 2.64913 4.30209 2.69031 4.39563 2.70458L4.46875 2.71H8.53125C8.62633 2.71003 8.71842 2.68224 8.79146 2.63148C8.86451 2.58073 8.91389 2.51022 8.931 2.43223L8.9375 2.37125V1.69375C8.93753 1.61447 8.90421 1.53768 8.84334 1.47677C8.78247 1.41587 8.69791 1.37469 8.60437 1.36042L8.53125 1.355Z" fill="white"/>
                                </svg>

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
