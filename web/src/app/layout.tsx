import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tixio - Plataforma de Eventos e Ingressos",
  description: "Plataforma completa para criação, gerenciamento e venda de ingressos para eventos",
  keywords: "eventos, ingressos, tickets, venda, gerenciamento",
  authors: [{ name: "Tixio Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Tixio - Plataforma de Eventos e Ingressos",
    description: "Plataforma completa para criação, gerenciamento e venda de ingressos para eventos",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#ff7a00" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div id="root" role="main">
          {children}
        </div>
        {/* Skip to main content link for screen readers */}
        <a 
          href="#main-content" 
          className="visually-hidden-focusable"
          style={{
            position: 'absolute',
            top: '-40px',
            left: '6px',
            zIndex: 10000,
            padding: '8px 16px',
            background: '#ff7a00',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Pular para o conteúdo principal
        </a>
      </body>
    </html>
  );
}
