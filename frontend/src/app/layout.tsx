import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Car Ledger Dashboard',
  description: 'Manage your vehicle expenses and fuel efficiency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 flex h-screen w-full`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
