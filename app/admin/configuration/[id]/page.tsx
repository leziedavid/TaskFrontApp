"use client";

import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Department } from '@/app/interfaces/Department';
import { useRouter, useParams } from 'next/navigation';
import Comptes from '@/app/components/tabs/Comptes';
import Departements from '@/app/components/tabs/Departements';
import { BaseResponse } from '@/app/interfaces/ApiResponse';
import { Donnees } from '@/app/interfaces/Donnees';
import { getUserByIdWithDepartments, SaveUsers, updateUser } from '@/app/services/UsersService';
import { generatePassword } from '@/app/services/generatePassword';
import SelectAllRoles from '@/app/components/Select2/SelectAllRoles';
import SelectAllFonction from '@/app/components/Select2/SelectAllFonction';
import SelectDepartment from '@/app/components/Select2/SelectDepartment';
import SelectGenre from '@/app/components/Select2/SelectGenre';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon, ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import { z } from 'zod';
import { updatePassword } from '@/app/services/Auth';

const PAGE_SIZE = 8; // Nombre de trajets par page


// Schéma de validation Zod
const passwordSchema = z.object({
    newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z.string().min(8, "La confirmation du mot de passe doit contenir au moins 8 caractères"),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe doivent correspondre",
    path: ["confirmPassword"],
});


export default function Page() {

    const router = useRouter();
    const navigateTo = (path: string) => {
        router.push(path);
    };

    const [Load, SetLoad] = useState(false);
    const [email, setEmail] = useState("");

    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState<string>('');

    // const [confirmepassword, setConfirmePassword] = useState("");
    const [compteName, setCompteName] = useState("");
    const [genre, setGenre] = useState("");
    const [Department, setDepartment] = useState("");
    const [dataDepartment, setDataDepartment] = useState<Department[]>([]);

    const [selected, Setselected] = useState("");
    const [fonctions, setFonctions] = useState("");
    const [fichier, setFichier] = useState<File | null>(null);
    const [role, setRole] = useState("");

    const [response, setResponse] = useState<BaseResponse<Donnees> | null>(null);
    const { id } = useParams<{ id: string }>();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Typage des erreurs


    // Référence pour l'élément input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // État pour stocker l'URL de l'image
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

    // Fonction pour déclencher le clic sur l'élément input
    const handleSvgClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Fonction pour gérer le changement de fichier
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {

            setFichier(file);

            // Créer une URL pour l'image chargée
            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);
            // Libérer l'URL de l'objet lorsque le composant est démonté
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    // Fonction pour générer le compteName avec deux premières lettres du prénom et trois premières lettres du nom de famille
    const generateCompteName = (first: string, last: string) => {
        const firstPart = first.slice(0, 5).toLowerCase();  // Prendre les 2 premières lettres du prénom
        const lastPart = last.slice(0, 6).toLowerCase();    // Prendre les 3 premières lettres du nom de famille
        return `${firstPart}@${lastPart}`;
    };

    // Fonction pour gérer le changement de prénom
    const handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFirstname = event.target.value;
        setFirstname(newFirstname);
        setCompteName(generateCompteName(newFirstname, lastname));
    };

    // Fonction pour gérer le changement de nom de famille
    const handleLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLastname = event.target.value;
        setLastname(newLastname);
        setCompteName(generateCompteName(firstname, newLastname));
    };


    const update = async () => {

        SetLoad(true);

        if (!lastname || !firstname || !email || !phone || !compteName || !genre || !Department || !fonctions || !role) {
            SetLoad(false);
            toast.error("Tous les champs doivent être remplis correctement.");
            return;
        }

        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('genre', genre);
        formData.append('username', compteName);
        formData.append('fonction', fonctions);
        formData.append('role', role);
        formData.append('departmentId', Department);
        formData.append('password', password);
        formData.append('profil', fichier!); // Fichier de la photo de profil

        try {
            const apiResponse = await updateUser(id!, formData);
            setResponse(apiResponse);
            SetLoad(false);

        } catch (error) {
            SetLoad(false);
            console.error('Erreur lors de l\'ajout du projet :', error);
        }
    };

    useEffect(() => {

        // Générer un mot de passe au chargement de la page
        const newPassword = generatePassword(8);
        setPassword(newPassword);

        if (response && response.data && response.code === 201) {

            SetLoad(false);
            toast.success("Compte créé avec succès !");

            // Ajouter un délai de 3 secondes avant la redirection
            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 3000); // Délai de 3000 millisecondes (3 secondes)

        } else if (response && response.code === 409) {

            SetLoad(false);
            toast.error(response.data?.message || "Un message d'erreur");

        } else if (response && response.code === 200) {

            SetLoad(false);
            toast.success("Compte mise à jour avec succès");

        } else if (response) {

            SetLoad(false);
            toast.error("Erreur lors de la création du compte. Veuillez réessayer.");
        }


    }, [response, router]);


    const getUserById = async (id: number) => {

        try {

            const res = await getUserByIdWithDepartments(id);
            const datas = res.data;

            // console.log(datas.fonction);
            setFirstname(datas.firstname);
            setLastname(datas.lastname);
            setEmail(datas.email);
            setPhone(datas.phone);
            setFonctions(datas.fonction);
            setCompteName(datas.username);
            setRole(datas.role);
            setImageSrc(`${process.env.NEXT_PUBLIC_FILE_BASE_URL}/${datas.profil}`);
            setDataDepartment(datas.departments);
            setGenre(datas.genre);

        } catch (error) {
            console.error('Error fetching project details:', error);
        }
    };


    useEffect(() => {

        if (id) {

            const numericId = parseInt(id, 10);
            getUserById(numericId);
        }

    }, [id]);

    // Nouvelle fonction pour modifier le compte de l'utilisateur

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);
    const [showPassword, setShowPassword] = useState(false); // État pour contrôler l'affichage

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev); // Inverser l'état
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({}); // Réinitialiser les erreurs

        // Valider les données
        try {
            passwordSchema.parse({ newPassword, confirmPassword });
            // Si la validation réussit, appeler le service
            await updatePassword(id, newPassword);
            toast.success("Mot de passe modifié avec succès !");
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors); // Afficher les erreurs de validation
            } else if (error instanceof Error) {
                toast.error(error.message); // Afficher les erreurs de l'API
            } else {
                toast.error("Une erreur inconnue est survenue."); // Gérer les erreurs inconnues
            }
        }
    };


    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="">

                <div className="bg-gray-300 p-4 flex items-center">
                    <a onClick={() => navigateTo(`/admin/dashboard`)} className="flex items-center text-black font-bold cursor-pointer hover:underline">
                        <ArrowLeftIcon className="mr-2" />
                        Retour
                    </a>
                    <h1 className="ml-4 font-bold">informations du compte</h1>
                </div>

                <div className="container mx-auto my-5 p-5">
                    <div className="md:flex no-wrap md:-mx-2 ">
                        <div className="w-full md:w-3/12 md:mx-2">
                            <div className="bg-white p-3 border-t-4 border-[#012340]">
                                <div className="image overflow-hidden">
                                    <img className="h-auto w-full mx-auto" src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg" alt="" />
                                </div>
                                <div className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                                    <div className="relative mb-0 flex items-center justify-center gap-3">
                                        <div className="relative">
                                            <Image
                                                src={imageSrc || "/img/users.png"}
                                                alt="User"
                                                className="mb-2 h-30 w-30 border rounded-2xl"
                                                width={140}
                                                height={140} />

                                            <input type="file" ref={fileInputRef} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />

                                            <svg width="50" height="50" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2 bottom-2 transform -translate-x-2 -translate-y-2 cursor-pointer"
                                                onClick={handleSvgClick} >
                                                <rect x="0.25" y="0.25" width="47.1" height="47.1" rx="23.55" fill="#012340" />
                                                <path d="M33.6127 14.973H30.2127L28.5409 12.466C28.4513 12.3317 28.33 12.2216 28.1877 12.1455C28.0454 12.0693 27.8866 12.0294 27.7252 12.0293H19.8752C19.7138 12.0294 19.5549 12.0693 19.4127 12.1455C19.2704 12.2216 19.1491 12.3317 19.0595 12.466L17.3865 14.973H13.9877C13.207 14.973 12.4582 15.2832 11.9061 15.8353C11.3541 16.3873 11.0439 17.1361 11.0439 17.9168V31.6543C11.0439 32.435 11.3541 33.1838 11.9061 33.7358C12.4582 34.2879 13.207 34.598 13.9877 34.598H33.6127C34.3934 34.598 35.1422 34.2879 35.6942 33.7358C36.2463 33.1838 36.5564 32.435 36.5564 31.6543V17.9168C36.5564 17.1361 36.2463 16.3873 35.6942 15.8353C35.1422 15.2832 34.3934 14.973 33.6127 14.973ZM34.5939 31.6543C34.5939 31.9145 34.4906 32.1641 34.3065 32.3481C34.1225 32.5322 33.8729 32.6355 33.6127 32.6355H13.9877C13.7275 32.6355 13.4779 32.5322 13.2938 32.3481C13.1098 32.1641 13.0064 31.9145 13.0064 31.6543V17.9168C13.0064 17.6566 13.1098 17.407 13.2938 17.2229C13.4779 17.0389 13.7275 16.9355 13.9877 16.9355H17.9127C18.0743 16.9357 18.2334 16.8958 18.3759 16.8197C18.5184 16.7435 18.6399 16.6333 18.7296 16.4989L20.4002 13.9918H27.199L28.8708 16.4989C28.9605 16.6333 29.082 16.7435 29.2245 16.8197C29.367 16.8958 29.5261 16.9357 29.6877 16.9355H33.6127C33.8729 16.9355 34.1225 17.0389 34.3065 17.2229C34.4906 17.407 34.5939 17.6566 34.5939 17.9168V31.6543ZM23.8002 18.898C22.7328 18.898 21.6894 19.2146 20.8019 19.8076C19.9143 20.4006 19.2226 21.2435 18.8141 22.2296C18.4057 23.2158 18.2988 24.3009 18.507 25.3478C18.7153 26.3947 19.2293 27.3563 19.984 28.1111C20.7388 28.8659 21.7004 29.3799 22.7473 29.5881C23.7942 29.7963 24.8793 29.6895 25.8655 29.281C26.8516 28.8725 27.6945 28.1808 28.2875 27.2933C28.8806 26.4058 29.1971 25.3623 29.1971 24.2949C29.1954 22.8641 28.6263 21.4923 27.6146 20.4805C26.6028 19.4688 25.231 18.8997 23.8002 18.898ZM23.8002 27.7293C23.1209 27.7293 22.4569 27.5279 21.8922 27.1505C21.3274 26.7731 20.8872 26.2368 20.6272 25.6092C20.3673 24.9817 20.2993 24.2911 20.4318 23.6249C20.5643 22.9587 20.8914 22.3468 21.3717 21.8665C21.852 21.3861 22.464 21.0591 23.1302 20.9265C23.7964 20.794 24.4869 20.862 25.1145 21.122C25.742 21.3819 26.2784 21.8221 26.6558 22.3869C27.0331 22.9517 27.2346 23.6157 27.2346 24.2949C27.2346 25.2058 26.8727 26.0793 26.2287 26.7234C25.5846 27.3675 24.711 27.7293 23.8002 27.7293Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">{firstname} - {lastname}</h1>


                                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">

                                    <li className="flex items-center py-3">
                                        <span>Role</span>
                                        <span className="ml-auto"><span className="bg-[#012340] py-1 px-2 rounded text-white text-sm">{role}</span></span>
                                    </li>

                                </ul>
                            </div>

                        </div>

                        <div className="w-full md:w-9/12 md:mx-2">
                            <div className="bg-white p-3 shadow-sm rounded-sm">

                                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1 mb-5">Modifier mes informations personnel</h1>

                                <div className="mb-5">

                                    <div className="border-b border-gray-200">

                                        <form>
                                            <div className="mb-5 flex flex-col gap-5 sm:flex-row gap-4">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <input
                                                            value={firstname}
                                                            onChange={handleFirstnameChange}
                                                            className="w-full rounded border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                            type="text"
                                                            placeholder="Saisir le nom de l'utilisateur"
                                                        />
                                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                            {/* SVG Icon */}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <input
                                                            value={lastname}
                                                            onChange={handleLastnameChange}
                                                            className="w-full rounded border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                            type="text"
                                                            placeholder="Saisir le prénom de l'utilisateur"
                                                        />
                                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                            {/* SVG Icon */}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5 flex flex-col gap-5 sm:flex-row gap-4">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <SelectGenre setGenre={setGenre} genres={genre} />
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <input
                                                            value={phone}
                                                            onChange={(event) => setPhone(event.target.value)}
                                                            className="w-full rounded border border-stroke py-2 pl-10 pr-4 text-black focus:border-gray-700 focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                            type="number"
                                                            placeholder="+225 0505055005"
                                                        />
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                            {/* SVG Icon */}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5 flex flex-col gap-5 sm:flex-row gap-4">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <input
                                                            value={email}
                                                            onChange={(event) => setEmail(event.target.value)}
                                                            className="w-full rounded border border-stroke py-3 pl-10 pr-4 text-black focus:border-gray-700 focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                            type="email"
                                                            placeholder="devidjond45@gmail.com"
                                                        />
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                            {/* SVG Icon */}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <input
                                                            value={compteName}
                                                            readOnly
                                                            className="w-full rounded border border-stroke py-3 pl-10 pr-4 text-black focus:border-gray-700 focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                            type="text"
                                                            placeholder="Nom du compte"
                                                        />
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                            {/* SVG Icon */}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5 flex flex-col gap-5 sm:flex-row gap-4">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <SelectAllFonction setFonctions={setFonctions} fonctionUser={fonctions} />
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <SelectDepartment setDepartment={setDepartment} departments={dataDepartment} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5 flex flex-col gap-5 sm:flex-row gap-4">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        <SelectAllRoles rolesValue={role} setRole={setRole} />
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-1/2">
                                                    <div className="relative">
                                                        {/* You can add another input or select field here if needed */}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>

                                        <div className="flex flex-col sm:flex-row justify-end gap-2 mb-5">
                                                <button
                                                    onClick={() => navigateTo(`/admin/dashboard`)}
                                                    className="flex justify-center bg-gray-100 rounded border py-2 px-4 font-medium text-black hover:shadow-1 text-sm sm:text-base"
                                                    type="button"
                                                >
                                                    Annuler
                                                </button>
                                                <button onClick={update} type="submit"  className="flex justify-center rounded bg-[#012340] py-2 px-4 font-medium text-white hover:bg-opacity-90 text-sm sm:text-base">
                                                Modifier mes informations
                                                </button>
                                            </div>

                                    </div>

                                </div>




                                <div>
                                    <h1 className="text-gray-900 font-bold text-xl leading-8 my-1 mb-5">Modifier Votre mot de passe</h1>
                                    <div className="border-b border-gray-200">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-5">
                                                <div className="relative">
                                                    <input
                                                        value={newPassword}
                                                        onChange={handlePasswordChange}
                                                        className={`w-full rounded-sm border py-2 pl-8 pr-10 text-black ${errors.newPassword ? 'border-red-500' : 'border-stroke'}`}
                                                        type={showPassword ? "text" : "password"} // Afficher ou cacher le mot de passe
                                                        placeholder="Saisir le nouveau mot de passe"
                                                    />
                                                    <span onClick={toggleShowPassword} className="absolute right-2 top-2 cursor-pointer">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-5 w-5 ${showPassword ? 'text-gray-700' : 'text-gray-400'}`}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            {showPassword ? (
                                                                <path d="M12 19.5C8.1 19.5 4.7 16.2 2.5 12.5a9.1 9.1 0 0 1 0-5C4.7 7.8 8.1 4.5 12 4.5S19.3 7.8 21.5 12.5a9.1 9.1 0 0 1 0 5C19.3 16.2 15.9 19.5 12 19.5zM12 7.5a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9zM12 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                            ) : (
                                                                <path d="M12 19.5C8.1 19.5 4.7 16.2 2.5 12.5a9.1 9.1 0 0 1 0-5C4.7 7.8 8.1 4.5 12 4.5S19.3 7.8 21.5 12.5a9.1 9.1 0 0 1 0 5C19.3 16.2 15.9 19.5 12 19.5zM12 7.5a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9zM12 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                            )}
                                                        </svg>
                                                    </span>
                                                    {errors.newPassword && <p className="text-red-500">{errors.newPassword}</p>}
                                                </div>
                                            </div>
                                            <div className="mb-5">
                                                <div className="relative">
                                                    <input
                                                        value={confirmPassword}
                                                        onChange={handleConfirmPasswordChange}
                                                        className={`w-full rounded-sm border py-2 pl-8 pr-10 text-black ${errors.confirmPassword ? 'border-red-500' : 'border-stroke'}`}
                                                        type={showPassword ? "text" : "password"} // Afficher ou cacher le mot de passe
                                                        placeholder="Confirmer le mot de passe"
                                                    />
                                                    <span onClick={toggleShowPassword} className="absolute right-2 top-2 cursor-pointer">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-5 w-5 ${showPassword ? 'text-gray-700' : 'text-gray-400'}`}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            {showPassword ? (
                                                                <path d="M12 19.5C8.1 19.5 4.7 16.2 2.5 12.5a9.1 9.1 0 0 1 0-5C4.7 7.8 8.1 4.5 12 4.5S19.3 7.8 21.5 12.5a9.1 9.1 0 0 1 0 5C19.3 16.2 15.9 19.5 12 19.5zM12 7.5a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9zM12 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                            ) : (
                                                                <path d="M12 19.5C8.1 19.5 4.7 16.2 2.5 12.5a9.1 9.1 0 0 1 0-5C4.7 7.8 8.1 4.5 12 4.5S19.3 7.8 21.5 12.5a9.1 9.1 0 0 1 0 5C19.3 16.2 15.9 19.5 12 19.5zM12 7.5a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9zM12 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                            )}
                                                        </svg>
                                                    </span>
                                                    {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row justify-end gap-2 mb-5">
                                                <button
                                                    onClick={() => navigateTo(`/admin/dashboard`)}
                                                    className="flex justify-center bg-gray-100 rounded border py-2 px-4 font-medium text-black hover:shadow-1 text-sm sm:text-base"
                                                    type="button"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="flex justify-center rounded bg-[#012340] py-2 px-4 font-medium text-white hover:bg-opacity-90 text-sm sm:text-base"
                                                >
                                                    Modifier mon mot de passe
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </>

    )
}


