"use client";

import { Database, Route } from 'lucide-react';
import React from 'react';

const DataNotFound: React.FC = () => {

    return (

        <div className="py-2">
            <div className="shadow rounded-md p-4 border-none py-4">
                <div className="h-44 flex justify-center items-center">
                    <div className="flex flex-col items-center">
                        <Database name="Database" className="h-20 w-20 font-extralight text-[#f7872e]" />
                        <div className="text-center text-sm font-bold">Aucune donnée trouvée ... </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default DataNotFound;
