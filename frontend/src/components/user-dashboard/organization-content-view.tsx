"use client"

import * as React from "react"
import { 
  Building2, ChevronRight, FolderKanban, CheckSquare, MessageSquare, 
  Users, Paperclip, Calendar, Flag, Clock, Star, ArrowUpRight, 
  SlidersHorizontal, Diamond, Loader2, CheckCircle2, AlertCircle, ExternalLink, X, Send, Upload, RefreshCw
} from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { projectsService, ProjectData } from "../../services/organization/projects.service"
import { tasksService, TaskData, TaskCommentData, TaskAttachmentData } from "../../services/organization/tasks.service"
import { organizationsService, OrganizationMember, OrganizationData } from "../../services/organization/organizations.service"
import { useRouter } from "next/navigation"
import { TaskDetailPanel } from "../projects/task-detail-panel"

interface OrganizationContentViewProps {
  organization: OrganizationData | null
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'bg-gray-400', badge: 'bg-white/5 text-white/60' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-[#3B82F6]', badge: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-[#EAB308]', badge: 'bg-[#EAB308]/10 text-[#EAB308]' },
  { id: 'DONE', title: 'Done', color: 'bg-[#22C55E]', badge: 'bg-[#22C55E]/10 text-[#22C55E]' },
]

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: 'text-red-400 fill-red-400',
  HIGH: 'text-orange-400 fill-orange-400',
  MEDIUM: 'text-blue-400',
  LOW: 'text-gray-400',
}

export function OrganizationContentView({ organization }: OrganizationContentViewProps) {
  const { user } = useAuthStore()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = React.useState<"overview" | "tasks" | "projects" | "discussions" | "members">("overview")
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban")
  
  const [projects, setProjects] = React.useState<ProjectData[]>([])
  const [myTasks, setMyTasks] = React.useState<TaskData[]>([])
  const [members, setMembers] = React.useState<OrganizationMember[]>([])
  const [loading, setLoading] = React.useState(true)

  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null)

  const userOrgRole = user?.role?.name || "Member"

  const fetchData = React.useCallback(async () => {
    if (!organization) return
    setLoading(true)
    try {
      const [projectsData, tasksData, membersData] = await Promise.all([
        projectsService.getMyProjects().catch(() => []),
        tasksService.getMyTasks().catch(() => []),
        organizationsService.getMembers().catch(() => []),
      ])

      // Filter projects that belong to this organization or user
      const orgProjects = (projectsData || []).filter(
        p => !p.organizationId || p.organizationId === organization.id
      )
      setProjects(orgProjects)

      // Filter tasks belonging to this organization's projects or assigned to user
      const orgTasks = (tasksData || []).filter(
        t => !t.project?.organizationId || t.project?.organizationId === organization.id
      )
      setMyTasks(orgTasks)
      setMembers(membersData || [])
    } catch (err) {
      console.error("Failed to load organization dashboard data", err)
    } finally {
      setLoading(false)
    }
  }, [organization?.id])

  React.useEffect(() => {
    fetchData()
  }, [organization?.id, fetchData])

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
    setTimeout(() => {
      if (e.target instanceof HTMLElement) e.target.style.opacity = '0.5'
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null)
    if (e.target instanceof HTMLElement) e.target.style.opacity = '1'
  }

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault()
    if (!draggedTaskId) return
    const prev = [...myTasks]
    setMyTasks(myTasks.map(t => (t.id === draggedTaskId ? { ...t, status: status as any } : t)))
    try {
      await tasksService.updateTask(draggedTaskId, { status })
    } catch {
      setMyTasks(prev)
    }
    setDraggedTaskId(null)
  }

  // Selected task project for TaskDetailPanel
  const selectedTaskObj = myTasks.find(t => t.id === selectedTaskId)
  const taskProject = projects.find(p => p.id === selectedTaskObj?.projectId) || {
    id: selectedTaskObj?.projectId || "",
    name: selectedTaskObj?.project?.name || "Project",
    description: "",
    startDate: null,
    endDate: null,
    priority: "MEDIUM" as const,
    status: "ACTIVE" as const,
    organizationId: organization?.id || "",
    createdById: "",
    createdAt: new Date().toISOString(),
    members: members.map(m => ({
      id: m.id,
      projectId: selectedTaskObj?.projectId || "",
      userId: m.id,
      role: 'DEVELOPER' as const,
      user: { id: m.id, name: m.name, email: m.email, profilePicture: null }
    }))
  }

  // Aggregate comments
  const allComments: Array<TaskCommentData & { taskTitle: string; taskId: string }> = []
  myTasks.forEach(task => {
    if (task.comments && task.comments.length > 0) {
      task.comments.forEach(c => {
        allComments.push({ ...c, taskTitle: task.title, taskId: task.id })
      })
    }
  })

  // Statistics
  const totalTasks = myTasks.length
  const completedTasks = myTasks.filter(t => t.status === 'DONE').length
  const pendingTasks = myTasks.filter(t => t.status !== 'DONE').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  if (!organization) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#131417] text-white/50">
        <Building2 className="h-12 w-12 text-white/20 mb-3" />
        <p className="text-sm">Select an organization from the sidebar to view details</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#131417] text-white overflow-hidden">
      
      {/* Header Area */}
      <div className="px-8 pt-[104px] pb-4 flex-shrink-0 bg-[#131417] border-b border-white/[0.04]">
        
        {/* Breadcrumb & Live Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm font-medium text-white/60 gap-2">
            <span className="hover:text-white cursor-pointer" onClick={() => router.push('/dashboard/organizations/all')}>Organizations</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white font-semibold">{organization.name}</span>
          </div>
          <div className="flex items-center text-xs font-medium text-white/60 gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse"></div>
            Joined Member Workspace
          </div>
        </div>

        {/* Organization Hero Title & Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#7C68EE] flex items-center justify-center font-bold text-xl text-white shadow-lg flex-shrink-0">
              {organization.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white/95">{organization.name}</h1>
                <span className="bg-white/10 text-white/70 text-xs px-2.5 py-0.5 rounded-full border border-white/10">
                  {organization.category || "General"}
                </span>
                <button onClick={fetchData} disabled={loading} className="flex items-center justify-center p-1.5 ml-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-50">
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-white/40 mt-1 flex items-center gap-2">
                <span>Role: <strong className="text-[#3B82F6] font-medium">{userOrgRole}</strong></span>
                <span>•</span>
                <span>{projects.length} Active Projects</span>
                <span>•</span>
                <span>{members.length} Members</span>
              </p>
            </div>
          </div>

          {/* Member Avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((m, idx) => (
                <div 
                  key={m.id || idx}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-[#131417] flex items-center justify-center text-white text-xs font-bold"
                  title={m.name}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            {members.length > 4 && (
              <div className="h-8 px-2 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/80">
                +{members.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Sub Nav Tabs */}
        <div className="flex items-center gap-8 overflow-x-auto stylish-scrollbar-dark pb-1">
          {[
            { id: "overview", name: "Overview", count: null },
            { id: "tasks", name: "My Tasks", count: myTasks.length },
            { id: "projects", name: "Projects", count: projects.length },
            { id: "discussions", name: "Discussions", count: allComments.length },
            { id: "members", name: "Team Members", count: members.length },
          ].map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-all pb-3 relative whitespace-nowrap cursor-pointer",
                  isActive ? "text-white font-semibold" : "text-white/40 hover:text-white/70"
                )}
              >
                <Diamond className={cn("h-2.5 w-2.5", isActive ? "text-[#3B82F6] fill-[#3B82F6]" : "opacity-0")} />
                <span>{tab.name}</span>
                {tab.count !== null && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    isActive ? "bg-[#3B82F6]/20 text-[#3B82F6]" : "bg-white/5 text-white/40"
                  )}>
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3B82F6] rounded-t-full shadow-[0_0_8px_#3B82F6]"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto stylish-scrollbar-dark p-8">
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
          </div>
        ) : (
          <>
            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className="space-y-8 max-w-7xl">
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Active Projects</span>
                      <FolderKanban className="h-5 w-5 text-[#3B82F6]" />
                    </div>
                    <div className="text-3xl font-bold text-white">{projects.length}</div>
                    <p className="text-xs text-white/40 mt-1">Available in this workspace</p>
                  </div>

                  <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">My Assigned Tasks</span>
                      <CheckSquare className="h-5 w-5 text-[#7C68EE]" />
                    </div>
                    <div className="text-3xl font-bold text-white">{totalTasks}</div>
                    <p className="text-xs text-white/40 mt-1">{pendingTasks} pending action</p>
                  </div>

                  <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Tasks Completed</span>
                      <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
                    </div>
                    <div className="text-3xl font-bold text-[#22C55E]">{completedTasks}</div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#22C55E] h-full rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">My Role</span>
                      <Users className="h-5 w-5 text-[#EAB308]" />
                    </div>
                    <div className="text-2xl font-bold text-white truncate">{userOrgRole}</div>
                    <p className="text-xs text-white/40 mt-1">Organization level permission</p>
                  </div>
                </div>

                {/* Two-Column Section: Active Projects + Recent Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Active Projects Widget */}
                  <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-[#3B82F6]" />
                        Organization Projects
                      </h2>
                      <button 
                        onClick={() => setActiveTab("projects")} 
                        className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
                      >
                        View All ({projects.length})
                      </button>
                    </div>

                    <div className="space-y-3">
                      {projects.slice(0, 4).map(project => (
                        <div 
                          key={project.id}
                          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                          className="bg-[#131417] border border-white/[0.04] hover:border-white/20 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="min-w-0 flex-1 mr-4">
                            <h3 className="text-sm font-semibold text-white group-hover:text-[#3B82F6] transition-colors truncate">
                              {project.name}
                            </h3>
                            <p className="text-xs text-white/40 truncate mt-0.5">
                              {project.description || "No description provided"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                              project.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-400" :
                              project.status === 'ACTIVE' ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-white/50"
                            )}>
                              {project.status}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      ))}

                      {projects.length === 0 && (
                        <div className="text-center py-8 text-white/40 text-xs">
                          No projects found in this organization.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* My Tasks Widget */}
                  <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-[#7C68EE]" />
                        My Assigned Tasks
                      </h2>
                      <button 
                        onClick={() => setActiveTab("tasks")} 
                        className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1"
                      >
                        Kanban View ({myTasks.length})
                      </button>
                    </div>

                    <div className="space-y-3">
                      {myTasks.slice(0, 4).map(task => (
                        <div 
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          className="bg-[#131417] border border-white/[0.04] hover:border-white/20 p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="min-w-0 flex-1 mr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                {task.id.split('-')[0]}
                              </span>
                              <Flag className={cn("h-3 w-3", PRIORITY_COLOR[task.priority])} />
                            </div>
                            <h3 className="text-sm font-semibold text-white group-hover:text-[#7C68EE] transition-colors truncate">
                              {task.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                              task.status === 'DONE' ? "bg-emerald-500/10 text-emerald-400" :
                              task.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-400" :
                              task.status === 'IN_REVIEW' ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-white/50"
                            )}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}

                      {myTasks.length === 0 && (
                        <div className="text-center py-8 text-white/40 text-xs">
                          You have no tasks assigned in this organization.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ── TASKS TAB (INTERACTIVE KANBAN / TABLE) ── */}
            {activeTab === "tasks" && (
              <div className="h-full flex flex-col space-y-6">
                
                {/* Toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center bg-[#18191E] border border-white/[0.06] p-1 rounded-xl">
                    <button 
                      onClick={() => setViewMode("kanban")}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        viewMode === "kanban" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"
                      )}
                    >
                      Kanban Board
                    </button>
                    <button 
                      onClick={() => setViewMode("table")}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        viewMode === "table" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white"
                      )}
                    >
                      List Table
                    </button>
                  </div>

                  <span className="text-xs text-white/40">
                    Showing {myTasks.length} task(s) assigned to you
                  </span>
                </div>

                {/* Kanban Columns */}
                {viewMode === "kanban" ? (
                  <div className="flex-1 overflow-x-auto pb-6 stylish-scrollbar-dark">
                    <div className="flex gap-6 items-start min-w-max">
                      {COLUMNS.map(column => {
                        const columnTasks = myTasks.filter(t => t.status === column.id)
                        return (
                          <div 
                            key={column.id}
                            className="w-[300px] bg-[#18191E] border border-white/[0.06] rounded-2xl flex flex-col overflow-hidden"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, column.id)}
                          >
                            {/* Column Header */}
                            <div className="p-4 border-b border-white/[0.04] bg-white/[0.02] flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", column.color)} />
                                <h3 className="font-bold text-xs text-white/90">{column.title}</h3>
                              </div>
                              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", column.badge)}>
                                {columnTasks.length}
                              </span>
                            </div>

                            {/* Task Cards */}
                            <div className="p-3 space-y-3 min-h-[300px] max-h-[600px] overflow-y-auto stylish-scrollbar-dark">
                              {columnTasks.map(task => (
                                <div 
                                  key={task.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, task.id)}
                                  onDragEnd={handleDragEnd}
                                  onClick={() => setSelectedTaskId(task.id)}
                                  className="bg-[#131417] p-4 rounded-xl border border-white/[0.04] hover:border-white/20 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all group"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">
                                      {task.id.split('-')[0]}
                                    </span>
                                    <Flag className={cn("h-3.5 w-3.5", PRIORITY_COLOR[task.priority])} />
                                  </div>

                                  <h4 className="text-sm font-semibold text-white/90 group-hover:text-[#3B82F6] transition-colors line-clamp-2 mb-2">
                                    {task.title}
                                  </h4>

                                  {task.project?.name && (
                                    <span className="inline-block text-[10px] font-medium bg-white/5 text-white/50 px-2 py-0.5 rounded mb-3">
                                      {task.project.name}
                                    </span>
                                  )}

                                  {task.dueDate && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-white/40 mb-3">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                                    <div className="flex items-center gap-3 text-white/30">
                                      {task._count && task._count.comments > 0 && (
                                        <div className="flex items-center gap-1 text-[11px]">
                                          <MessageSquare className="h-3 w-3" /> {task._count.comments}
                                        </div>
                                      )}
                                      {task._count && task._count.attachments > 0 && (
                                        <div className="flex items-center gap-1 text-[11px]">
                                          <Paperclip className="h-3 w-3" /> {task._count.attachments}
                                        </div>
                                      )}
                                    </div>

                                    {task.assignee && (
                                      <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#7C68EE] flex items-center justify-center text-white font-bold text-[9px]">
                                        {task.assignee.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {columnTasks.length === 0 && (
                                <div className="h-24 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/30 text-xs">
                                  Drop tasks here
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  /* Table View */
                  <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-xs font-semibold text-white/50 uppercase">
                          <th className="px-6 py-4">Task</th>
                          <th className="px-6 py-4">Project</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Priority</th>
                          <th className="px-6 py-4">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {myTasks.map(task => (
                          <tr 
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="text-sm font-semibold text-white hover:text-[#3B82F6]">
                                {task.title}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-white/60">
                              {task.project?.name || "General"}
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                                task.status === 'DONE' ? "bg-emerald-500/10 text-emerald-400" :
                                task.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-400" :
                                task.status === 'IN_REVIEW' ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-white/50"
                              )}>
                                {task.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-xs">
                                <Flag className={cn("h-3 w-3", PRIORITY_COLOR[task.priority])} />
                                <span className="text-white/70">{task.priority}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-white/50">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* ── PROJECTS TAB ── */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => (
                    <div 
                      key={project.id}
                      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      className="bg-[#18191E] border border-white/[0.06] hover:border-white/20 p-6 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-white/5 text-white/60 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {project.priority} Priority
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                            project.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-400" :
                            project.status === 'ACTIVE' ? "bg-blue-500/10 text-blue-400" : "bg-white/5 text-white/50"
                          )}>
                            {project.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-[#3B82F6] transition-colors mb-2">
                          {project.name}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
                          {project.description || "No description provided for this project."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs text-white/40">
                        <span>{project._count?.tasks || 0} Tasks</span>
                        <span className="text-[#3B82F6] group-hover:underline flex items-center gap-1 font-medium">
                          Open Board <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="col-span-full text-center py-16 text-white/40 text-sm">
                      No projects available in this organization yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── DISCUSSIONS / COMMENTS TAB ── */}
            {activeTab === "discussions" && (
              <div className="max-w-4xl space-y-4">
                {allComments.map((comment) => (
                  <div key={comment.id} className="bg-[#18191E] border border-white/[0.06] p-5 rounded-2xl flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#7C68EE] flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{comment.user.name}</span>
                          <span className="text-xs text-white/40">• on task <strong className="text-white/80 cursor-pointer hover:underline" onClick={() => setSelectedTaskId(comment.taskId)}>{comment.taskTitle}</strong></span>
                        </div>
                        <span className="text-xs text-white/40">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed bg-[#131417] p-3 rounded-xl border border-white/[0.03]">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}

                {allComments.length === 0 && (
                  <div className="text-center py-16 text-white/40 text-sm">
                    <MessageSquare className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    No discussions or comments posted on your tasks yet.
                  </div>
                )}
              </div>
            )}

            {/* ── MEMBERS TAB ── */}
            {activeTab === "members" && (
              <div className="bg-[#18191E] border border-white/[0.06] rounded-2xl overflow-hidden max-w-5xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-xs font-semibold text-white/50 uppercase">
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Org Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#7C68EE] flex items-center justify-center text-white text-xs font-bold">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-white">{member.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-white/60">{member.email}</td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {member.status || "ACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-white/70 font-medium">
                          {member.role || "Member"}
                        </td>
                      </tr>
                    ))}

                    {members.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-white/40 text-xs">
                          No members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTaskId && (
        <TaskDetailPanel
          taskId={selectedTaskId}
          projectRole={'DEVELOPER'}
          project={taskProject as any}
          onClose={() => setSelectedTaskId(null)}
          onTaskUpdated={fetchData}
        />
      )}

    </div>
  )
}
