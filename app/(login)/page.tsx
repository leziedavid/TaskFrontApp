// app/login/page.tsx

"use client"; // Assurez-vous que ce fichier est traité comme un composant client


import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from '../services/Auth';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'

// Définir le schéma de validation avec Zod
const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email ou numéro de téléphone requis')
        .refine(value => {
            const isEmail = /\S+@\S+\.\S+/.test(value);
            const isPhone = /^\d{8,10}$/.test(value);
            return isEmail || isPhone;
        }, {
            message: 'Email ou numéro de téléphone invalide',
        }),
        
    password: z.string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
        .min(1, 'Mot de passe requis'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Page() {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const apiResponse = await signIn(data.email, data.password);
    
            if (apiResponse.code === 200) {
                toast.success('Successfully logged in!');
                localStorage.setItem('token', apiResponse.data.token);
                const username = apiResponse.data.userId;
                const version = `@${username}`;
                localStorage.setItem('version',version);
                localStorage.setItem('authorisation', apiResponse.data.role);
                localStorage.setItem('users', apiResponse.data.username);
                localStorage.setItem('profil', apiResponse.data.profil);

                document.cookie = `token=${apiResponse.data.token}; path=/`; // Stocke le token dans les cookies
                const role = apiResponse.data.role;
                document.cookie = `Graphe=${role === "DRIVER" ? "2" : role === "USER" ? "1" : "3"}; path=/`; // Stocke le graphe
    
                // Redirige en fonction du rôle
                router.push(role === "ADMIN" ? '/admin/dashboard' : role === "USER" ? '/admin/dashboard' : '');
                reset();

            } else if (apiResponse.code === 400) {

                toast.error(apiResponse.messages!);

            } else if (apiResponse.code === 500) {

                toast.error("Un compte existe déjà avec cet email");
            }
        } catch (error) {

            console.error('Une erreur est survenue lors de la connexion', error);
            toast.error("Une erreur est survenue lors de la connexion");
        }
    };
    

    return (

        <>
            <Toaster position="top-right" reverseOrder={false}/>

            <div className="flex min-h-full h-screen">

                <div className="relative hidden w-0 flex-1 lg:block">
                    <Image  className="absolute inset-0 h-full w-full brightness-50" src="/img/bg.jpeg" alt="" fill style={{ objectFit: 'cover' }} />
                </div>

                <div className="flex flex-1 flex-col justify-center py-0 px-6 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight"> Connectez-vous à votre compte</h1>
                        </div>
                        <div className="mt-6">
                            
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address /Username
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            {...register('email')}
                                            type="text"
                                            autoComplete="email"
                                            className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm outline-none focus:border-orange-600 focus:ring-black"                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Mot de passe </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="password"
                                            {...register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm outline-none focus:border-orange-600 focus:ring-black"                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
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
                                        </button>
                                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                            Souvenez-vous de moi
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <Link href="/password" className="font-medium text-black hover:text-black">
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>

                                </div>

                                <div className="text-sm">
                                    <Link href="/new-compte" className="font-medium text-black hover:text-black">
                                        Vous n&apos;avez pas de compte ? <span className=" text-blue-500 px-1">Créez un compte</span>
                                    </Link>
                                </div>

                                <div>
                                    <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-[#03233F] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" >
                                        Se connecter
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
