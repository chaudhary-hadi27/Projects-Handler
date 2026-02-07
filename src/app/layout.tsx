import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
    title: 'SmartKode - Project Manager',
    description: 'A powerful PWA to manage and organize your demo projects',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'SmartKode'
    },
    formatDetection: {
        telephone: false
    },
    icons: {
        icon: '/icon-192.png',
        apple: '/icon-192.png'
    }
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#4f46e5'
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
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="SmartKode" />
            <meta name="mobile-web-app-capable" content="yes" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon-192.png" />
        </head>
        <body className={inter.className}>
        {children}
        </body>
        </html>
    )
}