import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { PassportSection } from "@/components/passport-section";

export default function Home() {
  return (
    <div className="bg-aurora relative flex min-h-screen flex-col overflow-x-hidden">
      <SiteNav />
      <main className="flex-1">
        <div id="destinos">
          <Hero />
        </div>
        <PassportSection />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Aleca Travel. El mundo es tuyo.</p>
          <p>Diseñado para exploradores VIP.</p>
        </div>
      </footer>
    </div>
  );
}
