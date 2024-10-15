"use client";

import React from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface TaskStatisticsChartProps {
    totalTasksInProgress: number;
    totalTasksPending: number;
    totalTasksCompleted: number;
}

const taskOptions: ApexOptions = {
    chart: {
        fontFamily: 'Satoshi, sans-serif',
        type: 'donut',
    },
    colors: ['#D96941', '#033F73', '#038C4C'],
    labels: ['En cours','En attente', 'Terminés'],
    legend: {
        show: true,
        position: 'left',
        fontSize: '15px',
    },
    plotOptions: {
        pie: {
            donut: {
                size: '65%',
                background: 'transparent',
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    responsive: [
        {
            breakpoint: 2600,
            options: {
                chart: {
                    width: 300,
                },
            },
        },
        {
            breakpoint: 640,
            options: {
                chart: {
                    width: 200,
                },
            },
        },
    ],
};

const TaskStatisticsChart: React.FC<TaskStatisticsChartProps> = ({
    totalTasksInProgress,
    totalTasksPending,
    totalTasksCompleted,
}) => {
    const series = [totalTasksInProgress, totalTasksPending, totalTasksCompleted];

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <h2 className="text-lg text-black font-bold mb-2">Statistiques sur les tâches</h2>
            <div className="flex justify-center">
                <ReactApexChart options={taskOptions} series={series} type="donut"/>
            </div>


        </div>
    );
};

export default TaskStatisticsChart;
