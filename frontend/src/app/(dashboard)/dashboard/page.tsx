"use client"

import * as React from "react"
import { Users, Briefcase, Activity, TrendingUp, Calendar } from "lucide-react"

export default function DashboardOverviewPage() {
  return (
    <div className="flex-1 overflow-y-auto stylish-scrollbar-dark p-8 h-full bg-[#131417]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Dashboard</h1>
          <p className="text-white/40 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="bg-[#18191E] border border-white/[0.04] px-4 py-2 rounded-xl text-sm font-medium text-white/70 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-white/40" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Organizations", value: "6", change: "+2", icon: Briefcase, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10" },
          { label: "Pending Tasks", value: "25", change: "-4", icon: Activity, color: "text-[#EAB308]", bg: "bg-[#EAB308]/10" },
          { label: "Total Members", value: "148", change: "+12", icon: Users, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
          { label: "Productivity", value: "94%", change: "+5%", icon: TrendingUp, color: "text-[#A855F7]", bg: "bg-[#A855F7]/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/40 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[
              { title: "CodeSphere API Integration", org: "CodeSphere", time: "2 hours ago", status: "Completed" },
              { title: "Update Marketing Copy", org: "TechVanta", time: "5 hours ago", status: "In Progress" },
              { title: "Database Migration", org: "DataPulse", time: "1 day ago", status: "Completed" },
              { title: "Review UI Mockups", org: "CodeSphere", time: "2 days ago", status: "To Do" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">{activity.title}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{activity.org}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    activity.status === 'Completed' ? 'text-[#22C55E] bg-[#22C55E]/10' :
                    activity.status === 'In Progress' ? 'text-[#EAB308] bg-[#EAB308]/10' :
                    'text-[#EF4444] bg-[#EF4444]/10'
                  }`}>
                    {activity.status}
                  </span>
                  <div className="text-xs text-white/40 mt-2">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Notifications */}
        <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {[
              { task: "Finish Authentication Flow", date: "Tomorrow, 5:00 PM" },
              { task: "Submit Marketing Plan", date: "Friday, 12:00 PM" },
              { task: "Weekly Team Sync", date: "Monday, 10:00 AM" }
            ].map((deadline, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                <h3 className="text-sm font-medium text-white/90 mb-1">{deadline.task}</h3>
                <p className="text-xs text-white/40 flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {deadline.date}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
