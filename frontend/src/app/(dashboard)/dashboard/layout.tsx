"use client"

import * as React from "react"
import { ProtectedRoute } from "../../../components/auth/protected-route"
import { useAuthStore } from "../../../store/auth.store"
import axios from "axios"
import { Navbar } from "../../../components/landing/navbar"
import { PrimarySidebar } from "../../../components/user-dashboard/primary-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const [invitations, setInvitations] = React.useState<any[]>([])
  const [isPrimaryExpanded, setIsPrimaryExpanded] = React.useState(false)

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
    }
  }

  const handleToggle = () => {
    setIsPrimaryExpanded(!isPrimaryExpanded)
  }

  return (
    <ProtectedRoute allowedRoles={["Developer", "Project Manager", "Team Lead"]}>
      {/* 
        The main background is dark. 
        We use h-screen to ensure the sidebar takes the full height of the viewport.
      */}
      <div className="flex h-screen w-screen overflow-hidden bg-[#131417] text-white font-sans selection:bg-[#7C68EE] selection:text-white">
        
        {/* Full-height Primary Sidebar */}
        <PrimarySidebar 
          isExpanded={isPrimaryExpanded} 
          onToggle={handleToggle} 
        />
        
        {/* Main Content Area (to the right of the sidebar) */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Navbar wrapper: We make it position absolute inside the flex-1 container so it sits at the top */}
          <div className="absolute top-0 left-0 right-0 z-50">
            <Navbar />
          </div>

          {/* Children container (pushed down by pt-20 to clear the Navbar) */}
          <div className="flex-1 flex pt-20 overflow-hidden">
            {/* We pass the sidebar toggle state to children if they need it (like SecondarySidebar) */}
            {/* But wait, we can't pass props to children in a layout easily. 
                Instead, we can use React Context, OR we can just let the SecondarySidebar render unconditionally in the child page, 
                and we pass the state using a Context provider. */}
            {/* Let's create a simple context for the sidebar state so children can access it. */}
            <DashboardSidebarContext.Provider value={{ isPrimaryExpanded }}>
              {children}
            </DashboardSidebarContext.Provider>
          </div>
        </div>

      </div>
    </ProtectedRoute>
  )
}

// Simple context to pass the sidebar state to child pages
export const DashboardSidebarContext = React.createContext<{isPrimaryExpanded: boolean}>({ isPrimaryExpanded: false })
