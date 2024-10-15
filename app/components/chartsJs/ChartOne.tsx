// components/ChartOne.tsx
"use client";

import React from 'react';
import ApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface PropsData {
    data?: any;
}

const ChartOne: React.FC<PropsData> = (props) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            height: 200
        },
        xaxis: {
            categories: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: any) => val,
        },
    };

    const series = [
        {
            name: 'Nombre de publication',
            data: [1, 3, 4, 4, 2, 19, 4, 59],
        },
    ];

    return (
        <div>
            <h3>Courbe d&apos;évolution du nombre de cours 2024</h3>
            <ApexCharts options={chartOptions} series={series} type="line" height={200} />
        </div>
    );
};

export default ChartOne;
