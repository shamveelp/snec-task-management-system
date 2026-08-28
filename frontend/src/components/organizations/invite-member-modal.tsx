import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Loader2, X } from "lucide-react"
import axios from "axios"

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function InviteMemberModal({ isOpen, onClose, onSuccess }: InviteMemberModalProps) {
  const [email, setEmail] = React.useState("")
  const [roleId, setRoleId] = React.useState("")
  const [roles, setRoles] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  React.useEffect(() => {
    if (isOpen) {
      setEmail("")
      setRoleId("")
      setError("")
      setSuccess("")
      fetchRoles()
    }
  }, [isOpen])

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/organizations/roles')
      setRoles(response.data)
      if (response.data.length > 0) {
        setRoleId(response.data[0].id)
      }
    } catch (err) {
      console.error("Failed to fetch roles", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const token = localStorage.getItem('accessToken')
      await axios.post('http://localhost:5000/invitations', {
        email: email.trim(),
        roleId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess("Invitation sent successfully!")
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invitation")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card w-full max-w-md rounded-xl shadow-lg border overflow-hidden"
        >
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Invite Team Member</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-md bg-green-500/15 text-green-500 text-sm font-medium">
                  {success}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Invitation
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
