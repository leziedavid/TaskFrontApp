"use client";

import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Calendar as CalendarIcon, BarChart as BarChartIcon, FolderKanban, Cog as CogIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChartIcon },
    { name: 'Projets', href: '/admin/projet', icon: FolderKanban },
    { name: 'Calendrier', href: '/admin/calendrier', icon: CalendarIcon },
    { name: 'Diagrame de gantt', href: '/admin/gantt', icon: BarChartIcon, roles: ['ADMIN', 'MANAGER', 'GLOBAL_ADMIN'] },
    { name: 'Gestion des ressources', href: '/admin/resources', icon: FolderKanban, roles: ['ADMIN', 'MANAGER', 'GLOBAL_ADMIN'] },
    { name: 'Configuration', href: '/admin/configuration', icon: CogIcon, roles: ['ADMIN', 'MANAGER', 'GLOBAL_ADMIN'] },
];

const Sidebar: React.FC<{ sidebarOpen: boolean; setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ sidebarOpen, setSidebarOpen }) => {

    const [authorisation, setAuthorisation] = useState<string | null>(null);
    const pathname = usePathname(); // Utilisation de usePathname pour obtenir le chemin actuel
    const dialogRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const auth = localStorage.getItem('authorisation');
        setAuthorisation(auth);
    }, []);

    // Fermer le menu si on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        if (sidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    return (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 md:hidden" onClose={() => setSidebarOpen(false)} initialFocus={dialogRef}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <div ref={dialogRef} className="fixed inset-0 flex z-40">
                            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 border-r border-gray-200">
                                <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-600 px-4 text-white">
                                    <span className="text-xl"> MobiTask </span>
                                </div>
                                <div className="flex flex-1 flex-col overflow-y-auto">
                                    <nav className="flex-1 space-y-1 px-2 py-4">
                                        {navigation.map((item) => {
                                            const hasAccess = !item.roles || (authorisation && item.roles.includes(authorisation));
                                            const isActive = pathname === item.href; // Vérification avec usePathname

                                            return hasAccess ? (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={`${isActive ? 'bg-orange-400 text-white' : 'text-white hover:bg-gray-500 hover:text-white'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                                    onClick={() => setSidebarOpen(false)} // Ferme le menu sur mobile
                                                >
                                                    <item.icon
                                                        className={`${isActive ? 'text-white' : 'text-white group-hover:text-white'} mr-3 flex-shrink-0 h-6 w-6`}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            ) : null;
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>

            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-gray-800 border-r border-gray-200">
                    <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-600 px-4 text-white">
                        <span className="text-xl"> MobiTask </span>
                    </div>
                    <div className="flex flex-1 flex-col overflow-y-auto">
                        <nav className="flex-1 space-y-1 px-2 py-4">
                            {navigation.map((item) => {
                                const hasAccess = !item.roles || (authorisation && item.roles.includes(authorisation));
                                const isActive = pathname === item.href; // Vérification avec usePathname

                                return hasAccess ? (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={`${isActive ? 'bg-orange-400 text-white' : 'text-white hover:bg-gray-500 hover:text-white'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                    >
                                        <item.icon
                                            className={`${isActive ? 'text-white' : 'text-white group-hover:text-white'} mr-3 flex-shrink-0 h-6 w-6`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                ) : null;
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
