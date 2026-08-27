"use client"

import { motion } from "framer-motion"
import { Button } from "../ui/button"
import Link from "next/link"
import { HeroProductPreview } from "@/components/landing/hero-product-preview"

export function Hero() {
  return (
    <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl hero-gradient -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight"
          >
            Turn scattered work into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
              organized progress.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            Plan projects, manage tasks, collaborate with your team, and understand progress — all from one powerful workspace.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
                Get Started
              </Button>
            </Link>
            <Link href="#preview">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 px-8 bg-background/50 backdrop-blur-sm">
                View Demo
              </Button>
            </Link>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm text-muted-foreground mt-4"
          >
            No credit card required • Built for modern teams
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 md:mt-24 relative max-w-5xl mx-auto"
          id="preview"
        >
          <HeroProductPreview />
        </motion.div>
      </div>
    </section>
  )
}
