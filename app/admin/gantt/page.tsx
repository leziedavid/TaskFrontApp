"use client";

import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast';
const PAGE_SIZE = 8; // Nombre de trajets par page
export default function Page() {


    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="className">Hollo</div>

        </>

    )
}
