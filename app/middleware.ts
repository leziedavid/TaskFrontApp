// app/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    exp: number;
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token'); // Vérifie le token

    // Vérifie si le token est présent
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Décoder le token pour vérifier son expiration
    let decodedToken: DecodedToken | null = null;
    try {
        decodedToken = jwt.decode(token.value) as DecodedToken;
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url)); // Redirige si le token est invalide
    }

    // Vérifier si le token est expiré
    const currentTime = Math.floor(Date.now() / 1000); // Temps en secondes
    if (decodedToken.exp < currentTime) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token'); // Supprimer le token expiré
        return response;
    }

    // Gérer la déconnexion si le chemin d'accès est `/logout`
    if (request.nextUrl.pathname === '/logout') {
        // Supprimer le token et rediriger
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
    return NextResponse.next(); // Continue à la page demandée
}

// Configuration du middleware
export const config = {
    matcher: ['/admin/dashboard/:path*', '/logout'],
};
