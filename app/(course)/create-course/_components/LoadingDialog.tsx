"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { useState, useEffect } from "react"

const LoadingDialog = ({ loading }: { loading: boolean }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <AlertDialog open={loading}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center p-6">
          <AlertDialogTitle className="text-2xl font-semibold mb-4">
            Hold on, your course will be generated soon!
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Image src="/rocket.gif" alt="loading" width={120} height={120} priority className="rounded-lg shadow-md" />
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LoadingDialog

