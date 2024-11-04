"use client";

import React, { useEffect, useState } from 'react'
import { Users, User, Car, Hash, Route, Wallet, MessageSquareDot, MessageSquareMore, Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

import TrajetPreloader from '@/app/components/Preloader/TrajetPreloader';
import ClientTrajetNotFound from '@/app/components/error/NoteFound';
import { GlobalStatsDTO } from '@/app/interfaces/globalStatsDTO';
import { getStatistique } from '@/app/services/getStatistique';
import SkeletonLoader from '@/app/components/SkeletonLoader';
import NoteFound from '@/app/components/error/NoteFound';
const StatisticsDashboard = dynamic(() => import('@/app/components/Charts/StatisticsDashboard'), { ssr: false });
const BarChartComponent = dynamic(() => import('@/app/components/chartsJs/BarChart'), { ssr: false });

export default function Page() {


    const [authorisation, setAuthorisation] = useState<string | null>(null);
    useEffect(() => {
        const auth = localStorage.getItem('authorisation');
        setAuthorisation(auth);
    }, []);
    

    const [dataStats, setDataStats] = useState<any[]>([]);
    const [dataStats2, setDataStats2] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    const [response, setResponse] = useState<GlobalStatsDTO | null>(null);

    const [totalProjectsInProgress, SetTotalProjectsInProgress] = useState(0);
    const [totalProjectsPending, SetTotalProjectsPending] = useState(0);
    const [totalProjectsCompleted, SetTotalProjectsCompleted] = useState(0);
    const [totalTasksInProgress, SetTotalTasksInProgress] = useState(0);
    const [totalTasksPending, SSetTotalTasksPending] = useState(0);
    const [totalTasksCompleted, SetTotalTasksCompleted] = useState(0);

    const [totalUsers, SetTotalUsers] = useState(0);
    const [totalProjects, SetTotalProjects] = useState(0);

    const [totalTasks, SetTotalTasks] = useState(0);
    const [totalDepartments, SetTotalDepartments] = useState(0);
    const [totalWomen, SetTotalWomen] = useState(0);
    const [totalMen, SetTotalMen] = useState(0);

    const fetchProjects = async () => {

        try {

            const apiResponse = await getStatistique();
            setResponse(apiResponse.data);
            if(apiResponse.data){
                setLoading(false);
            }

        } catch (error) {

        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);


    useEffect(() => {
        if (response) {
            SetTotalProjectsInProgress(response.totalProjectsInProgress);
            SetTotalProjectsPending(response.totalProjectsPending);
            SetTotalProjectsCompleted(response.totalProjectsCompleted);

            SetTotalTasksInProgress(response.totalTasksInProgress);
            SSetTotalTasksPending(response.totalTasksPending);
            SetTotalTasksCompleted(response.totalTasksCompleted);

            SetTotalUsers(response.totalUsers);
            SetTotalProjects(response.totalProjects);

            SetTotalTasks(response.totalTasks);
            SetTotalDepartments(response.totalDepartments);

            SetTotalWomen(response.totalWomen);
            SetTotalMen(response.totalMen);
        }
    }, [response]);



    const stats = {
        totalProjectsPending: 10,
        totalProjectsCompleted: 10,
        totalProjectsInProgress: 90,
        totalTasksInProgress: 3,
        totalTasksPending: 9,
        totalTasksCompleted: 1,
        totalFemme: 10,
        totalHomme: 20,

    };



    return (

        <>


            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>


            {loading ? (
                <>
                {/* <SkeletonLoader /> */}

                </>
            ) : (
                response ? (

                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-2">

                                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3 mb-3 ">

                                        <div className=" px-3 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                            <div className="flex items-center justify-between">
                                                <p className="text-black dark:text-white">Projets</p>
                                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white">
                                                    <path d="M12.5 7C13.0523 7 13.5 6.55228 13.5 6C13.5 5.44772 13.0523 5 12.5 5C11.9477 5 11.5 5.44772 11.5 6C11.5 6.55228 11.9477 7 12.5 7Z" fill="currentColor" />
                                                    <path d="M6.5 17H18.5V19H6.5V17ZM10.5 11.83L13.292 14.624L17.224 10.689L18.5 12V8H14.5L15.81 9.275L13.291 11.794L10.5 9L6.5 13L7.914 14.414L10.5 11.83Z" fill="currentColor" />
                                                    <path d="M19.5 3.00007H16.202C16.103 2.85282 15.9961 2.71096 15.882 2.57507L15.872 2.56307C15.137 1.70764 14.1034 1.16475 12.982 1.04507C12.6635 0.984977 12.3365 0.984977 12.018 1.04507C10.8966 1.16475 9.86298 1.70764 9.128 2.56307L9.118 2.57507C9.0039 2.71063 8.89708 2.85216 8.798 2.99907V3.00007H5.5C4.70459 3.00086 3.94199 3.31719 3.37956 3.87963C2.81712 4.44206 2.50079 5.20466 2.5 6.00007V20.0001C2.50079 20.7955 2.81712 21.5581 3.37956 22.1205C3.94199 22.6829 4.70459 22.9993 5.5 23.0001H19.5C20.2954 22.9993 21.058 22.6829 21.6204 22.1205C22.1829 21.5581 22.4992 20.7955 22.5 20.0001V6.00007C22.4992 5.20466 22.1829 4.44206 21.6204 3.87963C21.058 3.31719 20.2954 3.00086 19.5 3.00007ZM20.5 20.0001C20.5 20.2653 20.3946 20.5196 20.2071 20.7072C20.0196 20.8947 19.7652 21.0001 19.5 21.0001H5.5C5.23478 21.0001 4.98043 20.8947 4.79289 20.7072C4.60536 20.5196 4.5 20.2653 4.5 20.0001V6.00007C4.5 5.73485 4.60536 5.4805 4.79289 5.29296C4.98043 5.10543 5.23478 5.00007 5.5 5.00007H10.05C10.1648 4.43492 10.4714 3.92683 10.9179 3.56188C11.3644 3.19693 11.9233 2.99756 12.5 2.99756C13.0767 2.99756 13.6356 3.19693 14.0821 3.56188C14.5286 3.92683 14.8352 4.43492 14.95 5.00007H19.5C19.7652 5.00007 20.0196 5.10543 20.2071 5.29296C20.3946 5.4805 20.5 5.73485 20.5 6.00007V20.0001Z" fill="currentColor" />
                                                </svg>
                                            </div>

                                            <div className="mt-4 flex items-end justify-between">
                                                <div>
                                                    <h4 className="text-title-lg font-bold text-black dark:text-white">{totalProjects}</h4>
                                                    <span className="text-sm font-medium">Depuis la periode</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" px-3 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                            <div className="flex items-center justify-between">
                                                <p className="text-black dark:text-white">Tâches</p>
                                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.834 2C16.185 2.00001 16.5299 2.09243 16.834 2.26796C17.138 2.4435 17.3905 2.69597 17.566 3H18.834C19.3644 3 19.8731 3.21071 20.2482 3.58579C20.6233 3.96086 20.834 4.46957 20.834 5V17C20.834 18.3261 20.3072 19.5979 19.3695 20.5355C18.4318 21.4732 17.1601 22 15.834 22H6.83398C6.30355 22 5.79484 21.7893 5.41977 21.4142C5.0447 21.0391 4.83398 20.5304 4.83398 20V5C4.83398 4.46957 5.0447 3.96086 5.41977 3.58579C5.79484 3.21071 6.30355 3 6.83398 3H8.10198C8.27752 2.69597 8.52998 2.4435 8.83401 2.26796C9.13804 2.09243 9.48292 2.00001 9.83398 2H15.834ZM7.83398 5H6.83398V20H15.834C16.6296 20 17.3927 19.6839 17.9553 19.1213C18.5179 18.5587 18.834 17.7956 18.834 17V5H17.834C17.834 5.53043 17.6233 6.03914 17.2482 6.41421C16.8731 6.78929 16.3644 7 15.834 7H9.83398C9.30355 7 8.79484 6.78929 8.41977 6.41421C8.0447 6.03914 7.83398 5.53043 7.83398 5ZM17.072 9.379C17.2595 9.56653 17.3648 9.82084 17.3648 10.086C17.3648 10.3512 17.2595 10.6055 17.072 10.793L12.122 15.743C11.9345 15.9305 11.6801 16.0358 11.415 16.0358C11.1498 16.0358 10.8955 15.9305 10.708 15.743L8.58798 13.621C8.4102 13.4317 8.31304 13.1806 8.31707 12.9209C8.3211 12.6612 8.42601 12.4133 8.60959 12.2296C8.79318 12.0459 9.04103 11.9408 9.30071 11.9366C9.5604 11.9324 9.81153 12.0293 10.001 12.207L11.416 13.621L15.658 9.379C15.8455 9.19153 16.0998 9.08621 16.365 9.08621C16.6301 9.08621 16.8845 9.19153 17.072 9.379ZM15.834 4H9.83398V5H15.834V4Z" fill="black" />
                                                </svg>
                                            </div>

                                            <div className="mt-4 flex items-end justify-between">
                                                <div>
                                                    <h4 className="text-title-lg font-bold text-black dark:text-white">{totalTasks} </h4>
                                                    <span className="text-sm font-medium">Depuis la periode</span>
                                                </div>
                                            </div>
                                        </div>

                                        {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (
                                            <>
                                                <div className=" px-3 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-black dark:text-white">Utilisateurs</p>
                                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20.1394 18.6864C18.854 16.4305 16.8469 14.6727 14.4412 13.6961C15.6376 12.7988 16.5213 11.5479 16.9671 10.1205C17.413 8.69315 17.3985 7.16164 16.9256 5.74297C16.4527 4.3243 15.5454 3.09038 14.3323 2.21599C13.1192 1.34161 11.6617 0.871094 10.1662 0.871094C8.67083 0.871094 7.21332 1.34161 6.00018 2.21599C4.78704 3.09038 3.87976 4.3243 3.40687 5.74297C2.93398 7.16164 2.91945 8.69315 3.36533 10.1205C3.81122 11.5479 4.69491 12.7988 5.89124 13.6961C3.48554 14.6727 1.47847 16.4305 0.193115 18.6864C0.11347 18.8145 0.0603869 18.9572 0.0370216 19.1062C0.0136562 19.2552 0.0204856 19.4074 0.0571038 19.5537C0.093722 19.7 0.159381 19.8374 0.250179 19.9578C0.340976 20.0783 0.455057 20.1792 0.585641 20.2546C0.716225 20.3301 0.860644 20.3785 1.01031 20.397C1.15999 20.4155 1.31185 20.4038 1.45688 20.3624C1.60192 20.3211 1.73715 20.251 1.85456 20.1563C1.97196 20.0617 2.06914 19.9444 2.1403 19.8114C3.83905 16.8752 6.83905 15.1239 10.1662 15.1239C13.4934 15.1239 16.4934 16.8761 18.1922 19.8114C18.3464 20.0594 18.591 20.2377 18.8743 20.3086C19.1576 20.3795 19.4574 20.3375 19.7103 20.1914C19.9632 20.0453 20.1493 19.8066 20.2294 19.5257C20.3095 19.2449 20.2772 18.9439 20.1394 18.6864ZM5.29124 7.99891C5.29124 7.03472 5.57715 6.09219 6.11283 5.2905C6.6485 4.48881 7.40987 3.86397 8.30066 3.49499C9.19145 3.12602 10.1716 3.02947 11.1173 3.21758C12.063 3.40568 12.9316 3.86998 13.6134 4.55176C14.2952 5.23354 14.7595 6.10218 14.9476 7.04784C15.1357 7.9935 15.0391 8.9737 14.6702 9.86449C14.3012 10.7553 13.6763 11.5166 12.8746 12.0523C12.073 12.588 11.1304 12.8739 10.1662 12.8739C8.87377 12.8724 7.63466 12.3583 6.72074 11.4444C5.80682 10.5305 5.29273 9.29138 5.29124 7.99891Z" fill="black" />
                                                        </svg>
                                                    </div>

                                                    <div className="mt-4 flex items-end justify-between">
                                                        <div>
                                                            <h4 className="text-title-lg font-bold text-black dark:text-white">{totalUsers}</h4>
                                                            <span className="text-sm font-medium">Depuis la periode</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className=" px-3 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-black dark:text-white">Départements</p>
                                                        <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M20.2425 21.5V11.735C20.2425 11.33 19.9125 10.9925 19.5 10.9925H13.5V8H15V8.8925C15 9.23 15.27 9.5 15.6 9.5H18.1425C18.48 9.5 18.75 9.23 18.75 8.9V2.6075C18.75 2.27 18.48 2 18.15 2H15.6075C15.27 2 15 2.27 15 2.6075V3.5H13.5V1.19C13.5 0.8075 13.1925 0.5 12.81 0.5H1.44C1.0575 0.5 0.75 0.8075 0.75 1.19V21.485H2.235V17.7725C2.235 17.345 2.58 17 3.0075 17H11.2275C11.655 17 12 17.345 12 17.7725V21.5H11.2575V18.0125C11.2575 17.87 11.145 17.75 10.995 17.75H9.285C9.1425 17.75 9.0225 17.8625 9.0225 18.0125V21.5H6.75H20.2425ZM13.5 19.2575V17H14.625C14.835 17 15 17.1725 15 17.375V18.875C15 19.085 14.835 19.25 14.625 19.2575H13.5ZM13.5 15.5075V13.25H14.625C14.835 13.25 15 13.4225 15 13.625V15.125C15 15.335 14.835 15.5 14.625 15.5075H13.5ZM15 7.25H13.5V4.25H15V7.25ZM18.75 13.625V15.125C18.75 15.335 18.585 15.5 18.375 15.5075H16.86C16.65 15.5075 16.485 15.335 16.485 15.1325V13.625C16.485 13.415 16.6575 13.25 16.86 13.25H18.375C18.585 13.25 18.75 13.4225 18.75 13.625ZM18.75 17.375V18.875C18.75 19.085 18.585 19.25 18.375 19.2575H16.86C16.65 19.2575 16.485 19.085 16.485 18.8825V17.375C16.485 17.165 16.6575 17 16.86 17H18.375C18.585 17 18.75 17.1725 18.75 17.375ZM8.2575 2.375V3.875C8.2575 4.085 8.0925 4.25 7.8825 4.25H6.3675C6.1575 4.25 5.9925 4.0775 5.9925 3.875V2.375C5.9925 2.165 6.165 2 6.3675 2H7.8825C8.0925 2 8.2575 2.1725 8.2575 2.375ZM8.2575 7.625C8.2575 7.835 8.0925 8 7.8825 8H6.3675C6.1575 8 5.9925 7.8275 5.9925 7.625V6.125C5.9925 5.915 6.165 5.75 6.3675 5.75H7.8825C8.0925 5.75 8.2575 5.9225 8.2575 6.125V7.625ZM8.2575 9.875V11.375C8.2575 11.585 8.0925 11.75 7.8825 11.7575H6.3675C6.1575 11.7575 5.9925 11.585 5.9925 11.3825V9.875C5.9925 9.665 6.165 9.5 6.3675 9.5H7.8825C8.0925 9.5 8.2575 9.6725 8.2575 9.875ZM8.2575 13.625V15.125C8.2575 15.335 8.0925 15.5 7.8825 15.5075H6.3675C6.1575 15.5075 5.9925 15.335 5.9925 15.1325V13.625C5.9925 13.415 6.165 13.25 6.3675 13.25H7.8825C8.0925 13.25 8.2575 13.4225 8.2575 13.625ZM12.015 15.125C12.015 15.335 11.8425 15.5 11.64 15.5075H10.125C9.915 15.5075 9.75 15.335 9.75 15.1325V13.625C9.75 13.415 9.9225 13.25 10.125 13.25H11.64C11.85 13.25 12.015 13.4225 12.015 13.625V15.125ZM12.015 9.875V11.375C12.015 11.585 11.8425 11.75 11.64 11.7575H10.125C9.915 11.7575 9.75 11.585 9.75 11.3825V9.875C9.75 9.665 9.9225 9.5 10.125 9.5H11.64C11.85 9.5 12.015 9.6725 12.015 9.875ZM12.015 7.625C12.015 7.835 11.8425 8 11.64 8H10.125C9.915 8 9.75 7.8275 9.75 7.625V6.125C9.75 5.915 9.915 5.75 10.125 5.75H11.64C11.85 5.75 12.015 5.9225 12.015 6.125V7.625ZM12.015 2.375V3.875C12.015 4.085 11.8425 4.25 11.64 4.25H10.125C9.915 4.25 9.75 4.085 9.75 3.875V2.375C9.75 2.165 9.915 2 10.125 2H11.64C11.85 2 12.015 2.1725 12.015 2.375ZM4.5075 15.125C4.5075 15.335 4.3425 15.5 4.1325 15.5075H2.6175C2.4075 15.5075 2.2425 15.335 2.2425 15.1325V13.625C2.2425 13.415 2.415 13.25 2.6175 13.25H4.1325C4.3425 13.25 4.5075 13.4225 4.5075 13.625V15.125ZM4.5075 9.875V11.375C4.5075 11.585 4.3425 11.75 4.1325 11.7575H2.6175C2.4075 11.7575 2.2425 11.585 2.2425 11.3825V9.875C2.2425 9.665 2.415 9.5 2.6175 9.5H4.1325C4.3425 9.5 4.5075 9.6725 4.5075 9.875ZM4.5075 7.625C4.5075 7.835 4.3425 8 4.1325 8H2.6175C2.4075 8 2.2425 7.8275 2.2425 7.625V6.125C2.2425 5.915 2.415 5.75 2.6175 5.75H4.1325C4.3425 5.75 4.5075 5.9225 4.5075 6.125V7.625ZM4.5075 2.375V3.875C4.5075 4.085 4.3425 4.25 4.1325 4.25H2.6175C2.4075 4.25 2.2425 4.0775 2.2425 3.875V2.375C2.2425 2.165 2.415 2 2.6175 2H4.1325C4.3425 2 4.5075 2.1725 4.5075 2.375Z" fill="black" />
                                                            <path d="M8.25 21.5H6.015V18.0125C6.015 17.8625 6.135 17.75 6.2775 17.75H7.9875C8.13 17.75 8.25 17.8625 8.25 18.0125V21.5ZM5.235 18.0125V21.5H3V18.0125C3 17.8625 3.1125 17.75 3.2625 17.75H4.9725C5.1225 17.75 5.235 17.87 5.235 18.0125Z" fill="black" />
                                                        </svg>

                                                    </div>

                                                    <div className="mt-4 flex items-end justify-between">
                                                        <div>
                                                            <h4 className="text-title-lg font-bold text-black dark:text-white">{totalDepartments}</h4>
                                                            <span className="text-sm font-medium">Depuis la periode</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}

                                </div>

                                <StatisticsDashboard
                                totalProjectsPending={totalProjectsPending}
                                totalProjectsCompleted={totalProjectsCompleted}
                                totalProjectsInProgress={totalProjectsInProgress}

                                totalTasksInProgress={totalTasksInProgress}
                                totalTasksPending={totalTasksPending}
                                totalTasksCompleted={totalTasksCompleted}

                                totalFemme={totalWomen}
                                totalHomme={totalMen}
                            />

                            </div>



                        </>
                    
                    

                    ) : (
                        <NoteFound />
                    )
                )}


        </>
        
    )
}
