import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export const mtadata : Metadata = {
  title: "BPT Exam Practice - UTP Licenciatura en Bilingüismo",
  description:
    "Practice and prepare for the Bilingualism Proficiency Test (BPT Exam) with tailored resources and exercises. Designed for students of the Licenciatura en Bilingüismo con Énfasis en Inglés at Universidad Tecnológica de Pereira.",
  keywords:
    "BPT Exam, Bilingualism Proficiency Test, UTP, Licenciatura en Bilingüismo, English Practice, UTP Bilingüismo",
  authors: [
    { name: "Diego Henao", url: "https://bpt-2024.vercel.app/" }, // Update with your info if desired
  ],
  viewport: "width=device-width, initial-scale=1",

  openGraph: {
    title: "BPT Exam Practice - UTP Licenciatura en Bilingüismo",
    description:
      "Tailored exercises and resources for UTP students preparing for the BPT Exam.",
    url: "https://bpt-2024.vercel.app/", // Replace with your site's URL
    type: "website",
    locale: "es_CO", // Assuming Colombian Spanish is the target locale
  },
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
