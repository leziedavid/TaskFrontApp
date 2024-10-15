"use client";

import React, { useState} from 'react';
import '../globals.css';
import Header from '../components/Admin/Header';
import Sidebar from '../components/Admin/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-col md:pl-64">
          
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 ">
            <div className="p-0">
            {children}

            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
