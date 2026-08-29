"use client"

import * as React from "react"
import { 
  Users, Briefcase, Activity, Calendar, User, 
  Mail, Check, X, FolderKanban, CheckSquare, 
  Bell, ArrowRight, Clock, MoreHorizontal, Edit3,
  Loader2, Flag, Building2, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../../../store/auth.store"
import { projectsService, ProjectData } from "../../../services/organization/projects.service"
import { tasksService, TaskData } from "../../../services/organization/tasks.service"
import { organizationsService, OrganizationData } from "../../../services/organization/organizations.service"
import { invitationsService, PendingInvitation } from "../../../services/user/invitations.service"

export default function DashboardOverviewPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  const [projects, setProjects] = React.useState<ProjectData[]>([])
  const [tasks, setTasks] = React.useState<TaskData[]>([])
  const [organizations, setOrganizations] = React.useState<OrganizationData[]>([])
  const [invitations, setInvitations] = React.useState<PendingInvitation[]>([])
  const [loading, setLoading] = React.useState(true)
  const [actionLoading, setActionLoading] = React.useState<string | null>(null)

  const fetchDashboardData = React.useCallback(async () => {
    try {
      const [projectsData, tasksData, orgsData, invitesData] = await Promise.all([
        projectsService.getMyProjects().catch(() => []),
        tasksService.getMyTasks().catch(() => []),
        organizationsService.getJoinedOrganizations().catch(() => []),
        invitationsService.getMyInvitations().catch(() => []),
      ])

      setProjects(projectsData || [])
      setTasks(tasksData || [])
      setOrganizations(orgsData || [])
      setInvitations(invitesData || [])
    } catch (error) {
      console.error("Failed to load dashboard data", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleAcceptInvite = async (token: string) => {
    setActionLoading(token)
    try {
      await invitationsService.acceptInvitation(token)
      await fetchDashboardData()
    } catch (err) {
      console.error("Failed to accept invitation", err)
    } finally {
      setActionLoading(null)
    }
  }

  // Derived calculations
  const tasksDoneCount = tasks.filter(t => t.status === 'DONE').length
  const orgsCount = organizations.length > 0 ? organizations.length : (user?.organization ? 1 : 0)
  const pendingTasksCount = tasks.filter(t => t.status !== 'DONE').length

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U"

  return (
    <div className="flex-1 overflow-y-auto stylish-scrollbar-dark px-8 pb-8 pt-[104px] h-full bg-[#131417]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Dashboard</h1>
          <p className="text-white/40 mt-1">Here is a comprehensive overview of your workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchDashboardData} disabled={loading} className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 border border-white/[0.04]">
            <RefreshCw className={`h-4 w-4 text-white/70 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="bg-[#18191E] border border-white/[0.04] px-4 py-2 rounded-xl text-sm font-medium text-white/70 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/40" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ==================================================================================== */}
        {/* LEFT COLUMN: Profile & Invitations (col-span-3)                                      */}
        {/* ==================================================================================== */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Profile View */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Link href="/dashboard/profile">
                <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </Link>
            </div>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] p-[2px] mb-4">
                <div className="h-full w-full bg-[#1C1E24] rounded-full flex items-center justify-center border-2 border-[#1C1E24] overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-white">{userInitials}</span>
                  )}
                </div>
              </div>
              <h2 className="text-lg font-semibold text-white">{user?.name || "User"}</h2>
              <p className="text-xs text-white/40 mt-1">{user?.email || ""}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                <User className="h-3 w-3" /> {user?.role?.name || "Member"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/[0.04]">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{loading ? "-" : tasksDoneCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Tasks Done</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{loading ? "-" : orgsCount}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Orgs</div>
              </div>
            </div>
          </div>

          {/* Invitations View */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/40" /> Pending Invites
              </h2>
              <span className="bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {invitations.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {invitations.map((invite) => (
                <div key={invite.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/60 font-bold text-xs">
                      {invite.organizationName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{invite.organizationName}</div>
                      <div className="text-[10px] text-white/40">Invited as <span className="text-white/70">{invite.roleName}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button 
                      onClick={() => handleAcceptInvite(invite.token)}
                      disabled={actionLoading === invite.token}
                      className="flex-1 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] text-xs font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {actionLoading === invite.token ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} 
                      Accept
                    </button>
                  </div>
                </div>
              ))}

              {invitations.length === 0 && (
                <div className="py-6 text-center text-white/40 text-xs">
                  No pending invitations at this time.
                </div>
              )}
            </div>
          </div>

        </div>


        {/* ==================================================================================== */}
        {/* CENTER COLUMN: Organizations & Projects (col-span-6)                                 */}
        {/* ==================================================================================== */}
        <div className="xl:col-span-6 space-y-6">
          
          {/* Organizations Section */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-white/40" /> My Organizations
              </h2>
              <Link href="/dashboard/organizations" className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.length > 0 ? (
                organizations.slice(0, 2).map((org) => (
                  <div 
                    key={org.id} 
                    onClick={() => router.push('/dashboard/organizations')}
                    className="group p-5 rounded-xl bg-white/5 border border-white/[0.04] hover:border-white/10 transition-colors cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] opacity-5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-10"></div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-[1px]">
                        <div className="h-full w-full bg-[#1C1E24] rounded-xl flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{org.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-white group-hover:text-[#3B82F6] transition-colors truncate">{org.name}</h3>
                        <div className="text-[10px] text-white/40 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {org.category || "Organization"}</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70 transition-colors">
                      Open Workspace
                    </button>
                  </div>
                ))
              ) : user?.organization ? (
                <div 
                  onClick={() => router.push('/dashboard/organizations')}
                  className="group p-5 rounded-xl bg-white/5 border border-white/[0.04] hover:border-white/10 transition-colors cursor-pointer relative overflow-hidden col-span-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-[1px]">
                      <div className="h-full w-full bg-[#1C1E24] rounded-xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{user.organization.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#3B82F6] transition-colors">{user.organization.name}</h3>
                      <div className="text-[10px] text-white/40 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {user.organization.category || "Organization"}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70 transition-colors">
                    Open Workspace
                  </button>
                </div>
              ) : (
                <div className="col-span-full py-6 text-center text-white/40 text-sm">
                  You haven't joined any organizations yet. Check your pending invitations!
                </div>
              )}
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-white/40" /> Active Projects
              </h2>
              <Link href="/dashboard/projects" className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center gap-1">
                View All ({projects.length}) <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => {
                const isCompleted = project.status === 'COMPLETED'
                const statusLabel = isCompleted ? 'Completed' : project.status === 'ACTIVE' ? 'Active' : 'Planning'
                const statusColor = isCompleted ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#3B82F6] bg-[#3B82F6]/10'
                const taskCount = project._count?.tasks || 0

                return (
                  <div 
                    key={project.id} 
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="p-4 rounded-xl bg-white/5 border border-white/[0.04] hover:bg-white/[0.07] transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex-1 pr-6 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-white group-hover:text-[#3B82F6] transition-colors truncate">{project.name}</h3>
                        <span className="text-[10px] text-white/40">{taskCount} tasks</span>
                      </div>
                      <p className="text-[10px] text-white/40 mb-3 truncate">{project.description || "Project Workspace"}</p>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#3B82F6] rounded-full`} style={{ width: isCompleted ? '100%' : '50%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColor}`}>
                        {statusLabel}
                      </span>
                      <span className="text-[10px] font-bold text-white/30 uppercase">
                        {project.priority}
                      </span>
                    </div>
                  </div>
                )
              })}

              {projects.length === 0 && (
                <div className="py-8 text-center text-white/40 text-xs">
                  No active projects assigned yet.
                </div>
              )}
            </div>
          </div>

        </div>


        {/* ==================================================================================== */}
        {/* RIGHT COLUMN: Tasks & Activity (col-span-3)                                          */}
        {/* ==================================================================================== */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Tasks Section */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-white/40" /> My Tasks
              </h2>
              <span className="bg-white/10 text-white/70 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingTasksCount} Due
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.slice(0, 4).map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => router.push(task.projectId ? `/dashboard/projects/${task.projectId}` : '/dashboard/organizations')}
                  className="group p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors cursor-pointer flex items-start gap-3"
                >
                  <div className={`mt-0.5 h-4 w-4 rounded border flex-shrink-0 transition-colors flex items-center justify-center ${
                    task.status === 'DONE' ? 'bg-[#22C55E] border-[#22C55E] text-white' : 'border-white/20 group-hover:border-[#3B82F6]'
                  }`}>
                    {task.status === 'DONE' && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-white/90 truncate group-hover:text-[#3B82F6] transition-colors">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        task.priority === 'URGENT' || task.priority === 'HIGH' ? 'text-[#EF4444] bg-[#EF4444]/10' :
                        task.priority === 'MEDIUM' ? 'text-[#EAB308] bg-[#EAB308]/10' :
                        'text-[#22C55E] bg-[#22C55E]/10'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-white/30 truncate">{task.project?.name || "Task"}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-medium text-[#3B82F6] whitespace-nowrap">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Active"}
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="py-6 text-center text-white/40 text-xs">
                  No tasks assigned yet.
                </div>
              )}
            </div>
            
            <Link href="/dashboard/organizations" className="block w-full mt-4 py-2 text-xs font-medium text-white/40 hover:text-white transition-colors border-t border-white/[0.04] pt-4 text-center">
              View All Tasks
            </Link>
          </div>

          {/* Activity / Notifications Section */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-white/40" /> Activity
              </h2>
            </div>
            
            <div className="relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent space-y-6">
              {tasks.slice(0, 3).map((task, i) => (
                <div key={task.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#1C1E24] bg-white/10 text-white/40 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2">
                    <CheckSquare className="h-2.5 w-2.5 text-[#3B82F6]" />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-8 md:ml-0 p-3 rounded-xl border border-white/[0.02] bg-white/[0.02] hover:bg-white/5 transition-colors cursor-pointer">
                    <h3 className="font-medium text-white/90 text-[11px] truncate">Assigned: {task.title}</h3>
                    <time className="text-[9px] text-white/40 mt-1 block">
                      {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </time>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="py-6 text-center text-white/40 text-xs">
                  No recent activity logged.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
