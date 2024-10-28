import React, { useEffect } from 'react';
import Image from 'next/image';

const SkeletonLoader: React.FC = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            const loader = document.getElementById('skeleton-loader');
            if (loader) {
                loader.style.display = 'none'; // Cache le loader après 3 secondes
            }
        }, 3000); // Durée par défaut de 3 secondes

        return () => clearTimeout(timer); // Nettoie le timer si le composant est démonté
    }, []);

    return (
        <div id="skeleton-loader" className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
            <div className="flex items-center justify-center bg-white-200  shadow-sm rounded-full dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70 p-5">
                <div className="flex justify-center mb-4">
                    <Image
                        src="/img/loader.png" // Remplace par le chemin de ton image
                        alt="Loading"
                        width={250} // Correspond à h-12
                        height={250} // Correspond à w-12
                        className="animate-pulse"
                    />
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
