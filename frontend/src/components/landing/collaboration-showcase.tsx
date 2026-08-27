"use client"

import { motion } from "framer-motion"
import { MessageSquare, Paperclip, Send } from "lucide-react"

export function CollaborationShowcase() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-2xl blur-xl" />
            <div className="relative rounded-xl border border-border/50 bg-card shadow-xl overflow-hidden flex flex-col h-[400px]">
              
              <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-sm">Comments (3)</span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-6">
                
                {/* Comment 1 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
                    S
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">Sarah Jenkins</span>
                      <span className="text-[10px] text-muted-foreground">9:41 AM</span>
                    </div>
                    <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-lg rounded-tl-none">
                      Can we get the dashboard API ready today?
                    </p>
                  </div>
                </div>

                {/* Comment 2 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                    J
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">John Doe</span>
                      <span className="text-[10px] text-muted-foreground">10:15 AM</span>
                    </div>
                    <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-lg rounded-tl-none">
                      Yes. The endpoints are complete. I'm finishing validation.
                    </p>
                  </div>
                </div>

                {/* Comment 3 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                    A
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">Alex Smith</span>
                      <span className="text-[10px] text-muted-foreground">Just now</span>
                    </div>
                    <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-lg rounded-tl-none">
                      <span className="text-primary font-medium bg-primary/10 px-1 rounded">@John</span> I've added the frontend integration.
                    </p>
                  </div>
                </div>

              </div>

              <div className="p-3 border-t border-border/50 bg-background">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="w-full bg-muted/50 border border-border/50 rounded-lg pl-3 pr-20 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-md">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 bg-primary text-primary-foreground rounded-md">
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pop-up notification mockup */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-4 right-4 bg-foreground text-background text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-medium border border-border"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                Sarah mentioned you in a comment.
              </motion.div>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Keep your team in sync.
            </h2>
            <p className="text-lg text-muted-foreground">
              Conversations live right next to the work. Tag teammates, share files, and resolve blockers instantly without context switching.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
