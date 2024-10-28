"use client";

import React, { useEffect, useState } from 'react';
import { FileObject } from '../../interfaces/FileObject';

import toast, { Toaster } from 'react-hot-toast';
import FileUpload2 from '../FileUpload2';

// services
interface AddFilesCardProps {
    fetchProjectDetails: (code: string) => Promise<void>;
    id: string | undefined; //
}

const AddFilesCard: React.FC<AddFilesCardProps> = ({fetchProjectDetails,id}) => {

    const [titles, setTitles] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileObjects, setFileObjects] = useState<FileObject[]>([{ title: '', file: null }]);

    const handleDeleteTask = async () => {
        try {
            if (id) {
                fetchProjectDetails(id);
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de la connexion. Veuillez réessayer.");
        }
    };

    return (

        <>
            <Toaster position="top-right" reverseOrder={false} />

            <section className="p-5 bg-white dark:bg-gray-900">
            <label className="mb-4.5 block text-lg font-medium text-black dark:text-white"> FICHIERS </label>

                <div className="mb-5">
                    <FileUpload2
                        id={id ||""}
                        titles={titles}
                        setTitles={setTitles}
                        file={file}
                        setFile={setFile}
                        fileObjects={fileObjects}
                        setFileObjects={setFileObjects}
                        fetchProjectDetails={fetchProjectDetails}
                    />
                </div>
            </section>

        </>

    );
};

export default AddFilesCard;
