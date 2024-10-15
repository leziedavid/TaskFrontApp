"use client";

import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast';
import { Project } from '@/app/interfaces/Global';
import { useRouter } from 'next/navigation';
import Comptes from '@/app/components/tabs/Comptes';
import Departements from '@/app/components/tabs/Departements';

const PAGE_SIZE = 8; // Nombre de trajets par page

const Tab: React.FC<{ id: string; title: string; icon: JSX.Element; onClick: (id: string) => void; activeTab: string }> = ({ id, title, icon, onClick, activeTab }) => {

    const isActive = activeTab === id;
    
        return (
    
            <li className="me-2">
                <a
                    href="#" className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${isActive ? 'text-[#F27F1B] border-[#F27F1B] dark:text-[#F27F1B] dark:border-[#F27F1B]' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                    onClick={(e) => { e.preventDefault(); onClick(id); }}
                    aria-current={isActive ? 'page' : undefined} >
                    {icon}
                    {title}
                </a>
            </li>
        );
    };


export default function Page() {

    const router = useRouter();

    const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE); // Taille de la page
    const [response, setResponse] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [activeTab, setActiveTab] = useState('compte'); // Onglet par défaut

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        handleTabChange(tabId);
    };

    // Fonction exécutée lors du changement d'onglet
    const handleTabChange = (tabId: string) => {
        console.log(`Tab changed to: ${tabId}`);
        // Ici tu peux ajouter n'importe quelle logique que tu souhaites exécuter lorsqu'un onglet est sélectionné
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-3">
                <h1 className="text-2xl font-semibold text-gray-900">PARAMETTRE DE L&apos;APPLICATION</h1>
            </div>

            <div className="border px-20 bg-white border-white dark:border-gray-700 mb-10">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    <Tab id="compte" title="UTULISATEURS"
                        icon={
                            <svg className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                        }
                        onClick={handleTabClick}
                        activeTab={activeTab}
                    />
                    <Tab id="departement" title="DEPARTEMENTS"
                        icon={
                            <svg className="w-4 h-4 me-2 text-gray-400 dark:text-[#F27F1B]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                            </svg>
                        }
                        onClick={handleTabClick}
                        activeTab={activeTab}
                    />

                </ul>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-2">

                <div className="border-stroke py-3 dark:border-strokedark sm:px-6 xl:px-7.5 flex justify-between items-center">

                        {activeTab === 'compte' && (
                            <Comptes />
                        )}
                        {activeTab === 'departement' && (
                            <Departements />
                        )}
                </div>

            </div>

        </>

    )
}
