import "regenerator-runtime/runtime"
import type React from "react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import { Urbanist } from "next/font/google"
import { cn } from "@/lib/utils"

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
})

const MainLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const { isAuthenticated } = getKindeServerSession()
  const isUserAuthenticated = await isAuthenticated()

  if (!isUserAuthenticated) {
    redirect("/")
  }
  return (
    <div className={cn("w-full h-auto min-h-screen !bg-[#f8f8f8] dark:!bg-background font-sans", urbanist.variable)}>
      <div>{children}</div>
    </div>
  )
}

export default MainLayout

