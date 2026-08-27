import { AnnouncementBar } from "../components/landing/announcement-bar"
import { Navbar } from "../components/landing/navbar"
import { Hero } from "../components/landing/hero"
import { Features } from "../components/landing/features"
import { ProjectShowcase } from "../components/landing/project-showcase"
import { KanbanShowcase } from "../components/landing/kanban-showcase"
import { CollaborationShowcase } from "../components/landing/collaboration-showcase"
import { RolesShowcase } from "../components/landing/roles-showcase"
import { AnalyticsShowcase } from "../components/landing/analytics-showcase"
import { SecuritySection } from "../components/landing/security-section"
import { FinalCta } from "../components/landing/final-cta"
import { Footer } from "../components/landing/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Features />
        <ProjectShowcase />
        <KanbanShowcase />
        <CollaborationShowcase />
        <RolesShowcase />
        <AnalyticsShowcase />
        <SecuritySection />
        <FinalCta />
      </main>
      
      <Footer />
    </div>
  )
}
