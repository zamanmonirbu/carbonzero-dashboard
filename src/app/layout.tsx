import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/provider/AppProvider";
import { AuthProvider } from "@/context/AuthContext";
import ConsoleMessage from "@/components/consoleMessage";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Going 2 Zero Dashboard",
  description: "Admin dashboard for business consultation",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <AuthProvider>
     
  <html lang="en">
  
      <body className={inter.className}>
      <AppProvider>
      <ConsoleMessage/>
        {children}
        
      
      
        <Toaster />
        </AppProvider>
      </body>
  
    </html>
   
    </AuthProvider>
   
  );
}
