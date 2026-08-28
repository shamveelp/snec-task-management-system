"use client"

import * as React from "react"
import Link from "next/link"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PasswordInput } from "../ui/password-input"
import { Loader2, CheckCircle, CheckCircle2 } from "lucide-react"
import { useAuthStore } from "../../store/auth.store"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const [formData, setFormData] = React.useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  
  const [validation, setValidation] = React.useState({
    username: { isChecking: false, error: "" },
    email: { isChecking: false, error: "" },
  })

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  // OTP State
  const [isOtpDialogOpen, setIsOtpDialogOpen] = React.useState(false)
  const [otpValue, setOtpValue] = React.useState("")
  const [otpError, setOtpError] = React.useState("")
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false)
  const [resendTimer, setResendTimer] = React.useState(60)
  const [isResending, setIsResending] = React.useState(false)

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOtpDialogOpen && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOtpDialogOpen, resendTimer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Debounced validation for username
  React.useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username) {
        setValidation(prev => ({ ...prev, username: { isChecking: false, error: "" } }))
        return
      }
      setValidation(prev => ({ ...prev, username: { ...prev.username, isChecking: true, error: "" } }))
      try {
        const { data } = await axios.get(`http://localhost:5000/auth/check-username?username=${formData.username.trim()}`)
        if (!data.isUnique) {
          setValidation(prev => ({ ...prev, username: { isChecking: false, error: "Username is already taken" } }))
        } else {
          setValidation(prev => ({ ...prev, username: { isChecking: false, error: "" } }))
        }
      } catch (err) {
        setValidation(prev => ({ ...prev, username: { isChecking: false, error: "Error checking username" } }))
      }
    }
    
    const timeoutId = setTimeout(checkUsername, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.username])

  // Debounced validation for email
  React.useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email) {
        setValidation(prev => ({ ...prev, email: { isChecking: false, error: "" } }))
        return
      }
      setValidation(prev => ({ ...prev, email: { ...prev.email, isChecking: true, error: "" } }))
      try {
        const { data } = await axios.get(`http://localhost:5000/auth/check-email?email=${formData.email.trim()}`)
        if (!data.isUnique) {
          setValidation(prev => ({ ...prev, email: { isChecking: false, error: "Email is already registered" } }))
        } else {
          setValidation(prev => ({ ...prev, email: { isChecking: false, error: "" } }))
        }
      } catch (err) {
        setValidation(prev => ({ ...prev, email: { isChecking: false, error: "Error checking email" } }))
      }
    }
    
    const timeoutId = setTimeout(checkEmail, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (validation.username.error || validation.email.error) {
      setError("Please fix the validation errors before submitting.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      await axios.post("http://localhost:5000/auth/register", {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      })
      setResendTimer(60)
      setIsOtpDialogOpen(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setOtpError("")
    setIsResending(true)
    try {
      await axios.post("http://localhost:5000/auth/register", {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      })
      setResendTimer(60)
    } catch (err: any) {
      setOtpError("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length < 6) {
      setOtpError("OTP must be 6 digits")
      return
    }

    setOtpError("")
    setIsVerifyingOtp(true)

    try {
      const payload = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        otp: otpValue
      }
      
      const response = await axios.post("http://localhost:5000/auth/verify-registration", payload)
      
      // Auto login using the new setAuth
      setAuth(response.data.user, response.data.tokens)
      router.push("/dashboard")
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || "Verification failed. Please try again.")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start organizing your work today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              id="username"
              name="username"
              type="text"
              required
              className={`${validation.username.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="Choose a unique username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            {validation.username.isChecking && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
            )}
            {!validation.username.isChecking && !validation.username.error && formData.username && (
              <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
            )}
          </div>
          {validation.username.error && (
            <p className="text-xs font-medium text-red-500 mt-1">{validation.username.error}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              required
              className={`${validation.email.error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {validation.email.isChecking && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
            )}
            {!validation.email.isChecking && !validation.email.error && formData.email && (
              <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
            )}
          </div>
          {validation.email.error && (
            <p className="text-xs font-medium text-red-500 mt-1">{validation.email.error}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full mt-6" 
          disabled={loading || !!validation.username.error || !!validation.email.error}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {isOtpDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isVerifyingOtp && setIsOtpDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg z-10"
            >
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Verify your email</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  We've sent a 6-digit verification code to <span className="font-medium text-foreground">{formData.email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                {otpError && (
                  <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20 text-center">
                    {otpError}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="otp" className="sr-only">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    className="text-center text-2xl tracking-widest h-12"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    disabled={isVerifyingOtp}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsOtpDialogOpen(false)}
                    disabled={isVerifyingOtp}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isVerifyingOtp || otpValue.length !== 6}
                  >
                    {isVerifyingOtp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify & Register"
                    )}
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{" "}
                    {resendTimer > 0 ? (
                      <span className="text-muted-foreground font-medium">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-primary hover:underline font-medium focus:outline-none"
                      >
                        {isResending ? "Sending..." : "Resend OTP"}
                      </button>
                    )}
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
