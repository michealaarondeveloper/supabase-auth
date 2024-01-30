import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Providers} from "./providers";
import NavbarMenu from "@/app/navbar";
import { ToastContainer as ReactToastContainer, toast as reactToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supabase Integration",
  description: "NextUi | Zod | React-Hook-Forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavbarMenu />
          {children}
          <ReactToastContainer />
        </Providers>
        </body>
    </html>
  );
}
