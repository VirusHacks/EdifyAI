"use client";

import { Urbanist } from "next/font/google";
import { cn } from "@/lib/utils";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

const DashboardLayout = ({ children }) => {
  return (
    <div className={`${cn("bg-background font-sans")} ${urbanist.variable}`}>
      <div className="mx-5 md:mx-20 lg:mx-36">{children}</div>
    </div>
  );
};

export default DashboardLayout;