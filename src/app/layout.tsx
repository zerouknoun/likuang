import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LinkUang - Perpendek URL & Hasilkan Uang Jutaan Rupiah",
  description: "LinkUang adalah layanan pemendek URL terbaik di Indonesia. Bagikan link Anda dan dapatkan bayaran tinggi untuk setiap klik yang valid. Mulai hasilkan uang sekarang!",
  keywords: ["url shortener", "pemendek url", "penghasil uang", "link menghasilkan uang", "aplikasi penghasil uang", "linkuang", "shortlink indonesia"],
  authors: [{ name: "LinkUang" }],
  openGraph: {
    title: "LinkUang - Perpendek URL & Hasilkan Uang Jutaan Rupiah",
    description: "Bagikan link Anda dan dapatkan bayaran tinggi untuk setiap klik yang valid. Mulai hasilkan uang dari trafik Anda!",
    url: "https://linkuang.com",
    siteName: "LinkUang",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkUang - Perpendek URL & Hasilkan Uang",
    description: "Bagikan link Anda dan dapatkan bayaran tinggi untuk setiap klik yang valid.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
