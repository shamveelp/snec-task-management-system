"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { CheckSquare, Building2, ShieldCheck, Zap } from "lucide-react"
import { PublicRoute } from "./public-route"

export function OrgAuthLayout({ children }: { children: ReactNode }) {
  return (
    <PublicRoute>
      <div className="min-h-screen flex w-full bg-background">
        {/* Left Panel - Corporate Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-slate-50 flex-col relative overflow-hidden">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
          
          <div className="relative z-10 p-12 flex flex-col h-full">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 w-fit">
              <div className="bg-blue-600 text-white p-1.5 rounded shadow-sm">
                <CheckSquare className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">FlowTask <span className="font-light">for Enterprise</span></span>
            </Link>

            <div className="mt-auto mb-auto max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                Scale your team's productivity securely.
              </h1>
              <p className="text-lg text-slate-400 mb-12">
                Join thousands of organizations using FlowTask to manage complex projects, allocate resources, and deliver on time.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <Building2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">Centralized Workspace</h3>
                    <p className="text-sm text-slate-500">Manage all your teams in one place.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <ShieldCheck className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">Enterprise Security</h3>
                    <p className="text-sm text-slate-500">Advanced permissions and data protection.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <Zap className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">High Performance</h3>
                    <p className="text-sm text-slate-500">Built for speed at scale.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-zinc-950">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1 rounded-md">
                <CheckSquare className="h-6 w-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">FlowTask</span>
            </Link>
          </div>
          <div className="mx-auto w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </PublicRoute>
  )
}
