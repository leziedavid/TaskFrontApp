"use client";

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Image from 'next/image';

const TrajetPreloader: React.FC = () => {

    return (
        
        <div className="py-2">
            <div className=" rounded-md p-4 border-none py-4">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                            </div>
                            <div className="h-2 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="animate-pulse rounded bg-slate-200 h-10 w-3/5"></div>
                </div>
            </div>
        </div>

    );
};

export default TrajetPreloader;
