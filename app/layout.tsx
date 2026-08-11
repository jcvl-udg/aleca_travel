import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Aleca Travel — El mundo es tuyo",
  description:
    "Traza tu siguiente aventura con Aleca Travel. Explora destinos de lujo en un globo interactivo, gana puntos y desbloquea tu pasaporte digital VIP.",
  keywords: ["viajes de lujo", "destinos", "club VIP", "pasaporte digital", "Aleca Travel"],
  openGraph: {
    title: "Aleca Travel — El mundo es tuyo",
    description:
      "Explora destinos de lujo en un globo interactivo, gana puntos y desbloquea tu pasaporte digital VIP.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
