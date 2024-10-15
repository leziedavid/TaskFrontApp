"use client";

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';

const TablePreloader: React.FC = () => {

    return (

        <div className="py-2">

            {/* <div className="overflow-hidden shadow md:rounded-lg"> */}
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <div className="h-2 w-1/2 bg-slate-200 rounded"></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="animate-pulse flex space-x-4">
                                            <div className="flex-1 space-y-6 py-1">
                                                <div className="flex gap-3 items-center">
                                                    <div>
                                                        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                                                    </div>
                                                    <div className="w-1/2 space-y-4">
                                                        <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                        <div className="h-2 w-full bg-slate-200 rounded"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div className="animate-pulse flex space-x-4">
                                            <div className="flex-1 space-y-6 py-1">
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                        <div className="animate-pulse flex space-x-4">
                                            <div className="flex-1 space-y-6 py-1">
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            {/* </div> */}
            
        </div>

    );
};

export default TablePreloader;
