"use client"

import * as React from "react"
import { SecondarySidebar } from "../../../../components/user-dashboard/secondary-sidebar"
import { OrganizationContentView } from "../../../../components/user-dashboard/organization-content-view"
import { DashboardSidebarContext } from "../layout"
import { OrganizationData } from "../../../../services/organization/organizations.service"
import { useAuthStore } from "../../../../store/auth.store"

export default function OrganizationsPage() {
  const { isPrimaryExpanded, toggleSidebar } = React.useContext(DashboardSidebarContext)
  const { user } = useAuthStore()
  const [selectedOrg, setSelectedOrg] = React.useState<OrganizationData | null>(null)

  React.useEffect(() => {
    if (!selectedOrg && user?.organization) {
      setSelectedOrg({
        id: user.organization.id,
        name: user.organization.name,
        category: user.organization.category || "General",
        memberCount: 1,
        createdAt: new Date().toISOString(),
      })
    }
  }, [user?.organization?.id])

  return (
    <div className="flex flex-1 overflow-hidden w-full h-full">
      <SecondarySidebar 
        isExpanded={!isPrimaryExpanded}
        onExpand={() => toggleSidebar?.()}
        selectedOrgId={selectedOrg?.id}
        onSelectOrg={(org) => setSelectedOrg(org)}
      />
      <OrganizationContentView organization={selectedOrg} />
    </div>
  )
}
