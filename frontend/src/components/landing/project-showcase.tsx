"use client"

import { motion } from "framer-motion"
import { Calendar, Users, Target, CheckCircle2 } from "lucide-react"

export function ProjectShowcase() {
  return (
    <section className="py-24" id="product">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Every project.<br/>One clear view.
            </h2>
            <p className="text-lg text-muted-foreground">
              Keep goals, timelines, team members, and tasks connected in one shared workspace. Stop digging through emails and spreadsheets.
            </p>
            
            <ul className="space-y-4 pt-4">
              {[
                { icon: Target, text: "Set clear objectives and track progress" },
                { icon: Users, text: "Assign dedicated project teams" },
                { icon: Calendar, text: "Monitor start dates and strict deadlines" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <item.icon className="w-4 h-4" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-xl" />
            <div className="relative rounded-xl border border-border/50 bg-card p-6 shadow-xl">
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold">Platform Migration</h3>
                  <p className="text-sm text-muted-foreground mt-1">Modernizing our core infrastructure</p>
                </div>
                <div className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold">
                  High Priority
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    In Progress
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Due Date</div>
                  <div className="text-sm font-medium">Oct 24, 2026</div>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span className="text-muted-foreground">64%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[64%]" />
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-3">Recent Tasks</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="line-through text-muted-foreground">Setup Postgres Database</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="font-medium">Migrate legacy user data</span>
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
