import "regenerator-runtime/runtime"
import type { Metadata } from "next"
import { Urbanist } from "next/font/google"
import dynamic from "next/dynamic"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/context/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import QueryProvider from "@/context/query-provider"
import Navbar from "@/components/nav-bar"
import type React from "react" // Added import for React

const Dictaphone = dynamic(() => import("@/components/dictaphone"), { ssr: false })

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
})

export const metadata: Metadata = {
  title: "Gen-ed",
  description: "Interactive E - Learning Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("bg-background font-sans", urbanist.variable)}>
        <Navbar />
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <main>
            {children}
              </main>
            <span>
              <Dictaphone />
            </span>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

