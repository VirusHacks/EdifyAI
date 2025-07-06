import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Urbanist } from "next/font/google"
import { cn } from "@/lib/utils"

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
})

export const metadata: Metadata = {
  title: "EdifyAI",
  description: "EdifyAI",
  icons: ["/icons/logo.png"],
}

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className={cn("relative font-sans", urbanist.variable)}>
      <div className="flex">
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  )
}

export default HomeLayout

