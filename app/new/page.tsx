
"use client"; // Assurez-vous que ce fichier est traité comme un composant client

import SelectAllFonction from '@/app/components/Select2/SelectAllFonction';
import SelectDepartment from '@/app/components/Select2/SelectDepartment';
import SelectGenre from '@/app/components/Select2/SelectGenre';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../interfaces/ApiResponse';
import { Donnees } from '../interfaces/Donnees';
import { SaveUsers } from '../services/UsersService';


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
    const [password, setPassword] = useState("");
    const [confirmepassword, setConfirmePassword] = useState("");

    const [compteName, setCompteName] = useState("");
    const [genre, setGenre] = useState("");
    const [Department, setDepartment] = useState("");
    const [fonctions, setFonctions] = useState("");
    const [fichier, setFichier] = useState<File | null>(null);
    const [role, setRole] = useState("USER");

    const [response, setResponse] = useState<BaseResponse<Donnees> | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSvgClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFichier(file);
            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    };
    const AddData = async () => {
        SetLoad(true);

        if (!lastname || !firstname || !email || !phone || !compteName || !genre || !Department || !fonctions || !role) {
            SetLoad(false);
            toast.error("Tous les champs doivent être remplis correctement.");
            return;
        }

        if (password !== confirmepassword) {
            SetLoad(false);
            toast.error("Les deux mots de passe ne sont pas identiques. Veuillez les vérifier et réessayer.");
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

            const apiResponse = await SaveUsers(formData);
            setResponse(apiResponse);
            SetLoad(false);

        } catch (error) {
            SetLoad(false);
            console.error('Erreur lors de l\'ajout du projet :', error);
        }
    };


    useEffect(() => {

        if (response && response.data && response.code === 201) {

            SetLoad(false);
            toast.success("Compte créé avec succès !");
            setTimeout(() => {
                router.push("/");
            }, 3000);

        } else if (response && response.code === 409) {

            SetLoad(false);
            toast.error(response.data?.message || "Un message d'erreur");

        } else if (response) {

            SetLoad(false);
            toast.error("Erreur lors de la création du compte. Veuillez réessayer.");
        }

    }, [response, router]);



    return (

        <>
            <Toaster position="top-right" reverseOrder={false}/>

            <div className="flex min-h-full h-screen">

                <div className="relative hidden w-0 flex-1 lg:block">
                    <Image  className="absolute inset-0 h-full w-full brightness-50" src="/img/bg.jpeg" alt="" fill style={{ objectFit: 'cover' }} />
                </div>

                <div className="flex flex-1 flex-col justify-center py-0 px-6 sm:px-6 lg:flex-none lg:px-20 xl:px-15">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight"> Crée mon compte</h1>
                        </div>
                        <div className="mt-6">


                            <form>

                                <div className="relative mb-8 flex items-center justify-center gap-2">

                                    <div className="relative">

                                        <Image src={imageSrc || "/img/users.png"}
                                            alt="User"
                                            className="mb-2 h-30 w-30 border rounded-2xl"
                                            width={140}
                                            height={140} />
                                            <input type="file" ref={fileInputRef} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />

                                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2 bottom-2 transform -translate-x-2 -translate-y-2 cursor-pointer"
                                                onClick={handleSvgClick} >
                                                <rect x="0.25" y="0.25" width="47.1" height="47.1" rx="23.55" fill="#012340" />
                                                <path d="M33.6127 14.973H30.2127L28.5409 12.466C28.4513 12.3317 28.33 12.2216 28.1877 12.1455C28.0454 12.0693 27.8866 12.0294 27.7252 12.0293H19.8752C19.7138 12.0294 19.5549 12.0693 19.4127 12.1455C19.2704 12.2216 19.1491 12.3317 19.0595 12.466L17.3865 14.973H13.9877C13.207 14.973 12.4582 15.2832 11.9061 15.8353C11.3541 16.3873 11.0439 17.1361 11.0439 17.9168V31.6543C11.0439 32.435 11.3541 33.1838 11.9061 33.7358C12.4582 34.2879 13.207 34.598 13.9877 34.598H33.6127C34.3934 34.598 35.1422 34.2879 35.6942 33.7358C36.2463 33.1838 36.5564 32.435 36.5564 31.6543V17.9168C36.5564 17.1361 36.2463 16.3873 35.6942 15.8353C35.1422 15.2832 34.3934 14.973 33.6127 14.973ZM34.5939 31.6543C34.5939 31.9145 34.4906 32.1641 34.3065 32.3481C34.1225 32.5322 33.8729 32.6355 33.6127 32.6355H13.9877C13.7275 32.6355 13.4779 32.5322 13.2938 32.3481C13.1098 32.1641 13.0064 31.9145 13.0064 31.6543V17.9168C13.0064 17.6566 13.1098 17.407 13.2938 17.2229C13.4779 17.0389 13.7275 16.9355 13.9877 16.9355H17.9127C18.0743 16.9357 18.2334 16.8958 18.3759 16.8197C18.5184 16.7435 18.6399 16.6333 18.7296 16.4989L20.4002 13.9918H27.199L28.8708 16.4989C28.9605 16.6333 29.082 16.7435 29.2245 16.8197C29.367 16.8958 29.5261 16.9357 29.6877 16.9355H33.6127C33.8729 16.9355 34.1225 17.0389 34.3065 17.2229C34.4906 17.407 34.5939 17.6566 34.5939 17.9168V31.6543ZM23.8002 18.898C22.7328 18.898 21.6894 19.2146 20.8019 19.8076C19.9143 20.4006 19.2226 21.2435 18.8141 22.2296C18.4057 23.2158 18.2988 24.3009 18.507 25.3478C18.7153 26.3947 19.2293 27.3563 19.984 28.1111C20.7388 28.8659 21.7004 29.3799 22.7473 29.5881C23.7942 29.7963 24.8793 29.6895 25.8655 29.281C26.8516 28.8725 27.6945 28.1808 28.2875 27.2933C28.8806 26.4058 29.1971 25.3623 29.1971 24.2949C29.1954 22.8641 28.6263 21.4923 27.6146 20.4805C26.6028 19.4688 25.231 18.8997 23.8002 18.898ZM23.8002 27.7293C23.1209 27.7293 22.4569 27.5279 21.8922 27.1505C21.3274 26.7731 20.8872 26.2368 20.6272 25.6092C20.3673 24.9817 20.2993 24.2911 20.4318 23.6249C20.5643 22.9587 20.8914 22.3468 21.3717 21.8665C21.852 21.3861 22.464 21.0591 23.1302 20.9265C23.7964 20.794 24.4869 20.862 25.1145 21.122C25.742 21.3819 26.2784 21.8221 26.6558 22.3869C27.0331 22.9517 27.2346 23.6157 27.2346 24.2949C27.2346 25.2058 26.8727 26.0793 26.2287 26.7234C25.5846 27.3675 24.711 27.7293 23.8002 27.7293Z" fill="white" />
                                            </svg>
                                    </div>

                                </div>

                                <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">

                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z" fill="black" />
                                                </svg>
                                            </span>
                                            <input
                                                value={firstname}
                                                onChange={(event) => { setFirstname(event.target.value); }}
                                                className="w-full rounded-sm border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                type="text"
                                                placeholder="Saisir votre nom"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z" fill="black" />
                                                </svg>
                                            </span>
                                            <input
                                                value={lastname}
                                                onChange={(event) => { setLastname(event.target.value); }}
                                                className="w-full rounded-sm border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                type="text"
                                                placeholder="Saisir votre prénom"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">
                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g opacity="0.8">
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z" fill="" />
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z" fill="" />
                                                    </g>
                                                </svg>
                                            </span>
                                            <SelectGenre setGenre={setGenre} genres={''} />
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clipRule="evenodd" d="M16.552 22.1335C15.112 22.0805 11.031 21.5165 6.757 17.2435C2.484 12.9695 1.921 8.88946 1.867 7.44846C1.787 5.25246 3.469 3.11946 5.412 2.28646C5.64598 2.18543 5.9022 2.14696 6.15553 2.17484C6.40886 2.20271 6.65059 2.29597 6.857 2.44546C8.457 3.61146 9.561 5.37546 10.509 6.76246C10.7176 7.06719 10.8068 7.43801 10.7596 7.80426C10.7123 8.17051 10.532 8.50659 10.253 8.74846L8.302 10.1975C8.20774 10.2655 8.14139 10.3655 8.11528 10.4788C8.08916 10.5921 8.10505 10.711 8.16 10.8135C8.602 11.6165 9.388 12.8125 10.288 13.7125C11.189 14.6125 12.441 15.4505 13.3 15.9425C13.4077 16.0029 13.5345 16.0198 13.6543 15.9897C13.774 15.9596 13.8777 15.8847 13.944 15.7805L15.214 13.8475C15.4475 13.5373 15.7919 13.3295 16.1752 13.2676C16.5584 13.2058 16.9508 13.2946 17.27 13.5155C18.677 14.4895 20.319 15.5745 21.521 17.1135C21.6826 17.3214 21.7854 17.5689 21.8187 17.8301C21.8519 18.0913 21.8144 18.3567 21.71 18.5985C20.873 20.5515 18.755 22.2145 16.552 22.1335Z" fill="black" fillOpacity="0.6" />
                                                </svg>
                                            </span>
                                            <input
                                                value={phone}
                                                onChange={(event) => { setPhone(event.target.value); }}
                                                className="w-full rounded-sm border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                type="number"
                                                placeholder="+225 0505055005"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">

                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.29973 8.19371 4.21192 8.11766 4.14189 8.02645C4.07186 7.93525 4.02106 7.83078 3.99258 7.71937C3.96409 7.60796 3.9585 7.49194 3.97616 7.37831C3.99381 7.26468 4.03434 7.15581 4.09528 7.0583C4.15623 6.96079 4.23632 6.87666 4.33073 6.811C4.42513 6.74533 4.53187 6.69951 4.6445 6.6763C4.75712 6.65309 4.87328 6.65297 4.98595 6.67595C5.09863 6.69893 5.20546 6.74453 5.3 6.81L12 11L18.7 6.81C18.7945 6.74453 18.9014 6.69893 19.014 6.67595C19.1267 6.65297 19.2429 6.65309 19.3555 6.6763C19.4681 6.69951 19.5749 6.74533 19.6693 6.811C19.7637 6.87666 19.8438 6.96079 19.9047 7.0583C19.9657 7.15581 20.0062 7.26468 20.0238 7.37831C20.0415 7.49194 20.0359 7.60796 20.0074 7.71937C19.9789 7.83078 19.9281 7.93525 19.8581 8.02645C19.7881 8.11766 19.7003 8.19371 19.6 8.25Z" fill="black" fillOpacity="0.6" />
                                                </svg>
                                            </span>
                                            <input
                                                value={email}
                                                onChange={(event) => { setEmail(event.target.value); }}
                                                className="w-full rounded-sm border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                type="email"
                                                placeholder="devidjond45@gmail.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 10C12.42 10 16 11.79 16 14V16H0V14C0 11.79 3.58 10 8 10Z" fill="black" fillOpacity="0.6" />
                                                </svg>
                                            </span>
                                            <input
                                                value={compteName}
                                                onChange={(event) => { setCompteName(event.target.value); }}
                                                className="w-full rounded-sm border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                type="text"
                                                placeholder="Nom du compte"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">
                                    
                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g opacity="0.8">
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z" fill="" />
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z" fill="" />
                                                    </g>
                                                </svg>
                                            </span>
                                            <SelectAllFonction setFonctions={setFonctions} fonctionUser={''} />
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g opacity="0.8">
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z" fill="" />
                                                        <path fill-rule="evenodd" clipRule="evenodd" d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z" fill="" />
                                                    </g>
                                                </svg>
                                            </span>
                                            <SelectDepartment setDepartment={setDepartment} departments={[]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5 flex flex-col gap-5.5 sm:flex-row space-x-2">
                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 16C8.53043 16 9.03914 15.7893 9.41421 15.4142C9.78929 15.0391 10 14.5304 10 14C10 13.4696 9.78929 12.9609 9.41421 12.5858C9.03914 12.2107 8.53043 12 8 12C7.46957 12 6.96086 12.2107 6.58579 12.5858C6.21071 12.9609 6 13.4696 6 14C6 14.5304 6.21071 15.0391 6.58579 15.4142C6.96086 15.7893 7.46957 16 8 16ZM14 7C14.5304 7 15.0391 7.21071 15.4142 7.58579C15.7893 7.96086 16 8.46957 16 9V19C16 19.5304 15.7893 20.0391 15.4142 20.4142C15.0391 20.7893 14.5304 21 14 21H2C1.46957 21 0.960859 20.7893 0.585786 20.4142C0.210714 20.0391 0 19.5304 0 19V9C0 8.46957 0.210714 7.96086 0.585786 7.58579C0.960859 7.21071 1.46957 7 2 7H3V5C3 3.67392 3.52678 2.40215 4.46447 1.46447C5.40215 0.526784 6.67392 0 8 0C8.65661 0 9.30679 0.129329 9.91342 0.380602C10.52 0.631876 11.0712 1.00017 11.5355 1.46447C11.9998 1.92876 12.3681 2.47995 12.6194 3.08658C12.8707 3.69321 13 4.34339 13 5V7H14ZM8 2C7.20435 2 6.44129 2.31607 5.87868 2.87868C5.31607 3.44129 5 4.20435 5 5V7H11V5C11 4.20435 10.6839 3.44129 10.1213 2.87868C9.55871 2.31607 8.79565 2 8 2Z" fill="black" fillOpacity="0.6" />
                                                </svg>
                                            </span>
                                            <input
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}
                                                type={showPassword ? 'text' : 'password'}
                                                className="w-full rounded-sm border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                placeholder="Saisir le mot de passe"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-1/2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                                                <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 16C8.53043 16 9.03914 15.7893 9.41421 15.4142C9.78929 15.0391 10 14.5304 10 14C10 13.4696 9.78929 12.9609 9.41421 12.5858C9.03914 12.2107 8.53043 12 8 12C7.46957 12 6.96086 12.2107 6.58579 12.5858C6.21071 12.9609 6 13.4696 6 14C6 14.5304 6.21071 15.0391 6.58579 15.4142C6.96086 15.7893 7.46957 16 8 16ZM14 7C14.5304 7 15.0391 7.21071 15.4142 7.58579C15.7893 7.96086 16 8.46957 16 9V19C16 19.5304 15.7893 20.0391 15.4142 20.4142C15.0391 20.7893 14.5304 21 14 21H2C1.46957 21 0.960859 20.7893 0.585786 20.4142C0.210714 20.0391 0 19.5304 0 19V9C0 8.46957 0.210714 7.96086 0.585786 7.58579C0.960859 7.21071 1.46957 7 2 7H3V5C3 3.67392 3.52678 2.40215 4.46447 1.46447C5.40215 0.526784 6.67392 0 8 0C8.65661 0 9.30679 0.129329 9.91342 0.380602C10.52 0.631876 11.0712 1.00017 11.5355 1.46447C11.9998 1.92876 12.3681 2.47995 12.6194 3.08658C12.8707 3.69321 13 4.34339 13 5V7H14ZM8 2C7.20435 2 6.44129 2.31607 5.87868 2.87868C5.31607 3.44129 5 4.20435 5 5V7H11V5C11 4.20435 10.6839 3.44129 10.1213 2.87868C9.55871 2.31607 8.79565 2 8 2Z" fill="black" fillOpacity="0.6" />
                                                </svg>
                                            </span>
                                            <input
                                                value={confirmepassword}
                                                onChange={(event) => setConfirmePassword(event.target.value)}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                className="w-full rounded-sm border border-stroke py-2 pl-8 pr-4 text-black focus:border-black focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-black"
                                                placeholder="Confirmer le mot de passe"
                                            />
                                        </div>
                                    </div>
                                </div>



                                <div className="flex gap-4.5">
                                    <button onClick={AddData} className="w-full flex justify-center rounded bg-[#012340] py-2 px-6 font-medium text-white hover:bg-opacity-90" type="button" >
                                        S&apos;INSCRIRE
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
