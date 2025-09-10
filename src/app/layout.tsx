import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/convex";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const dmSans = Inter({
   variable: "--font-dm-sans",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Amala Atlas",
   description:
      "Crowdsourced discovery & verification platform for authentic Amala spots. Built at Amala Hackathon – DevFest Lagos 2025.",
   keywords: [
      "Amala",
      "Food discovery",
      "Crowdsourcing",
      "Lagos",
      "Hackathon",
      "GDG Lagos",
      "Amala Atlas",
      "Map UI",
   ],
   authors: [
      {
         name: "Redoxx",
         url: "https://raheemorekoya.me/",
      },
      {
         name: "Kayzi",
         url: "https://kayziv3.vercel.app/",
      },
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <ClerkProvider>
         <html lang="en">
            <ConvexClientProvider>
               <QueryProvider>
                  <body className={`${dmSans.variable} antialiased`}>
                     <Navbar />
                     {children}
                     <Toaster
                        richColors
                        position="top-right"
                        className="z-[99999]"
                     />
                  </body>
               </QueryProvider>
            </ConvexClientProvider>
         </html>
      </ClerkProvider>
   );
}
