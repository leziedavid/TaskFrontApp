"use client";

import React, { useEffect, useState } from 'react'

import DataNotFound from '@/app/components/error/DataNotFound';
import {getAllProjectsEndTaskByUserId } from '@/app/services/ProjectService';
import { Toaster } from 'react-hot-toast';
import { Department } from '@/app/interfaces/Department';
import { useRouter } from 'next/navigation';
import { ResponseRessource } from '@/app/interfaces/Ressource';
import SelectDepartment from '@/app/components/Select2/SelectDepartment';
import SelectAllUsersByRessource from '@/app/components/Select2/SelectAllUsersByRessource';
import { Loader } from 'lucide-react';
import Accordion from '@/app/components/Accordion/Accordion';
import ComposeMenu from '@/app/components/resources/ComposeMenu';
import NoteFound from '@/app/components/error/NoteFound';
import SkeletonLoader from '@/app/components/SkeletonLoader';

const PAGE_SIZE = 8; // Nombre de trajets par page
export default function Page() {

    const router = useRouter();
    const navigateTo = (path: string) => {
        router.push(path);
    };

    const [departments, setDepartment] = useState("");
    const [nomUsers, setNomUsers] = useState("");
    const [state, setState] = useState("");
    // const [users, setUsers] = useState<number[]>([]);
    const [users, setUsers] = useState<number | null>(null);
    const [dataDepartment, setDataDepartment] = useState<Department[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [response, setResponse] = useState<ResponseRessource[]>([]);

    const fetchProjects = async (userId:number) => {

        setLoading(true);

        try {
            const response = await getAllProjectsEndTaskByUserId(userId);
            if (response && response.data) {
                setResponse(response.data);
            } else {
                setResponse([]);
            }

        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if(users){
            fetchProjects(users)
        }

        console.log(users);

    }, [departments,users]);


    const menuItems = [
        { label: 'Inbox', count: 3 },
        { label: 'Starred' },
        // Ajoute d'autres éléments si besoin
    ];

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Gestion des resources</h1>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-2">

                <div className="mb-2 z-50 flex flex-col gap-y-4 rounded-xl bg-white p-10 dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
                    
                    <div className="w-full xl:w-1/2 mb-2">
                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">Départements {users}</label>
                        <SelectDepartment setDepartment={setDepartment} departments={dataDepartment} />
                    </div>

                    <div className="w-full xl:w-1/2 mb-2">
                        <label className="mb-3 block text-lg font-medium text-black dark:text-white">Membre {users}</label>
                        <SelectAllUsersByRessource setUser={setUsers} departementId={departments ? parseInt(departments) : undefined} setNomUser={setNomUsers} />
                    </div>

                </div>



                {loading ? (
                <>
                {/* <SkeletonLoader /> */}

                    </>
                ) : (

                response && response.length ? (

                        <>
                        {nomUsers.length > 0 && (
                            <div className='text-2xl text-black font-bold px-8 mb-2'>
                                <h1> {nomUsers} est assigné à {response.length} projets</h1>
                            </div>
                        )}

                        <ComposeMenu nomUsers={nomUsers} projects={response} />

                        </>
    
                    ) : (
                        <NoteFound />
                    )
                )}

            </div>

        </>

    )
}
