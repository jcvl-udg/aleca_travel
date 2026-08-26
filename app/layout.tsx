import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-vintage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Aleca Travel — Viajar es Recordar",
  description:
    "Traza tu siguiente aventura con Aleca Travel. Explora el mundo entre mapas, destinos memorables y un pasaporte VIP.",
  keywords: ["viajes de lujo", "destinos", "club VIP", "pasaporte digital", "Aleca Travel"],
  openGraph: {
    title: "Aleca Travel — Viajar es Recordar",
    description:
      "Explora el mundo entre mapas, destinos memorables y un pasaporte VIP.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3ead7",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
