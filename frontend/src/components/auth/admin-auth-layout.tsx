"use client"

import { ReactNode } from "react"
import { ShieldAlert, Terminal } from "lucide-react"
import { PublicRoute } from "./public-route"
import { motion } from "framer-motion"

export function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-300 selection:bg-emerald-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0,rgba(0,0,0,1)_100%)]" />
        
        <div className="relative z-10 w-full max-w-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <Terminal className="h-4 w-4 text-zinc-500" />
              <span className="text-xs font-mono text-zinc-500 tracking-wider">SYSTEM_AUTH</span>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 animate-pulse" />
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-zinc-900 p-3 rounded-full border border-zinc-800">
                  <ShieldAlert className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-white tracking-tight">System Administrator</h1>
                <p className="text-xs text-zinc-500 mt-1 font-mono uppercase">Restricted Access Only</p>
              </div>
              
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </PublicRoute>
  )
}
