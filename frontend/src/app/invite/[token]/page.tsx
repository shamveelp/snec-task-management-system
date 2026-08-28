"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore } from "../../../store/auth.store"
import axios from "axios"
import { Button } from "../../../components/ui/button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const { isAuthenticated, user, checkAuth } = useAuthStore()

  const [isLoading, setIsLoading] = React.useState(true)
  const [isAccepting, setIsAccepting] = React.useState(false)
  const [inviteDetails, setInviteDetails] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    const fetchInvite = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/invitations/${token}`)
        setInviteDetails(response.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Invalid or expired invitation link")
      } finally {
        setIsLoading(false)
      }
    }
    fetchInvite()
  }, [token])

  const handleAccept = async () => {
    setIsAccepting(true)
    setError(null)
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.post(`http://localhost:5000/invitations/${token}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setSuccess(true)
      await checkAuth() // Refresh user data to get new role
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to accept invitation")
      setIsAccepting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !inviteDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 border rounded-xl bg-card text-center shadow-lg">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invitation Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/">
            <Button className="w-full">Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 border rounded-xl bg-card text-center shadow-lg">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invitation Accepted!</h2>
          <p className="text-muted-foreground mb-6">You are now a member of {inviteDetails?.organizationName}. Redirecting to your dashboard...</p>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full p-8 border rounded-xl bg-card text-center shadow-xl shadow-primary/5">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">👋</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">You've been invited!</h2>
        <p className="text-muted-foreground mb-8">
          You have been invited to join <strong className="text-foreground">{inviteDetails?.organizationName}</strong> as a <strong className="text-foreground">{inviteDetails?.roleName}</strong>.
        </p>

        {error && (
          <div className="p-3 mb-6 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              You are logged in as <strong>{user?.email}</strong>.
            </p>
            <Button 
              className="w-full h-11" 
              onClick={handleAccept} 
              disabled={isAccepting}
            >
              {isAccepting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Accept Invitation
            </Button>
            <Button variant="outline" className="w-full h-11" onClick={() => router.push("/")}>
              Decline & Go Home
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Link href={`/login?inviteToken=${token}`}>
              <Button className="w-full h-11">
                Log In to Accept
              </Button>
            </Link>
            <Link href={`/register?inviteToken=${token}`}>
              <Button variant="outline" className="w-full h-11">
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
