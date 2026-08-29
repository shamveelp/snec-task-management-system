"use client"

import * as React from "react"
import { User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex-1 overflow-y-auto stylish-scrollbar-dark p-8 h-full bg-[#131417]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white/90">Profile</h1>
          <p className="text-white/40 mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="bg-[#1C1E24] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <User className="h-8 w-8 text-white/40" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Profile Settings Coming Soon</h2>
        <p className="text-sm text-white/40 max-w-md">We are currently building this page. Soon you'll be able to manage your details, security settings, and connected accounts right here.</p>
      </div>
    </div>
  )
}
