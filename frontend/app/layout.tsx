import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/contexts/theme-context"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'MeddiiSynx',
  description: 'Synthetic Health Data Generation',
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
