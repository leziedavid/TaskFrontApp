"use client";

import React from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

interface UserStatisticsChartProps {
    totalFemme: number;
    totalHomme: number;
}

const UserOptions: ApexOptions = {
    chart: {
        fontFamily: 'Satoshi, sans-serif',
        type: 'donut',
    },
    colors: ['#D96941', '#033F73'],
    labels: ['Femmes','Hommes'],
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

const UserStatisticsChart: React.FC<UserStatisticsChartProps> = ({
    totalFemme,
    totalHomme,
}) => {
    const series = [totalFemme, totalHomme];

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
            <h2 className="text-lg text-black font-bold mb-2">Repartition des utilisateurs</h2>
            <div className="flex justify-center">
                <ReactApexChart options={UserOptions} series={series} type="donut"/>
            </div>


        </div>
    );
};

export default UserStatisticsChart;
