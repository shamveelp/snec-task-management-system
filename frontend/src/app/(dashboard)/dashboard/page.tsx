"use client"

import * as React from "react"
import { 
  Users, Briefcase, Activity, Calendar, User, 
  Mail, Check, X, FolderKanban, CheckSquare, 
  Bell, ArrowRight, Clock, MoreHorizontal, Edit3 
} from "lucide-react"

import { useAuthStore } from "../../../store/auth.store"

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  
  return (
    <div className="flex-1 overflow-y-auto stylish-scrollbar-dark px-8 pb-8 pt-[104px] h-full bg-[#131417]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Dashboard</h1>
          <p className="text-white/40 mt-1">Here is a comprehensive overview of your workspace.</p>
        </div>
        <div className="bg-[#18191E] border border-white/[0.04] px-4 py-2 rounded-xl text-sm font-medium text-white/70 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-white/40" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
              <a href="/dashboard/profile">
                <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </a>
            </div>
            <div className="flex flex-col items-center text-center mt-2">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] p-[2px] mb-4">
                <div className="h-full w-full bg-[#1C1E24] rounded-full flex items-center justify-center border-2 border-[#1C1E24]">
                  <span className="text-xl font-bold text-white">JD</span>
                </div>
              </div>
              <h2 className="text-lg font-semibold text-white">John Doe</h2>
              <p className="text-xs text-white/40 mt-1">john.doe@example.com</p>
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                <User className="h-3 w-3" /> System Admin
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/[0.04]">
              <div className="text-center">
                <div className="text-xl font-bold text-white">12</div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Tasks Done</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">4</div>
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
              <span className="bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
            </div>
            
            <div className="space-y-4">
              {[
                { org: "TechVanta", role: "Developer" },
                { org: "Nexus AI", role: "Admin" }
              ].map((invite, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/60 font-bold text-xs">
                      {invite.org.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{invite.org}</div>
                      <div className="text-[10px] text-white/40">Invited as <span className="text-white/70">{invite.role}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="flex-1 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] text-xs font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <Check className="h-3 w-3" /> Accept
                    </button>
                    <button className="flex-1 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <X className="h-3 w-3" /> Decline
                    </button>
                  </div>
                </div>
              ))}
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
              <button className="text-xs font-medium text-white/40 hover:text-white transition-colors flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.organization ? (
                <div className="group p-5 rounded-xl bg-white/5 border border-white/[0.04] hover:border-white/10 transition-colors cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] opacity-5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-10`}></div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-[1px]`}>
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
                  <a href="/organization/dashboard">
                    <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-white/70 transition-colors">
                      Go to Dashboard
                    </button>
                  </a>
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
              <button className="p-1 rounded bg-white/5 hover:bg-white/10 text-white/40 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Website Redesign", org: "TechVanta", progress: 75, status: "On Track", color: "bg-[#22C55E]" },
                { name: "Mobile App MVP", org: "CodeSphere", progress: 40, status: "At Risk", color: "bg-[#EAB308]" },
                { name: "Database Migration", org: "DataPulse", progress: 90, status: "On Track", color: "bg-[#22C55E]" },
              ].map((project, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/[0.04] hover:bg-white/[0.07] transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white">{project.name}</h3>
                      <span className="text-[10px] text-white/40">{project.progress}%</span>
                    </div>
                    <p className="text-[10px] text-white/40 mb-3">{project.org}</p>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${project.color} rounded-full`} style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      project.status === 'On Track' ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#EAB308] bg-[#EAB308]/10'
                    }`}>
                      {project.status}
                    </span>
                    <div className="flex -space-x-2">
                      {[1,2,3].map((j) => (
                        <div key={j} className="h-6 w-6 rounded-full border border-[#1C1E24] bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-[8px] font-bold text-white">
                          U{j}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>


        {/* ==================================================================================== */}
        {/* RIGHT COLUMN: Tasks & Notifications (col-span-3)                                     */}
        {/* ==================================================================================== */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Tasks Section */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-white/40" /> My Tasks
              </h2>
              <span className="bg-white/10 text-white/70 text-[10px] font-bold px-2 py-0.5 rounded-full">5 Due</span>
            </div>
            
            <div className="space-y-3">
              {[
                { title: "Review PR #102", org: "CodeSphere", priority: "High", date: "Today" },
                { title: "Update README", org: "TechVanta", priority: "Med", date: "Tomorrow" },
                { title: "Fix Navigation Bug", org: "CodeSphere", priority: "High", date: "Today" },
                { title: "Design System Sync", org: "CyberNexa", priority: "Low", date: "Friday" },
              ].map((task, i) => (
                <div key={i} className="group p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors cursor-pointer flex items-start gap-3">
                  <div className="mt-0.5 h-4 w-4 rounded border border-white/20 group-hover:border-[#3B82F6] flex-shrink-0 transition-colors"></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-white/90 truncate">{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        task.priority === 'High' ? 'text-[#EF4444] bg-[#EF4444]/10' :
                        task.priority === 'Med' ? 'text-[#EAB308] bg-[#EAB308]/10' :
                        'text-[#22C55E] bg-[#22C55E]/10'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-white/30 truncate">{task.org}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-medium text-[#3B82F6]">{task.date}</div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-xs font-medium text-white/40 hover:text-white transition-colors border-t border-white/[0.04] pt-4">
              View All Tasks
            </button>
          </div>

          {/* Notifications Section */}
          <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-white/40" /> Activity
              </h2>
            </div>
            
            <div className="relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent space-y-6">
              {[
                { title: "Alex assigned you a task", time: "10 mins ago", icon: User, color: "text-[#3B82F6]" },
                { title: "Project 'MVP' completed", time: "2 hours ago", icon: Check, color: "text-[#22C55E]" },
                { title: "New member joined TechVanta", time: "5 hours ago", icon: Users, color: "text-[#A855F7]" },
                { title: "Meeting starting in 15m", time: "Yesterday", icon: Clock, color: "text-[#EAB308]" },
              ].map((activity, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-[#1C1E24] bg-white/10 text-white/40 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2">
                    <activity.icon className={`h-2.5 w-2.5 ${activity.color}`} />
                  </div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-8 md:ml-0 p-3 rounded-xl border border-white/[0.02] bg-white/[0.02] hover:bg-white/5 transition-colors cursor-pointer">
                    <h3 className="font-medium text-white/90 text-[11px]">{activity.title}</h3>
                    <time className="text-[9px] text-white/40 mt-1 block">{activity.time}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
