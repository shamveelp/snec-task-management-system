"use client"

import * as React from "react"
import { useAuthStore } from "../../store/auth.store"
import { useRouter, usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = React.useState(false)
  const [hasChecked, setHasChecked] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setHasChecked(true)
      if (pathname !== redirectPath) {
        router.replace(redirectPath)
      }
      return
    }

    if (!hasChecked) {
      checkAuth().finally(() => setHasChecked(true))
    }
  }, [checkAuth, hasChecked, router, redirectPath, pathname])

  React.useEffect(() => {
    if (!mounted || isLoading || !hasChecked) return

    // If we've finished loading and checking auth, and there is still no user, redirect
    if (!user) {
      if (pathname !== redirectPath) {
        router.replace(redirectPath)
      }
      return
    }

    // 2. Check Role if allowedRoles is provided
    if (user && allowedRoles.length > 0) {
      if (!user.role || !allowedRoles.includes(user.role.name)) {
        let targetPath = '/dashboard'
        if (user.role?.name === 'Super Admin') {
          targetPath = '/admin/dashboard'
        } else if (user.role?.name === 'Organization Admin') {
          targetPath = '/organization/dashboard'
        }
        
        if (pathname !== targetPath) {
          router.replace(targetPath)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You do not have permission to view this page.</p>
        <button 
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Sign Out & Return to Login
        </button>
      </div>
    )
  }

  return <>{children}</>
}
