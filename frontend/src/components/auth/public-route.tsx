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

  React.useEffect(() => {
    if (!hasChecked) {
      checkAuth().finally(() => setHasChecked(true))
    }
  }, [checkAuth, hasChecked])

  React.useEffect(() => {
    if (isLoading || !hasChecked) return

    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role?.name === 'Super Admin') {
        router.push('/admin/dashboard')
      } else if (user.role?.name === 'Organization Admin') {
        router.push('/organization/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, isLoading, isAuthenticated, hasChecked, router])

  if (isLoading || !hasChecked || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
