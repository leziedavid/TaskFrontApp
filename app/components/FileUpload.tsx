import React, { ChangeEvent, useState } from 'react';

// Définir le type FileObject
interface FileObject {
    title: string;
    file: File | null;
}

// Props pour le composant FileUpload
interface Props {
    id:string;
    titles: string;
    setTitles: React.Dispatch<React.SetStateAction<string>>;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    fileObjects: FileObject[]; // Utilisation de FileObject ici
    setFileObjects: React.Dispatch<React.SetStateAction<FileObject[]>>;
    
}

const FileUpload: React.FC<Props> = ({ id,titles, setTitles, file, setFile, fileObjects, setFileObjects }) => {
    
    const handleTitleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const newFileObjects = [...fileObjects];
        newFileObjects[index].title = event.target.value;
        setFileObjects(newFileObjects);
    };


    const handleFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFileObjects = [...fileObjects];
            newFileObjects[index].file = files[0];
            setFileObjects(newFileObjects);
        }
    };

    const handleRemove = (index: number) => {
        const newFileObjects = [...fileObjects];
        newFileObjects.splice(index, 1);
        setFileObjects(newFileObjects);
    };

    const handleAddMore = () => {
        setFileObjects([...fileObjects, { title: '', file: null }]);
    };

    return (
        <div>
            {fileObjects.map((fileObject, index) => (
                <div key={index} className="md:flex md:items-center mb-4">

                    <div className="md:w-10/12">
                        <label className="block text-black dark:text-white mb-2">Titre du fichier {index+1} </label>
                        <input type="text" placeholder="Titre du fichier" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-black active:border-black disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white" value={fileObject.title} onChange={(e) => handleTitleChange(index, e)} />
                    </div>

                    <div className="md:w-10/12 md:ml-4 mt-4 md:mt-0">
                        <label className="block text-black dark:text-white mb-2">Joindre un fichier</label>
                        <input type="file" className="w-full py-2 px-3 rounded-md border border-stroke outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:text-sm focus:border-black file:focus:border-black active:border-black disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white" onChange={(e) => handleFileChange(index, e)} />
                    </div>

                    <div className="md:w-2/12 mt-4 md:mt-8 md:ml-4">
                        <button className="flex justify-center rounded bg-red-500 py-2 px-3 font-medium text-gray hover:bg-opacity-90" type="button" onClick={() => handleRemove(index)}>
                        <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.225 2.20005H10.3V1.77505C10.3 1.02505 9.70005 0.425049 8.95005 0.425049H7.02505C6.27505 0.425049 5.67505 1.02505 5.67505 1.77505V2.20005H3.75005C3.02505 2.20005 2.42505 2.80005 2.42505 3.52505V4.27505C2.42505 4.82505 2.75005 5.27505 3.22505 5.47505L3.62505 13.75C3.67505 14.775 4.52505 15.575 5.55005 15.575H10.4C11.425 15.575 12.275 14.775 12.325 13.75L12.75 5.45005C13.225 5.25005 13.55 4.77505 13.55 4.25005V3.50005C13.55 2.80005 12.95 2.20005 12.225 2.20005ZM6.82505 1.77505C6.82505 1.65005 6.92505 1.55005 7.05005 1.55005H8.97505C9.10005 1.55005 9.20005 1.65005 9.20005 1.77505V2.20005H6.85005V1.77505H6.82505ZM3.57505 3.52505C3.57505 3.42505 3.65005 3.32505 3.77505 3.32505H12.225C12.325 3.32505 12.425 3.40005 12.425 3.52505V4.27505C12.425 4.37505 12.35 4.47505 12.225 4.47505H3.77505C3.67505 4.47505 3.57505 4.40005 3.57505 4.27505V3.52505V3.52505ZM10.425 14.45H5.57505C5.15005 14.45 4.80005 14.125 4.77505 13.675L4.40005 5.57505H11.625L11.25 13.675C11.2 14.1 10.85 14.45 10.425 14.45Z" fill="white"></path>
                                <path d="M8.00005 8.1001C7.70005 8.1001 7.42505 8.3501 7.42505 8.6751V11.8501C7.42505 12.1501 7.67505 12.4251 8.00005 12.4251C8.30005 12.4251 8.57505 12.1751 8.57505 11.8501V8.6751C8.57505 8.3501 8.30005 8.1001 8.00005 8.1001Z" fill="white"></path>
                                <path d="M9.99994 8.60004C9.67494 8.57504 9.42494 8.80004 9.39994 9.12504L9.24994 11.325C9.22494 11.625 9.44994 11.9 9.77494 11.925C9.79994 11.925 9.79994 11.925 9.82494 11.925C10.1249 11.925 10.3749 11.7 10.3749 11.4L10.5249 9.20004C10.5249 8.87504 10.2999 8.62504 9.99994 8.60004Z" fill="white"></path>
                                <path d="M5.97497 8.60004C5.67497 8.62504 5.42497 8.90004 5.44997 9.20004L5.62497 11.4C5.64997 11.7 5.89997 11.925 6.17497 11.925C6.19997 11.925 6.19997 11.925 6.22497 11.925C6.52497 11.9 6.77497 11.625 6.74997 11.325L6.57497 9.12504C6.57497 8.80004 6.29997 8.57504 5.97497 8.60004Z" fill="white"></path>
                        </svg>

                        </button>
                    </div>

                </div>
                ))}

            <div className="md:w-6/12 mt-4 md:ml-4">
                <button className=" rounded-lg border flex justify-center bg-[#012340] py-2 px-8 font-medium text-white hover:bg-opacity-90" type="button" onClick={handleAddMore} >
                    Ajouter plus
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
