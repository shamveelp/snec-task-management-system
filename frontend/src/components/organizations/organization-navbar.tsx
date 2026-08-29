"use client"

import * as React from "react"
import { useAuthStore } from "../../store/auth.store"
import { Bell, Search, Menu, LogOut, User } from "lucide-react"
import { Button } from "../ui/button"

export function OrganizationNavbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="h-16 flex-shrink-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden sm:flex max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search projects, members..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border-transparent focus:bg-white dark:focus:bg-gray-900 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </Button>
        
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

        <div className="flex items-center gap-3 pl-1 group cursor-pointer">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium leading-none mb-1 text-gray-900 dark:text-gray-100">
              {user?.name || user?.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Organization Admin
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
            <User className="h-4 w-4" />
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => logout()} className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
