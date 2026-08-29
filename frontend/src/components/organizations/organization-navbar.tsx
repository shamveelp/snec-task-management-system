"use client"

import * as React from "react"
import { useAuthStore } from "../../store/auth.store"
import { Bell, Search, Settings, HelpCircle, ChevronDown } from "lucide-react"

export function OrganizationNavbar() {
  const { user } = useAuthStore()

  return (
    <header className="h-24 flex-shrink-0 bg-transparent flex items-center justify-between px-10 z-10 w-full pt-6 pb-2">
      <div className="flex items-center gap-4 flex-1">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8F96AE]" />
          <input 
            type="text"
            placeholder="Search" 
            className="w-full pl-14 pr-4 py-3.5 bg-[#F4F6F9] border-transparent rounded-full text-sm font-medium text-gray-700 placeholder:text-[#8F96AE] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-[#8F96AE] hover:text-gray-700 transition-colors">
          <HelpCircle className="h-6 w-6" />
        </button>
        <button className="text-[#8F96AE] hover:text-gray-700 transition-colors">
          <Settings className="h-6 w-6" />
        </button>
        <button className="relative text-[#8F96AE] hover:text-gray-700 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-0.5 right-0.5 h-2.5 w-2.5 bg-[#FF6B6B] rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-indigo-100 overflow-hidden relative border border-gray-200">
            {/* Hardcoded Avatar matching the mockup */}
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80" 
              alt="Profile" 
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-[15px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            {user?.name?.split(' ')[0] || 'Jannie'}
          </span>
          <ChevronDown className="h-4 w-4 text-[#8F96AE] group-hover:text-gray-700 transition-colors" />
        </div>
      </div>
    </header>
  )
}
