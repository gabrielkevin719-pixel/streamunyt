import type { Metadata, Viewport } from "next"
import { DM_Sans, Bebas_Neue, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "700"],
})

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  weight: "400",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "StreamUnity — Tudo que Voce Usa. Em Um So Lugar.",
  description:
    "StreamUnity agrega Netflix, Spotify, Disney+, HBO Max, TNT Sports, Amazon Prime e YouTube Premium em um unico plano mensal.",
}

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${dmSans.variable} ${bebasNeue.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
