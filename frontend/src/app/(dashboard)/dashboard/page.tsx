"use client"

import * as React from "react"
import { ProtectedRoute } from "../../../components/auth/protected-route"
import { useAuthStore } from "../../../store/auth.store"
import { Button } from "../../../components/ui/button"
import { Building2, Mail, FolderKanban, LogOut, Check, X } from "lucide-react"
import axios from "axios"
import { cn } from "../../../lib/utils"
import { Navbar } from "../../../components/landing/navbar"

export default function UserDashboardPage() {
  const { user, logout, checkAuth } = useAuthStore()
  const [invitations, setInvitations] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (user) {
      fetchInvitations()
    }
  }, [user])

  const fetchInvitations = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get('http://localhost:5000/invitations/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInvitations(response.data)
    } catch (err) {
      console.error("Failed to fetch invitations", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (invitationToken: string) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.post(`http://localhost:5000/invitations/${invitationToken}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchInvitations()
      await checkAuth() // Refresh user data to get new organizationId
    } catch (err) {
      console.error("Failed to accept invitation", err)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["Developer", "Project Manager", "Team Lead"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 mt-10">
          
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Column - Main Content */}
            <div className="flex-1 space-y-8">
              
              {/* Organization Section */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    My Organization
                  </h2>
                </div>
                <div className="p-6">
                  {user?.organizationId ? (
                    <div className="flex items-center gap-4 p-4 border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {user?.organization?.name || "Active Organization"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You are participating as a <span className="font-medium text-gray-700 dark:text-gray-300">{user?.role?.name}</span>.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <h3 className="text-gray-900 dark:text-white font-medium">No Organization</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                        You haven't joined an organization yet. Wait for an invitation from an organization administrator.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Projects Section (Placeholder) */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FolderKanban className="h-5 w-5 text-gray-500" />
                    Assigned Projects
                  </h2>
                  <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full">0 Active</span>
                </div>
                <div className="p-8 text-center">
                  <FolderKanban className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No projects have been assigned to you yet.</p>
                </div>
              </section>

            </div>

            {/* Right Column - Sidebar */}
            <div className="w-full md:w-80 space-y-8">
              
              {/* Invitations Section */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Invitations
                  </h2>
                  {invitations.length > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {invitations.length} New
                    </span>
                  )}
                </div>
                <div className="p-0">
                  {loading ? (
                    <div className="p-6 text-center text-sm text-gray-500">Loading invitations...</div>
                  ) : invitations.length > 0 ? (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                      {invitations.map((invite) => (
                        <li key={invite.id} className="p-5">
                          <p className="text-sm text-gray-900 dark:text-white font-medium leading-tight">
                            {invite.organizationName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Invited as: <span className="font-medium text-gray-700 dark:text-gray-300">{invite.roleName}</span>
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAccept(invite.token)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <X className="h-4 w-4 mr-1" /> Decline
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-gray-500">You have no pending invitations.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Profile Overview */}
              <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">Profile Overview</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Username</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{user?.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 break-words">{user?.email}</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
