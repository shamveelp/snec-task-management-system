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
  redirectPath = "/login",
}: ProtectedRouteProps) {
  const { user, isLoading, checkAuth } = useAuthStore()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [hasChecked, setHasChecked] = React.useState(false)

  React.useEffect(() => {
    if (!hasChecked) {
      checkAuth().finally(() => setHasChecked(true))
    }
  }, [checkAuth, hasChecked])

  React.useEffect(() => {
    // Wait for auth check to complete
    if (isLoading || !hasChecked) return

    // 1. Check if user is logged in
    if (!user) {
      router.push(redirectPath)
      return
    }

    // 2. Check Role if allowedRoles is provided
    if (allowedRoles.length > 0) {
      if (!user.role || !allowedRoles.includes(user.role.name)) {
        // Logged in but not authorized for this specific role
        // Redirect based on role
        if (user.role?.name === 'Super Admin') {
          router.push('/admin/dashboard')
        } else if (user.role?.name === 'Organization Admin') {
          router.push('/organization/dashboard')
        } else {
          router.push('/dashboard')
        }
        return
      }
    }

    setIsAuthorized(true)
  }, [user, isLoading, router, allowedRoles, redirectPath])

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
