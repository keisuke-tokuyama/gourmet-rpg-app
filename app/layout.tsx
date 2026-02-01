import React from "react"
import type { Metadata, Viewport } from 'next'
import { Noto_Serif_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/toaster'
import './globals.css'

const notoSerifJP = Noto_Serif_JP({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-serif-jp",
});

export const viewport: Viewport = {
  themeColor: '#f7f6f3',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: '食の冒険録',
  description: '食の思い出を記録し、いいねでランキングに参加するRPG風グルメ日記',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${notoSerifJP.className} font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
