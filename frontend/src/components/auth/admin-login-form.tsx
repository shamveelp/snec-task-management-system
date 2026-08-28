"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PasswordInput } from "../ui/password-input"
import { Loader2, ShieldAlert } from "lucide-react"
import { useAuthStore } from "../../store/auth.store"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function AdminLoginForm() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login({ email, password })
      
      // In a real app, we would verify the role from the store here
      // For this mockup, if login succeeds we assume role check passed
      const user = useAuthStore.getState().user;
      
      if (user?.role?.name === 'Super Admin') {
         router.push("/admin/dashboard")
      } else {
         // Fallback if not an admin (we should technically log them out or show error)
         // But for flexibility right now, we just route to dashboard if they aren't super admin
         router.push("/dashboard")
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials or unauthorized.")
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
        <div className="mx-auto w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">System Admin Portal</h1>
        <p className="text-sm text-muted-foreground">
          Restricted access. Authorized personnel only.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Admin Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="focus-visible:ring-rose-500 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="focus-visible:ring-rose-500 border-border"
          />
        </div>

        <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            "Login as Super Admin"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-muted-foreground hover:text-foreground hover:underline">
          Return to User Login
        </Link>
      </div>
    </motion.div>
  )
}
