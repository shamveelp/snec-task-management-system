"use client"

import { motion } from "framer-motion"
import { TrendingUp, Activity, BarChart2 } from "lucide-react"

export function AnalyticsShowcase() {
  return (
    <section className="py-24">
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
              See progress.<br/>Spot problems early.
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful analytics give you a bird's-eye view of your organization's health. Monitor team performance, track bottlenecks, and ensure deadlines are met.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-sm">Productivity Trend</h3>
              </div>
              <div className="h-24 flex items-end gap-2 pt-4">
                {[30, 45, 25, 60, 75, 50, 85].map((height, i) => (
                  <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm hover:bg-indigo-500/40 transition-colors" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-sm">Task Completion</h3>
              </div>
              <div className="text-3xl font-bold">84%</div>
              <div className="text-xs text-muted-foreground mt-1">+12% from last week</div>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-5 h-5 text-rose-500" />
                <h3 className="font-semibold text-sm">Overdue Tasks</h3>
              </div>
              <div className="text-3xl font-bold text-rose-500">12</div>
              <div className="text-xs text-muted-foreground mt-1">Needs attention</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
