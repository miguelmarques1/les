import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/contexts/auth-context";
import { CartProvider } from "@/lib/contexts/cart-context";
import { ToastProvider } from "@radix-ui/react-toast";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livraria XYZ",
  description:
    "Sua livraria online com os melhores títulos nacionais e internacionais",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
