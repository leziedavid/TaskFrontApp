"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon, MessageCircle as MessageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUnreadNotifications } from '@/app/services/NotifService';
import { NotificationDTO } from '@/app/interfaces/Notification';



const Header: React.FC<{ setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setSidebarOpen }) => {
    const router = useRouter();

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [usersName, setUsersName] = useState<string | null>(null);
    const [usersId, setUsersId] = useState<string | null>(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const [response, setResponse] = useState<NotificationDTO[] | null>(null);
    // const { id } = useParams<{ id: string }>();


    const extractHour = (isoString: string): string => {
        // Créez un objet Date à partir de la chaîne ISO
        const date = new Date(isoString);

        // Obtenez l'heure et les minutes en format 24h
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');

        // Retournez l'heure au format HH:mm
        return `${hours}:${minutes}`;
    };

    const getNotifications = async () => {
        try {
            const resp = await getUnreadNotifications();
            setResponse(resp.data)

        } catch (error) {

            console.error('Erreur lors de la récupération du message :', error);
        }
    };

    useEffect(() => {
        getNotifications();
    }, []);

    const [notifications] = useState<string[]>([
        "Notification 1",
        "Notification 2 avec un message un peu plus long pour voir le retour à la ligne",
        "Notification 3"
    ]);

    useEffect(() => {
        const users = localStorage.getItem('users');
        setUsersName(users);
        const version = localStorage.getItem('version');
        const idUsers = version ? version.split('@')[1] : null;
        setUsersId(idUsers);

    }, []);


    const userNavigation = [
        { name: usersName ? usersName : 'Votre profil', href: '#' }, // Utilise usersName s'il existe, sinon 'Votre profil'
        {
            name: 'Paramètres',
            onClick: () => router.push(`/admin/configuration/${usersId}`) // Utilise usersName ici
        },
        { name: 'Déconnexion', href: '#' },
    ];


    // Fonction pour gérer la déconnexion
    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('Graphe');
        document.cookie = 'token=; Max-Age=0; path=/';
        document.cookie = 'Graphe=; Max-Age=0; path=/';
        router.push('/');
    };

    const checkToken = useCallback(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
            router.push('/');
            return;
        }
    }, [router]);

    useEffect(() => {
        checkToken();
    }, [checkToken]);


    return (

        <div className=" mb-5 sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <button type="button" className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden" onClick={() => setSidebarOpen(true)}>
                <MenuIcon className="h-6 w-6" />
            </button>
            <div className="flex flex-1 justify-end px-4">

                <div className="ml-4 flex items-center md:ml-6">

                    {/* <button type="button" className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" >
                        <BellIcon className="h-6 w-6" />
                    </button> */}


                    {/* Menu des notifications */}
                    <Menu as="div" className="relative">
                        <div>
                            <Menu.Button className="flex rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                <BellIcon className="h-6 w-6" />
                            </Menu.Button>
                        </div>

                        <Transition
                            as={React.Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {response && response.length > 0 ? (
                                    response.map((item, index) => (
                                        <Menu.Item key={index}>
                                            {({ active }) => (
                                                <div className={`flex items-start px-4 py-3 text-sm ${active ? 'bg-gray-100' : ''} border-b border-gray-200`}>
                                                    <MessageIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                                                    <span className="whitespace-normal break-words flex-1">
                                                        <h6 className="text-sm font-medium text-black dark:text-white">
                                                            {item.userAddBBy[0].firstname}  {item.userAddBBy[0].lastname}
                                                        </h6>
                                                        <p className="text-sm">{item.title} </p>
                                                        <p className="text-xs"> {extractHour(item.createdAt)} min par {item.userAddBBy[0].firstname}  {item.userAddBBy[0].lastname}</p>
                                                    </span>
                                                </div>
                                            )}
                                        </Menu.Item>
                                    ))
                                ) : (
                                    <div className="block px-4 py-2 text-sm text-gray-700">Aucune notification</div>
                                )}
                            </Menu.Items>
                        </Transition>
                    </Menu>

                    {/* Menu utilisateur */}

                    <Menu as="div" className="relative ml-3">


                        <div>
                            <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                <span className="sr-only">Open user menu</span>
                                <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                            </Menu.Button>
                        </div>

                        <Transition
                            as="div"
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">

                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                        {({ active }) => (
                                            item.name === 'Déconnexion' ? (
                                                <a onClick={handleSignOut} className={`${active ? 'bg-gray-100' : ''} cursor-pointer block px-4 py-2 text-sm text-gray-700`}>
                                                    {item.name}
                                                </a>
                                            ) : item.name === 'Paramètres' ? (
                                                <a
                                                    onClick={() => router.push(`/admin/configuration/${usersId}`)}
                                                    className={`${active ? 'bg-gray-100' : ''} cursor-pointer block px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <a href={item.href} className={`${active ? 'bg-gray-100' : ''} cursor-pointer block px-4 py-2 text-sm text-gray-700`}>
                                                    {item.name}
                                                </a>
                                            )
                                        )}
                                    </Menu.Item>
                                ))}
                            </Menu.Items>

                        </Transition>

                    </Menu>

                </div>
            </div>
        </div>

    );
};

export default Header;
