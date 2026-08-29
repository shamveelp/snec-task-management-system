"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Building2, Settings, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const MAIN_NAV = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/dashboard/users', icon: Users },
  { name: 'Organization Management', href: '/admin/dashboard/organizations', icon: Building2 },
  { name: 'System Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="w-64 bg-[#111111] border-r border-white/5 flex flex-col h-screen overflow-y-auto text-gray-300">
      {/* Header */}
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#7C68EE] flex items-center justify-center">
            <span className="text-white font-bold text-sm">SN</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">SNEC Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-1 mt-6">
        {MAIN_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                  isActive ? "bg-[#7C68EE]/10 text-white font-medium" : "hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-[#7C68EE]" : "text-gray-400")} />
                <span className="text-[14px]">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-4 mt-auto space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer hover:text-white hover:bg-white/5">
          <HelpCircle className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-[14px]">Help & Documentation</span>
        </div>
        
        {/* User Profile */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#7C68EE] to-[#4c3ab8] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email || 'admin@snec.com'}</div>
            </div>
            <button onClick={() => logout()} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
