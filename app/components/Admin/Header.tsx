"use client";

import React, { useCallback, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Déconnexion', href: '#' },
];

const Header: React.FC<{ setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setSidebarOpen }) => {
    const router = useRouter();

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
                    <button
                        type="button"
                        className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        <BellIcon className="h-6 w-6" />
                    </button>
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
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                        {({ active }) => (
                                            item.name === 'Déconnexion' ? (
                                                <button onClick={handleSignOut} className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`} > {item.name} </button>
                                            ) : (
                                                <a href={item.href} className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`} > {item.name} </a>
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
