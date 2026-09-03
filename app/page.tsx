import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav"; // Adjust path if needed

export default function Home() {
  return (
    <div className="bg-aurora relative flex min-h-screen flex-col overflow-x-hidden">
      <SiteNav />
      
      <main className="flex-1">
        <div id="destinos">
          <Hero />
        </div>
      </main>

      <footer className="border-t border-border mb-16 md:mb-0">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Aleca Travel. El mundo es tuyo.</p>
          <p>Diseñado para exploradores VIP.</p>
        </div>
      </footer>

      {/* Mobile Nav placed at the page level as requested */}
      <MobileBottomNav />
    </div>
  );
}