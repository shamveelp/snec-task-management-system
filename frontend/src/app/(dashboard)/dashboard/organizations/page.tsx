"use client"

import * as React from "react"
import { SecondarySidebar } from "../../../../components/user-dashboard/secondary-sidebar"
import { KanbanBoard } from "../../../../components/user-dashboard/kanban-board"
import { DashboardSidebarContext } from "../layout"

export default function OrganizationsPage() {
  const { isPrimaryExpanded, toggleSidebar } = React.useContext(DashboardSidebarContext)

  return (
    <div className="flex flex-1 overflow-hidden w-full h-full">
      <SecondarySidebar 
        isExpanded={!isPrimaryExpanded}
        onExpand={() => toggleSidebar?.()}
      />
      <KanbanBoard />
    </div>
  )
}
