"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function ProtectDashboard({
  children,
  pushTo = "/login", // default fallback
}: {
  children: React.ReactNode
  pushTo?: string
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push(pushTo)
    }
  }, [user, router, pushTo])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Redirecting...</p>
      </div>
    )
  }

  return <>{children}</>
}
