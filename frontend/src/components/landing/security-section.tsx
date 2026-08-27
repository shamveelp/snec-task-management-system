"use client"

import { motion } from "framer-motion"
import { Lock, Server, FileText, ArrowDown } from "lucide-react"

export function SecuritySection() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built with security at the core.
          </h2>
          <p className="text-lg text-muted-foreground">
            Your data is your business. We provide enterprise-grade security features to ensure it stays that way.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative">
            
            {/* Flow line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-border/50 -z-10" />

            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1 bg-background p-6 rounded-2xl border border-border/50 shadow-sm relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-center mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground text-center">
                Secure JWT sessions, password hashing, and rate limiting.
              </p>
            </div>

            <ArrowDown className="w-6 h-6 text-muted-foreground md:hidden" />

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1 bg-background p-6 rounded-2xl border border-border/50 shadow-sm relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center mb-4 shadow-md">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-center mb-2">Protected Workspace</h3>
              <p className="text-sm text-muted-foreground text-center">
                Strict input validation and role-based resource access.
              </p>
            </div>

            <ArrowDown className="w-6 h-6 text-muted-foreground md:hidden" />

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1 bg-background p-6 rounded-2xl border border-border/50 shadow-sm relative z-10 w-full md:w-auto">
              <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center mb-4 shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-center mb-2">Audit Trail</h3>
              <p className="text-sm text-muted-foreground text-center">
                Comprehensive logging of all critical system actions.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
