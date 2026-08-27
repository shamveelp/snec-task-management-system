"use client"

import { motion } from "framer-motion"
import { FolderKanban, CheckSquare, Users, Shield, Bell, BarChart3 } from "lucide-react"

export function Features() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <section className="py-24 bg-muted/30" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything your team needs to move work forward.
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed to remove friction from your workflow and keep everyone aligned.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {/* Bento Box 1 - Large */}
          <motion.div variants={item} className="md:col-span-2 rounded-2xl bg-card border border-border/50 p-8 shadow-sm flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Project Management</h3>
              <p className="text-muted-foreground max-w-md">
                Organize work into shared projects. Set goals, timelines, and keep the big picture in view while managing the details.
              </p>
            </div>
            
            <div className="mt-8 rounded-xl border border-border/50 bg-background p-4 shadow-sm relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex justify-between items-center mb-4">
                <div className="font-medium text-sm">Website Redesign</div>
                <div className="text-xs text-muted-foreground">78% Complete</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Bento Box 2 */}
          <motion.div variants={item} className="rounded-2xl bg-card border border-border/50 p-8 shadow-sm relative group overflow-hidden">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Task Management</h3>
            <p className="text-muted-foreground text-sm">
              Break down projects into actionable tasks with assignees, due dates, and custom priorities.
            </p>
          </motion.div>

          {/* Bento Box 3 */}
          <motion.div variants={item} className="rounded-2xl bg-card border border-border/50 p-8 shadow-sm">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
            <p className="text-muted-foreground text-sm">
              Keep conversations in context with in-task commenting, @mentions, and real-time updates.
            </p>
          </motion.div>

          {/* Bento Box 4 - Large */}
          <motion.div variants={item} className="md:col-span-2 rounded-2xl bg-card border border-border/50 p-8 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row gap-8 h-full">
              <div className="flex-1">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Role-Based Access</h3>
                <p className="text-muted-foreground">
                  Control who sees and edits what with enterprise-grade granular permissions and configurable roles.
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background text-sm">
                  <span>Project Manager</span>
                  <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-600 flex items-center justify-center">✓</div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background text-sm">
                  <span>Developer</span>
                  <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-600 flex items-center justify-center">✓</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Box 5 */}
          <motion.div variants={item} className="rounded-2xl bg-card border border-border/50 p-8 shadow-sm">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Reports</h3>
            <p className="text-muted-foreground text-sm">
              Visualize progress, spot bottlenecks, and export data with built-in analytics.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
