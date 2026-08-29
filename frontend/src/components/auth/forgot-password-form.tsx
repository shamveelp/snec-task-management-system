"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Loader2, ArrowLeft, MailCheck } from "lucide-react"
import { authService } from "../../services/auth/auth.service"

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.forgotPassword(email)
      // We always show success to prevent email enumeration attacks
    } catch (err: any) {
      // Intentionally ignoring errors to prevent email enumeration
    } finally {
      setLoading(false)
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <MailCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold">Check your inbox</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>. 
          Please check your email and follow the instructions.
        </p>
        <Link href="/login" className="block pt-4">
          <Button variant="outline" className="w-full">Return to Sign In</Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send instructions to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link href="/login" className="flex items-center justify-center font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  )
}
