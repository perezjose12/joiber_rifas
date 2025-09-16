import type React from "react";
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Rifas JyM - ¡Participa y Gana!",
  description: "Rifas JyM te permite participar en sorteos y ganar premios exclusivos de manera fácil y segura. ¡No te pierdas nuestras rifas semanales!",
  keywords: ["rifas", "sorteos", "premios", "Rifas JyM"],
  authors: [{ name: "Rifas JyM", url: "https://www.rifas-jm.com/" }],
  creator: "Rifas JyM",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/img/logo_4.ico",
    apple: "/img/logo_4.ico",
    shortcut: "/img/logo_4.ico",
  },
  openGraph: {
    title: "Rifas JyM - Participa y gana increíbles premios",
    description: "Participa en rifas y sorteos semanales en Rifas JyM y gana premios exclusivos de manera segura y confiable.",
    url: "https://www.rifas-jm.com/",
    siteName: "Rifas JyM",
    images: [
      {
        url: "/description-3.png", // crea una imagen 1200x630 px en /public
        width: 1200,
        height: 630,
        alt: "Rifas JyM - Sorteos y premios",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rifas JyM - Participa y gana increíbles premios",
    description: "Participa en rifas y sorteos semanales en Rifas JyM y gana premios exclusivos.",
    images: ["/description-3.png"],
    site: "@RifasJyM",
    creator: "@RifasJyM",
  },
};

export default  function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans">
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}