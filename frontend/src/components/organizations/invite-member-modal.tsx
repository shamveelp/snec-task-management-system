import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { Loader2, X, Search, Mail, Shield } from "lucide-react"
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-visible relative text-white"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-700 bg-gray-800 rounded-t-3xl flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Invite Team Member</h2>
              <p className="text-sm text-gray-300 mt-1">Send an invitation to join your organization.</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-visible bg-gray-900 rounded-b-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-900/40 border border-red-700 text-red-300 text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-sm font-medium">
                  {success}
                </div>
              )}

              {/* Email Search */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-bold text-gray-300">
                  <Mail className="inline h-4 w-4 mr-1.5 text-gray-400" />
                  Email Address or Username
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    id="email"
                    type="text"
                    placeholder="Search or enter email..."
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full pl-9 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#7C68EE] focus:border-[#7C68EE] outline-none transition-all"
                    required
                    autoComplete="off"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute z-[100] w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    {searchResults.length > 0 ? (
                      <ul className="max-h-60 overflow-auto py-1">
                        {searchResults.map((u) => (
                          <li
                            key={u.id}
                            className="px-4 py-3 hover:bg-gray-700 cursor-pointer flex flex-col transition-colors"
                            onClick={() => selectUser(u)}
                          >
                            <span className="font-semibold text-sm text-white">{u.name}</span>
                            <span className="text-xs text-gray-400">{u.email}</span>
                          </li>
                        ))}
                      </ul>
                    ) : !isSearching ? (
                      <div className="px-4 py-4 text-sm text-gray-400">
                        No registered developers found.
                        <br />
                        <span className="text-xs text-gray-500">They will receive an email invitation to join.</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-300">
                  <Shield className="inline h-4 w-4 mr-1.5 text-gray-400" />
                  Role
                </label>
                <select
                  id="role"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-[#7C68EE] focus:border-[#7C68EE] outline-none transition-all appearance-none font-medium"
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id} className="bg-gray-800 text-white">
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-[#7C68EE] hover:bg-[#6b58dd] text-white rounded-xl py-3 h-auto font-semibold shadow-sm transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
