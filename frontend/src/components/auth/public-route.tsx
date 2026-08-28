"use client"

import * as React from "react"
import { useAuthStore } from "../../store/auth.store"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface PublicRouteProps {
  children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, isLoading, isAuthenticated, checkAuth } = useAuthStore()
  const router = useRouter()
  const [hasChecked, setHasChecked] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setHasChecked(true)
      return
    }

    if (!hasChecked) {
      checkAuth().finally(() => setHasChecked(true))
    }
  }, [checkAuth, hasChecked])

  React.useEffect(() => {
    if (!mounted || isLoading || !hasChecked) return

    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role?.name === 'Super Admin') {
        router.replace('/admin/dashboard')
      } else if (user.role?.name === 'Organization Admin') {
        router.replace('/organization/dashboard')
      } else {
        router.replace('/dashboard')
      }
    }
  }, [user, isLoading, isAuthenticated, hasChecked, router, mounted])

  if (!mounted) return null;

  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem("accessToken") : false;

  // If we have a token, and we are still loading or authenticating, show loader while redirect happens
  if (hasToken && (isLoading || !hasChecked || isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
