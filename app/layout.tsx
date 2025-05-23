import { type Metadata } from 'next'
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Geist, Geist_Mono, Inter as FontSans } from 'next/font/google'
import './globals.css'

import { cn } from "@/lib/utils"
import NavBar from '@/components/NavBar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'RTPA',
  description: `Rodrigo's Tennis & Padel App`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <NavBar />
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}