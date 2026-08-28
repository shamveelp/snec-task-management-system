"use client"

import { ProtectedRoute } from "../../../components/auth/protected-route"
import { useAuthStore } from "../../../store/auth.store"
import { Button } from "../../../components/ui/button"

export default function UserDashboardPage() {
  const { user, logout } = useAuthStore()

  return (
    <ProtectedRoute allowedRoles={["Developer", "Project Manager", "Team Lead"]}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name} 👋</h1>
            <p className="text-muted-foreground mt-1">This is your personal dashboard.</p>
          </div>
          <Button variant="outline" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-xl bg-card">
            <h3 className="font-semibold mb-2">My Tasks</h3>
            <p className="text-sm text-muted-foreground">You have 0 pending tasks today.</p>
          </div>
          <div className="p-6 border rounded-xl bg-card">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          </div>
          <div className="p-6 border rounded-xl bg-card">
            <h3 className="font-semibold mb-2">Profile Overview</h3>
            <p className="text-sm text-muted-foreground text-wrap break-words">
              <strong>Username:</strong> {user?.username} <br />
              <strong>Email:</strong> {user?.email}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
