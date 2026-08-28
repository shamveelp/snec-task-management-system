"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { CheckSquare } from "lucide-react"
import { PublicRoute } from "./public-route"
import { motion } from "framer-motion"

export function UserAuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950/20" />
        
        {/* Floating Blurs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px]" 
        />

        <div className="relative z-10 w-full max-w-md p-4">
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                <CheckSquare className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">FlowTask</span>
            </Link>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl rounded-2xl p-6 sm:p-8"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </PublicRoute>
  )
}
