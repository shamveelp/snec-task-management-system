"use client"

import * as React from "react"
import { useAuthStore } from "../../store/auth.store"
import { Bell, Search, Settings, HelpCircle, ChevronDown, LogOut, User, Building } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function OrganizationNavbar() {
  const { user, logout } = useAuthStore()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const router = useRouter()
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="h-24 flex-shrink-0 bg-transparent flex items-center justify-between px-10 z-10 w-full pt-6 pb-2">
      <div className="flex items-center gap-4 flex-1">
        <div className="max-w-md w-full relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8F96AE]" />
          <input 
            type="text"
            placeholder="Search projects, tasks, or users..." 
            className="w-full pl-14 pr-4 py-3.5 bg-[#F4F6F9] border-transparent rounded-full text-sm font-medium text-gray-700 placeholder:text-[#8F96AE] outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          className="text-[#8F96AE] hover:text-gray-700 transition-colors"
          title="Help & Documentation"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
        <Link href="/organization/settings" className="text-[#8F96AE] hover:text-gray-700 transition-colors">
          <Settings className="h-6 w-6" />
        </Link>
        <Link href="/organization/notifications" className="relative text-[#8F96AE] hover:text-gray-700 transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-0.5 right-0.5 h-2.5 w-2.5 bg-[#FF6B6B] rounded-full border-2 border-white"></span>
        </Link>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 pl-4 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="h-10 w-10 rounded-full bg-indigo-100 overflow-hidden relative border border-gray-200">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-500 font-bold">
                  {user?.name?.charAt(0) || 'J'}
                </div>
              )}
            </div>
            <span className="text-[15px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="h-4 w-4 text-[#8F96AE] group-hover:text-gray-700 transition-colors" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link 
                  href="/organization/settings" 
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Building className="h-4 w-4 text-gray-400" />
                  Organization Settings
                </Link>
                <Link 
                  href="/organization/settings" 
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="h-4 w-4 text-gray-400" />
                  My Profile
                </Link>
              </div>
              <div className="p-2 border-t border-gray-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
