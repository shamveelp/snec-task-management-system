"use client"

import { motion } from "framer-motion"

export function KanbanShowcase() {
  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            From backlog to done.
          </h2>
          <p className="text-lg text-muted-foreground">
            Visualize your workflow. Drag and drop tasks through custom stages and always know what needs attention next.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Kanban Board Mockup */}
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
            
            {/* Column 1 */}
            <div className="w-72 shrink-0 bg-background/50 border border-border/50 rounded-xl p-3 snap-center">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="font-semibold text-sm">Backlog</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">2</span>
              </div>
              <div className="space-y-3">
                <div className="bg-card border border-border/50 p-3 rounded-lg shadow-sm">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-rose-500/10 text-rose-600 rounded">Backend</span>
                  </div>
                  <h4 className="text-sm font-medium mb-3">Optimize database queries</h4>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Oct 28</span>
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[9px]">S</div>
                  </div>
                </div>
                <div className="bg-card border border-border/50 p-3 rounded-lg shadow-sm">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-600 rounded">Docs</span>
                  </div>
                  <h4 className="text-sm font-medium mb-3">Write API documentation</h4>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Nov 2</span>
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[9px]">M</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="w-72 shrink-0 bg-background/50 border border-border/50 rounded-xl p-3 snap-center">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="font-semibold text-sm">To Do</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">1</span>
              </div>
              <div className="space-y-3">
                <div className="bg-card border border-border/50 p-3 rounded-lg shadow-sm">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-500/10 text-indigo-600 rounded">Feature</span>
                  </div>
                  <h4 className="text-sm font-medium mb-3">Create notification service</h4>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Oct 25</span>
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[9px]">J</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="w-72 shrink-0 bg-background/50 border border-border/50 rounded-xl p-3 snap-center">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="font-semibold text-sm">In Progress</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">1</span>
              </div>
              <div className="space-y-3">
                <div className="bg-card border-primary border-2 p-3 rounded-lg shadow-md -translate-y-1 rotate-1 cursor-grabbing transition-transform">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-500/10 text-indigo-600 rounded">Feature</span>
                  </div>
                  <h4 className="text-sm font-medium mb-3">Build dashboard API</h4>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="text-amber-500 font-medium">Tomorrow</span>
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[9px]">S</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4 */}
            <div className="w-72 shrink-0 bg-background/50 border border-border/50 rounded-xl p-3 snap-center">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="font-semibold text-sm">Review</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">1</span>
              </div>
              <div className="space-y-3">
                <div className="bg-card border border-border/50 p-3 rounded-lg shadow-sm">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-purple-500/10 text-purple-600 rounded">Security</span>
                  </div>
                  <h4 className="text-sm font-medium mb-3">Implement authentication</h4>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Oct 22</span>
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center font-bold text-[9px]">A</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
