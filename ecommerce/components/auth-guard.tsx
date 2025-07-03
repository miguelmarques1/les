"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isLoading) {
      // Still checking authentication status
      return
    }

    if (!isAuthenticated) {
      // Not authenticated, redirect immediately
      router.push(redirectTo)
      return
    }

    // Authenticated, allow rendering
    setShouldRender(true)
  }, [isAuthenticated, isLoading, router, redirectTo])

  // Show loading skeleton while checking authentication
  if (isLoading || !shouldRender) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="h-16 bg-white border-b">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-64" />
            <div className="flex space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="container mx-auto space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
