"use client";

import { GalleryVerticalEnd } from 'lucide-react';
import React from 'react';

const CommandsNotFound: React.FC = () => {

    return (

        <div className="py-2">
            <div className="rounded-md p-4 border-none py-4">
                <div className="h-80 flex justify-center items-center">
                    <div className="flex flex-col items-center">
                        <GalleryVerticalEnd name="GalleryVerticalEnd" stroke-width={0.85} className="h-20 w-20 font-extralight text-[#f7872e]" />
                        <div className="text-center text-lg">Aucune commande</div>
                    </div>
                </div>
            </div>
        </div>
    

    );
};

export default CommandsNotFound;
