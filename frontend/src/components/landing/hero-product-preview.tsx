"use client"

import { CheckCircle2, Circle, Clock, MoreHorizontal, PieChart, Users, FolderKanban, Bell, Search, Plus } from "lucide-react"
import { Badge } from "../ui/badge"

export function HeroProductPreview() {
  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] text-left ring-1 ring-white/10">
      
      {/* Sidebar Mock */}
      <div className="w-64 border-r border-border/50 bg-muted/30 hidden md:flex flex-col p-4">
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            Ac
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">Acme Corp</span>
            <span className="text-xs text-muted-foreground leading-tight">Free Plan</span>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium">
            <PieChart className="w-4 h-4" />
            Overview
          </div>
          <div className="flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm font-medium transition-colors">
            <FolderKanban className="w-4 h-4" />
            Projects
          </div>
          <div className="flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm font-medium transition-colors">
            <CheckCircle2 className="w-4 h-4" />
            Tasks
          </div>
          <div className="flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm font-medium transition-colors">
            <Users className="w-4 h-4" />
            Team
          </div>
          <div className="flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm font-medium transition-colors">
            <Bell className="w-4 h-4" />
            Notifications
            <Badge variant="destructive" className="ml-auto px-1.5 py-0 min-w-[20px] text-[10px]">3</Badge>
          </div>
        </nav>

        <div className="mt-auto">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground text-sm font-medium transition-colors">
            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
              S
            </div>
            Sarah Jenkins
          </div>
        </div>
      </div>

      {/* Main Content Mock */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border/50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md text-sm w-64">
            <Search className="w-4 h-4" />
            Search...
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-primary text-primary-foreground p-1.5 rounded-md flex items-center gap-1 text-sm font-medium px-3">
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Good morning, Sarah</h2>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Projects", value: "24", trend: "+2 this week" },
              { label: "Completed Tasks", value: "126", trend: "+14 this week" },
              { label: "In Progress", value: "43", trend: "On track" },
              { label: "Overdue", value: "7", trend: "-3 from last week", isBad: true },
            ].map((metric, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 bg-card">
                <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                <div className="text-3xl font-semibold mb-1">{metric.value}</div>
                <div className={`text-xs ${metric.isBad ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {metric.trend}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Task List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recent Tasks</h3>
                <span className="text-sm text-primary cursor-pointer hover:underline">View all</span>
              </div>
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                {[
                  { title: "Review Q3 marketing assets", project: "Marketing Site", status: "Done", priority: "High" },
                  { title: "Implement OAuth2 flow", project: "Auth Service", status: "In Progress", priority: "Highest" },
                  { title: "Update employee handbook", project: "HR Ops", status: "To Do", priority: "Medium" },
                  { title: "Fix navigation bug on mobile", project: "Mobile App", status: "In Progress", priority: "High" },
                ].map((task, i) => (
                  <div key={i} className="flex items-center p-4 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <div className="mr-3">
                      {task.status === "Done" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : task.status === "In Progress" ? (
                        <Clock className="w-5 h-5 text-amber-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">{task.project}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">{task.status}</Badge>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="p-4 rounded-xl border border-border/50 bg-card space-y-4">
                {[
                  { user: "J", name: "John", action: "completed", target: "API Specs", time: "2h ago" },
                  { user: "A", name: "Alice", action: "commented on", target: "Design System", time: "4h ago" },
                  { user: "M", name: "Mike", action: "created", target: "Q4 Roadmap", time: "5h ago" },
                ].map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold shrink-0">
                      {act.user}
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium">{act.name}</span> {act.action} <span className="font-medium">{act.target}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
