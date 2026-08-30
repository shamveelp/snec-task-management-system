"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PasswordInput } from "../ui/password-input"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "../../store/auth.store"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"

export function LoginForm() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('inviteToken')
  const login = useAuthStore((state) => state.login)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const oauthAccessToken = searchParams.get('accessToken')
  const oauthRefreshToken = searchParams.get('refreshToken')

  React.useEffect(() => {
    if (oauthAccessToken && oauthRefreshToken) {
      localStorage.setItem('accessToken', oauthAccessToken)
      localStorage.setItem('refreshToken', oauthRefreshToken)
      checkAuth().then(() => {
        const user = useAuthStore.getState().user
        if (user?.role?.name === 'Super Admin') {
          router.push('/admin/dashboard')
        } else if (user?.role?.name === 'Organization Admin') {
          router.push('/organization/dashboard')
        } else {
          router.push('/dashboard')
        }
      })
    }
  }, [oauthAccessToken, oauthRefreshToken, checkAuth, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let user = await login({ email, password })
      
      if (inviteToken) {
        try {
          const accessToken = localStorage.getItem('accessToken')
          await axios.post(`http://localhost:5000/invitations/${inviteToken}/accept`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          // refresh user to get new role
          await checkAuth()
          const state = useAuthStore.getState()
          user = state.user
        } catch (inviteErr) {
          console.error("Failed to accept invite during login", inviteErr)
        }
      }

      if (user?.role?.name === 'Super Admin') {
        router.push('/admin/dashboard')
      } else if (user?.role?.name === 'Organization Admin') {
        router.push('/organization/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to your workspace.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full relative"
          onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
        >
          <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline hover:text-primary/80"
              tabIndex={-1}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="remember" 
            className="rounded border-input text-primary focus:ring-primary h-4 w-4 bg-background"
          />
          <Label htmlFor="remember" className="font-normal cursor-pointer">Remember me</Label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create account
        </Link>
      </div>
    </motion.div>
  )
}
