import { Metadata } from "next"
import { ProtectedRoute } from "../../../components/auth/protected-route"
import { OrganizationSidebar } from "../../../components/organizations/organization-sidebar"
import { OrganizationNavbar } from "../../../components/organizations/organization-navbar"

export const metadata: Metadata = {
  title: "Organization - FlowTask",
  description: "Manage your organization, team, and projects.",
}

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["Organization Admin"]}>
      <div className="flex h-screen w-screen overflow-hidden bg-[#E9ECF5] font-sans">
        <OrganizationSidebar />
        
        <div className="flex flex-col flex-1 min-w-0 bg-white overflow-hidden relative">
          <OrganizationNavbar />
          
          <main className="flex-1 overflow-y-auto outline-none scrollbar-hide">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
