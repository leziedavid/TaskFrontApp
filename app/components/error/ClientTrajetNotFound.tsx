"use client";

import { GalleryVerticalEnd, Route } from 'lucide-react';
import React from 'react';

const ClientTrajetNotFound: React.FC = () => {

    return (

        <div className="py-2">
        <div className="shadow rounded-md p-4 border-none py-4">
            <div className="h-44 flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <Route name="Route" className="h-20 w-20 font-extralight text-[#f7872e]" />
                    <div className="text-center text-lg font-bold">Aucune commande</div>
                    <div className="text-center text-sm font-semibold">Veuillez passer une commande pour voir vos informations</div>
                </div>
            </div>
        </div>
    </div>


    );
};

export default ClientTrajetNotFound;
