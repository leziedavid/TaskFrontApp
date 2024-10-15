"use client";

import React from 'react';
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-2 px-0">
            {/* Carte des statistiques de projets */}
            <ProjectStatisticsChart
            
                totalProjectsInProgress={totalProjectsInProgress}
                totalProjectsPending={totalProjectsPending}
                totalProjectsCompleted={totalProjectsCompleted}/>

            {/* Carte des statistiques de tâches */}
            <TaskStatisticsChart
                totalTasksInProgress={totalTasksInProgress}
                totalTasksPending={totalTasksPending}
                totalTasksCompleted={totalTasksCompleted}
            />
            {/* Carte des statistiques de tâches */}
            <UserStatisticsChart
                totalFemme={totalFemme}
                totalHomme={totalHomme}
            />
        </div>
    );
};

export default StatisticsDashboard;
