"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, CheckSquare, User, LogOut, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/auth.store"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getDashboardLink = () => {
    if (user?.role?.name === 'Super Admin') return '/admin/dashboard'
    if (user?.role?.name === 'Organization Admin') return '/organization/dashboard'
    return '/dashboard'
  }

  return (
    <div className="sticky top-0 z-50 w-full pt-4 px-4 md:px-6 flex justify-center pointer-events-none">
      <header
        className={cn(
          "pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-lg border",
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-border shadow-lg"
            : "bg-background/50 backdrop-blur-sm border-border shadow-sm"
        )}
      >
        <div className="px-4 md:px-6">
          <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <CheckSquare className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline-block">FlowTask</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#product" className="text-muted-foreground hover:text-foreground transition-colors">
              Product
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#solutions" className="text-muted-foreground hover:text-foreground transition-colors">
              Solutions
            </Link>
            <Link href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">
              Resources
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3 relative">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm h-9">Login</Button>
                </Link>
                <Link href="/organization/register">
                  <Button className="text-sm h-9">Create your organization</Button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <User className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg overflow-hidden flex flex-col py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium truncate">{user?.name || user?.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.role?.name}</p>
                      </div>
                      <Link 
                        href={getDashboardLink()} 
                        className="px-4 py-2 text-sm hover:bg-muted flex items-center transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center w-full text-left transition-colors"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="md:hidden border-t border-border bg-background rounded-b-lg overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <Link href="#product" className="text-sm font-medium py-2 border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Product</Link>
              <Link href="#features" className="text-sm font-medium py-2 border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#solutions" className="text-sm font-medium py-2 border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
              <Link href="#resources" className="text-sm font-medium py-2 border-b border-border/50" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
              
              <div className="flex flex-col gap-2 mt-2">
                {!isAuthenticated ? (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/organization/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Create your organization</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </div>
  )
}
