// pages/login/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { ReactNode } from 'react';
import "../globals.css";

interface LayoutProps {
  children: ReactNode;
}
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mobistack",
  description: "Application de gestion de tâche",
};

const LoginLayout: React.FC<LayoutProps> = ({ children }) => {


  return (
    <html lang="en">
      <body className={inter.className}>
            <main>
                {children}
            </main>
        </body>
    </html>
  );
};

export default LoginLayout;
