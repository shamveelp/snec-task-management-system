"use client"

import { motion } from "framer-motion"
import { Shield, Key, Check } from "lucide-react"

export function RolesShowcase() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everyone gets the access they need.
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade role-based access control (RBAC). Secure your workspace with granular permissions for every team member.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          
          {/* Roles List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 flex flex-col gap-2"
          >
            {[
              { name: "Super Admin", icon: Shield, color: "text-rose-500", bg: "bg-rose-500/10" },
              { name: "Admin", icon: Key, color: "text-amber-500", bg: "bg-amber-500/10" },
              { name: "Project Manager", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-500/10", active: true },
              { name: "Team Lead", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
              { name: "Developer", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((role, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 p-4 rounded-xl border ${role.active ? 'border-primary bg-background shadow-sm' : 'border-border/50 bg-card/50 opacity-70'} transition-all`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.bg} ${role.color}`}>
                  <role.icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium ${role.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {role.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Permissions Matrix Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-border/50">
              <h3 className="font-semibold">Project Manager Permissions</h3>
              <p className="text-sm text-muted-foreground mt-1">Manage what this role can view, create, and edit.</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Project Access</h4>
                  <div className="space-y-2">
                    {["Create projects", "Edit project details", "Manage project members"].map((perm, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <span className="text-sm">{perm}</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Task Access</h4>
                  <div className="space-y-2">
                    {["Create tasks", "Assign tasks", "Delete tasks"].map((perm, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <span className="text-sm">{perm}</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
