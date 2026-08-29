"use client"

import * as React from "react"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="flex-1 overflow-y-auto stylish-scrollbar-dark px-8 pb-8 pt-[104px] h-full bg-[#131417]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Notifications</h1>
          <p className="text-white/40 mt-1">Stay updated with activity across your organizations.</p>
        </div>
      </div>

      <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Bell className="h-8 w-8 text-white/40" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">You're all caught up!</h2>
        <p className="text-sm text-white/40 max-w-md">You don't have any new notifications right now. When you get invited to an organization or assigned a task, it will appear here.</p>
      </div>
    </div>
  )
}
