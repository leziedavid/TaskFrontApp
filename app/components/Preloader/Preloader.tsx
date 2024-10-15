"use client";

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';

const Preloader: React.FC = () => {

    return (

        <div className="py-2">
            <div className="shadow rounded-md p-4 border-none py-4">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                        <div className="space-y-3">
                            <div className="flex justify-between gap-4">
                                <div className="h-3 bg-stone-400 rounded w-1/2"></div>
                                <div className="h-3 bg-stone-400 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t-4 mt-2 pt-2 border-dashed"></div>
                <div className="mt-2 flex justify-between">
                    <div className="animate-pulse rounded bg-stone-400 h-14 w-full"></div>
                </div>
                <div className="mt-2 flex justify-end gap-3">
                    <div className="animate-pulse rounded bg-stone-400 h-7 w-32"></div>
                    <div className="animate-pulse rounded bg-stone-400 h-7 w-32"></div>
                </div>
            </div>
        </div>

    );
};

export default Preloader;
