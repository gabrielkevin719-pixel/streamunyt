import type { Metadata, Viewport } from "next";
import { DM_Sans, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Streamixx — TV, Musica e Entretenimento em Um So Lugar.",
  description:
    "Streamixx agrega Netflix, Spotify, Disney+, HBO Max, TNT Sports, Amazon Prime e YouTube Premium em um unico plano mensal. Economize ate R$127/mes.",
  keywords: [
    "streaming",
    "netflix",
    "spotify",
    "disney+",
    "hbo max",
    "assinatura",
    "economia",
    "streamixx",
  ],
  authors: [{ name: "Streamixx" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Streamixx — TV, Musica e Entretenimento em Um So Lugar.",
    description:
      "Agregue todas as suas assinaturas de streaming em um unico plano mensal.",
    type: "website",
    locale: "pt_BR",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#060A14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
