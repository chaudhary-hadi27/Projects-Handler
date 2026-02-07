import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'SmartKode - Project Manager',
    description: 'PWA to manage demo projects',
    manifest: '/manifest.json'
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            <meta name="theme-color" content="#4f46e5" />
            <link rel="manifest" href="/manifest.json" />
        </head>
        <body className={inter.className}>{children}</body>
        </html>
    )
}