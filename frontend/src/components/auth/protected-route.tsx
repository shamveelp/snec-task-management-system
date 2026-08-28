"use client"

import * as React from "react"
import { useAuthStore } from "../../store/auth.store"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectPath?: string
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectPath = "/",
}: ProtectedRouteProps) {
  const { user, isLoading, checkAuth } = useAuthStore()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [hasChecked, setHasChecked] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setHasChecked(true)
      router.replace(redirectPath)
      return
    }

    if (!hasChecked) {
      checkAuth().finally(() => setHasChecked(true))
    }
  }, [checkAuth, hasChecked, router, redirectPath])

  React.useEffect(() => {
    if (!mounted || isLoading || !hasChecked) return

    const token = localStorage.getItem("accessToken")
    if (!user && !token) {
      router.replace(redirectPath)
      return
    }

    // 2. Check Role if allowedRoles is provided
    if (user && allowedRoles.length > 0) {
      if (!user.role || !allowedRoles.includes(user.role.name)) {
        if (user.role?.name === 'Super Admin') {
          router.replace('/admin/dashboard')
        } else if (user.role?.name === 'Organization Admin') {
          router.replace('/organization/dashboard')
        } else {
          router.replace('/dashboard')
        }
        return
      }
    }

    if (user) {
      setIsAuthorized(true)
    }
  }, [user, isLoading, router, allowedRoles, redirectPath, hasChecked, mounted])

  // Don't render anything until mounted to avoid hydration errors
  if (!mounted) return null;

  // If no token exists, return null while we redirect, avoiding any loader!
  const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem("accessToken") : false;
  if (!hasToken) return null;

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
