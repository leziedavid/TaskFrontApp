import React from 'react'


const Loaders: React.FC = () => {

    return (

        <div className="relative mt-10 bg-white mb-5">

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                {/* Contenu de cette div */}
            </div>

            <div className="absolute top-0 left-0 w-full h-[230px] bg-white rounded-lg">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-spin inline-block w-20 h-20 border-[4px] border-current border-t-transparent text-[#03233F] rounded-full" role="status" aria-label="loading">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
            
        </div>

)


};

export default Loaders