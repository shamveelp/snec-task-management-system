"use client"

import { useAuthStore } from "../../../../store/auth.store"
import { Shield, Users, Settings, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Button } from "../../../../components/ui/button"

import { ProtectedRoute } from "../../../../components/auth/protected-route"

export default function AdminDashboardPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <ProtectedRoute allowedRoles={['Super Admin']} redirectPath="/admin/login">
      <div className="min-h-screen bg-muted/20">
      {/* Top Navbar */}
      <header className="bg-background border-b border-border px-6 h-16 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/10 text-rose-500 p-2 rounded-md">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">System Administration</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">{user?.email || 'admin@flowtask.com'}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>Log Out</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Super Admin</h1>
          <p className="text-muted-foreground">Here's an overview of the system status.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Total Workspaces</h3>
            </div>
            <div className="text-3xl font-bold">142</div>
            <div className="text-xs text-muted-foreground mt-2">+12 this week</div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">System Health</h3>
            </div>
            <div className="text-3xl font-bold text-emerald-500">99.9%</div>
            <div className="text-xs text-muted-foreground mt-2">All systems operational</div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">Active Roles</h3>
            </div>
            <div className="text-3xl font-bold">3</div>
            <div className="text-xs text-muted-foreground mt-2">System level roles</div>
          </div>
        </div>

        {/* System Settings Placeholder */}
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border/50">
            <h2 className="font-semibold text-lg">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm">Manage Global Roles</h4>
                <p className="text-xs text-muted-foreground mt-1">Configure system-wide RBAC</p>
              </div>
              <Button variant="secondary" size="sm">Manage</Button>
            </div>
            <div className="p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm">Audit Logs</h4>
                <p className="text-xs text-muted-foreground mt-1">View system security events</p>
              </div>
              <Button variant="secondary" size="sm">View</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
