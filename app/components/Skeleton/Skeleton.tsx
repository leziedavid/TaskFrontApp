import React from 'react';

const Skeleton: React.FC = () => {
    return (
        <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center">
            <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700"></div>
            <div className="w-full">
                <div className="h-2.5 bg-white rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-3 bg-white rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                <div className="h-3 bg-white rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-3 bg-white rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                <div className="h-3 bg-white rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                <div className="h-3 bg-white rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Skeleton;
