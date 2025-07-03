import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Analise Bookstore - Admin Dashboard",
  description: "Admin dashboard for Analise Bookstore",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
