"use client";

import React, { useEffect, useState } from 'react';
import ProjectStatisticsChart from './ProjectStatisticsChart';
import TaskStatisticsChart from './TaskStatisticsChart';
import UserStatisticsChart from './UserStatisticsChart';

interface StatsProps {
    totalProjectsPending: number;
    totalProjectsCompleted: number;
    totalProjectsInProgress: number;

    totalTasksInProgress: number;
    totalTasksPending: number;
    totalTasksCompleted: number;

    totalFemme: number;
    totalHomme: number;

}

const StatisticsDashboard: React.FC<StatsProps> = ({

    totalProjectsPending,
    totalProjectsCompleted,
    totalProjectsInProgress,
    totalTasksInProgress,
    totalTasksPending,
    totalTasksCompleted,
    totalFemme,
    totalHomme
}) => {


    const [authorisation, setAuthorisation] = useState<string | null>(null);
    useEffect(() => {
        const auth = localStorage.getItem('authorisation');
        setAuthorisation(auth);
    }, []);



    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-2 px-0">
            {/* Carte des statistiques de projets */}
            {(totalProjectsInProgress > 0 ||
                totalProjectsPending > 0 ||
                totalProjectsCompleted > 0) && (
                    <ProjectStatisticsChart
                        totalProjectsInProgress={totalProjectsInProgress}
                        totalProjectsPending={totalProjectsPending}
                        totalProjectsCompleted={totalProjectsCompleted}
                    />
                )}

            {(totalTasksInProgress > 0 ||
                totalTasksPending > 0 ||
                totalTasksCompleted > 0) && (
                    <TaskStatisticsChart
                        totalTasksInProgress={totalTasksInProgress}
                        totalTasksPending={totalTasksPending}
                        totalTasksCompleted={totalTasksCompleted}
                    />
                )}


            {/* Carte des statistiques d'utilisateurs */}
            {authorisation === 'ADMIN' || authorisation === 'MANAGER' || authorisation === 'GLOBAL_ADMIN' ? (

                totalFemme > 0 &&
                totalHomme > 0 && (
                    <UserStatisticsChart
                        totalFemme={totalFemme}
                        totalHomme={totalHomme}
                    />
                )

            ) : null}

        </div>
    );
};

export default StatisticsDashboard;
