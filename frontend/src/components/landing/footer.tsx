import Link from "next/link"
import { CheckSquare } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 mb-4">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <CheckSquare className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">FlowTask</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The modern workspace for teams to plan, manage, and collaborate on projects of any size.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Projects</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Tasks</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">API</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 text-sm text-muted-foreground gap-4">
          <div>
            © 2026 FlowTask. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
