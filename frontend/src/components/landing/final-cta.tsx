"use client"

import { motion } from "framer-motion"
import { Button } from "../ui/button"
import Link from "next/link"

export function FinalCta() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary -z-20" />
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-6">
            Bring your team's work into focus.
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Plan better. Collaborate faster. Deliver with confidence. Join thousands of teams already using FlowTask.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-background text-foreground hover:bg-background/90 text-base">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
