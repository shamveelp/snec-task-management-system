import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Loader2, X, Search, Check } from "lucide-react"
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
  
  const [searchResults, setSearchResults] = React.useState<any[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      setEmail("")
      setRoleId("")
      setError("")
      setSuccess("")
      setSearchResults([])
      setShowDropdown(false)
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.length >= 2) {
      setShowDropdown(true)
      setIsSearching(true)
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const token = localStorage.getItem('accessToken')
          const response = await axios.get(`http://localhost:5000/organizations/search-developers?q=${encodeURIComponent(value)}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setSearchResults(response.data)
        } catch (err) {
          console.error("Failed to search users", err)
        } finally {
          setIsSearching(false)
        }
      }, 500)
    } else {
      setSearchResults([])
      setShowDropdown(false)
      setIsSearching(false)
    }
  }

  const selectUser = (selectedUser: any) => {
    setEmail(selectedUser.email)
    setShowDropdown(false)
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
          className="bg-card w-full max-w-md rounded-xl shadow-lg border overflow-visible relative"
        >
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Invite Team Member</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-6 overflow-visible">
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
              
              <div className="space-y-2 relative">
                <Label htmlFor="email">Email Address or Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Search or enter email..."
                    value={email}
                    onChange={handleEmailChange}
                    className="pl-9"
                    required
                    autoComplete="off"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                {showDropdown && (
                  <div className="absolute z-[100] w-full mt-1 bg-card border rounded-md shadow-lg overflow-hidden">
                    {searchResults.length > 0 ? (
                      <ul className="max-h-60 overflow-auto py-1">
                        {searchResults.map((user) => (
                          <li
                            key={user.id}
                            className="px-4 py-2 hover:bg-muted cursor-pointer flex flex-col transition-colors"
                            onClick={() => selectUser(user)}
                          >
                            <span className="font-medium text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </li>
                        ))}
                      </ul>
                    ) : !isSearching ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        No registered developers found. 
                        <br />
                        <span className="text-xs">They will receive an email invitation to join.</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
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

              <Button type="submit" className="w-full mt-2" disabled={loading}>
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
