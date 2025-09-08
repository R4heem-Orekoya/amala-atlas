import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query";

const dmSans = Inter({
   variable: "--font-dm-sans",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Amala Atlas 🍲🗺️",
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
      <html lang="en">
         <QueryProvider>
            <body className={`${dmSans.variable} antialiased`}>{children}</body>
         </QueryProvider>
      </html>
   );
}
