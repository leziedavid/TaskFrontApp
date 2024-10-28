"use client";

import { GalleryVerticalEnd, Route } from 'lucide-react';
import React from 'react';
import Image from 'next/image';


const NoteFound: React.FC = () => {

    return (

        <>
        <div className="py-0">
        <div className=" rounded-md p-4 border-none py-4">
            <div className="h-44 flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="text-center text-sm font-semibold">

                        <Image src="/img/loader.png" // Remplace par le chemin de ton image
                            alt="Loading"
                            width={180} // Correspond à h-12
                            height={180} // Correspond à w-12
                            className="animate-pulse"
                        />
                        <div className="text-center text-lg font-bold">Aucune données</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>

    );
};

export default NoteFound;
