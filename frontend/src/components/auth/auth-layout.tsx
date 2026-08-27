"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { CheckSquare } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      
      {/* Left side - Branding Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 text-white flex-col relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        
        {/* Radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]" />

        <div className="relative z-10 p-12 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 w-fit">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <CheckSquare className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">FlowTask</span>
          </Link>

          <div className="mt-auto mb-auto max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Your team's work, organized.
            </h1>
            <p className="text-xl text-zinc-400">
              Plan projects, manage tasks, and collaborate from one powerful workspace.
            </p>
          </div>

          <div className="mt-auto">
            {/* Miniature decorative abstract UI */}
            <div className="w-full max-w-md h-40 border-t border-l border-zinc-800/50 rounded-tl-xl bg-zinc-900/50 backdrop-blur-sm p-4 translate-y-12 translate-x-12 opacity-80 flex flex-col gap-3">
              <div className="w-1/3 h-4 bg-zinc-800 rounded animate-pulse" />
              <div className="w-full h-12 bg-zinc-800/50 rounded flex items-center px-4 gap-3">
                 <div className="w-4 h-4 rounded-full border border-zinc-600" />
                 <div className="w-1/2 h-2 bg-zinc-700 rounded" />
              </div>
              <div className="w-full h-12 bg-zinc-800/50 rounded flex items-center px-4 gap-3">
                 <div className="w-4 h-4 rounded-full border border-zinc-600" />
                 <div className="w-2/3 h-2 bg-zinc-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form Area */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        {/* Mobile Header */}
        <div className="lg:hidden flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <CheckSquare className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">FlowTask</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[400px]">
          {children}
        </div>
      </div>
      
    </div>
  )
}
