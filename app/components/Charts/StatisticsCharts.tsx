"use client";

import React from 'react';
import ApexCharts from 'react-apexcharts';
import 'tailwindcss/tailwind.css';
import { ApexOptions } from 'apexcharts';

interface StatsProps {
    totalProjectsPending: number;
    totalProjectsCompleted: number;
    totalProjectsInProgress: number;
    totalTasksInProgress: number;
    totalTasksPending: number;
    totalTasksCompleted: number;
}

const StatisticsCharts: React.FC<StatsProps> = ({

    totalProjectsPending,
    totalProjectsCompleted,
    totalProjectsInProgress,
    totalTasksInProgress,
    totalTasksPending,
    totalTasksCompleted

}) => {
    // Données pour les graphiques en anneau
    const projectsData = {
        series: [totalProjectsPending, totalProjectsCompleted,totalProjectsInProgress],
        options: {
            chart: {
                type: 'donut' as 'donut', // Spécifie le type exact
            },
            labels: ['Pending Projects', 'Completed Projects'],
            colors: ['#ff6384', '#36a2eb'],
            legend: {
                position: 'top' as 'top', // Position de la légende
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '70%',
                    }
                }
            },
            dataLabels: {
                enabled: true,
            }
        } as ApexOptions // Typage des options
    };

    const tasksData = {
        series: [totalTasksInProgress, totalTasksPending, totalTasksCompleted],
        options: {
            chart: {
                type: 'donut' as 'donut', // Spécifie le type exact
            },
            // labels: ['In Progress Tasks', 'Pending Tasks', 'Completed Tasks'],
            colors: ['#ffce56', '#ff6384', '#36a2eb'],
            legend: {
                position: 'top' as 'top', // Position de la légende
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '70%',
                    }
                }
            },
            dataLabels: {
                enabled: true,
            }
        } as ApexOptions // Typage des options
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-3 gap-4 p-4">
            {/* Carte des statistiques de projets */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
                <h2 className="text-lg font-bold mb-2">Project Statistics</h2>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-4">
                        <ul className="list-disc list-inside text-left space-y-1">
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-2 bg-[#ff6384] rounded-sm"></span>
                                En cours ({totalProjectsPending})
                            </li>
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-2 bg-[#36a2eb] rounded-sm"></span>
                                Terminer ({totalProjectsCompleted})
                            </li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 p-4">
                        <ApexCharts options={projectsData.options} series={projectsData.series} type="donut" height={300} />
                    </div>
                </div>
            </div>

            {/* Carte des statistiques de tâches */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
                <h2 className="text-lg font-bold mb-2">Task Statistics</h2>
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-4">
                        <ul className="list-disc list-inside text-left space-y-1">
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-2 bg-[#ffce56] rounded-sm"></span>
                                In Progress Tasks: {totalTasksInProgress}
                            </li>
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-2 bg-[#ff6384] rounded-sm"></span>
                                Pending Tasks: {totalTasksPending}
                            </li>
                            <li className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-2 bg-[#36a2eb] rounded-sm"></span>
                                Completed Tasks: {totalTasksCompleted}
                            </li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/2 p-4">
                        <ApexCharts options={tasksData.options} series={tasksData.series} type="donut" height={300} />
                    </div>
                </div>
            </div>

            {/* Ajoutez ici les deux autres cartes pour compléter le tableau de bord */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
                <h2 className="text-lg font-bold mb-2">Additional Chart 1</h2>
                {/* Ajoutez ici votre graphique ou contenu */}
            </div>
        </div>
    );
};

export default StatisticsCharts;
