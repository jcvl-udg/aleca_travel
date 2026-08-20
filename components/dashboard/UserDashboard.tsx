"use client";

import { motion, type Variants } from "framer-motion";
import { Plane, Map, Users, Award, ShieldCheck, ChevronRight, Compass } from "lucide-react";
import type { UserSession } from "@/lib/mock-db";

type Props = {
  user: UserSession;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" // TS now knows this is a valid Easing literal, not a generic string
    } 
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function UserDashboard({ user }: Props) {
  return (
    <section className="relative min-h-screen w-full bg-background pt-24 pb-12 px-4 lg:px-12">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-6xl space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
            {user.role === "CLIENT" ? (
              <><Award className="h-4 w-4" /> Miembro VIP</>
            ) : (
              <><ShieldCheck className="h-4 w-4" /> Portal de Asesor</>
            )}
          </div>
          <h1 className="font-serif text-4xl tracking-tight text-white sm:text-5xl">
            Bienvenido, {user.name.split(" ")[0]}
          </h1>
        </motion.div>

        {/* Dynamic Role Views */}
        {user.role === "CLIENT" ? <ClientView user={user} /> : <AgentView user={user} />}
      </motion.div>
    </section>
  );
}

function ClientView({ user }: { user: UserSession }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Gamification Card */}
      <motion.div variants={itemVariants} className="glass-strong col-span-1 rounded-3xl p-6 md:col-span-2">
        <h2 className="mb-4 text-xl font-medium text-white">Tu Pasaporte Aleca</h2>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-4xl font-serif text-gold glow-gold">{user.points.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Puntos acumulados</p>
          </div>
          <div className="flex gap-2">
            {user.passportStamps.map((stamp, idx) => (
              <div key={idx} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25 text-primary">
                <Compass className="h-6 w-6" />
              </div>
            ))}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/20 border border-dashed border-muted-foreground/50 text-muted-foreground">
              <span className="text-xs">+1</span>
            </div>
          </div>
        </div>
        <button className="mt-6 w-full rounded-2xl bg-primary/10 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto sm:px-6">
          Ver Beneficios del Club
        </button>
      </motion.div>

      {/* Next Trip Card */}
      <motion.div variants={itemVariants} className="glass group relative col-span-1 overflow-hidden rounded-3xl p-6 hover:border-primary/50 transition-colors">
        <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <Plane className="mb-4 h-8 w-8 text-primary" />
        <h3 className="text-lg font-medium text-white">Tu Próximo Destino</h3>
        <p className="mt-2 text-sm text-muted-foreground">Explora el globo y diseña tu itinerario a medida con un asesor dedicado.</p>
        <div className="mt-4 flex items-center text-sm font-medium text-primary">
          Ir al Globo <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
    </div>
  );
}

function AgentView({ user }: { user: UserSession }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* CRM Quick Stats */}
      <motion.div variants={itemVariants} className="glass-strong rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-white">Pipeline Activo</h2>
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-3xl font-serif text-white">12</p>
            <p className="text-xs text-muted-foreground mt-1">Cotizaciones Pendientes</p>
          </div>
          <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4">
            <p className="text-3xl font-serif text-primary">3</p>
            <p className="text-xs text-primary/80 mt-1">Cierres VIP Hoy</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="glass rounded-3xl p-6">
        <h2 className="text-xl font-medium text-white mb-4">Acciones Rápidas</h2>
        <div className="space-y-3">
          <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10">
            <span className="flex items-center gap-3"><Map className="h-4 w-4 text-primary" /> Crear Nuevo Itinerario</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-zinc-200 transition-colors hover:bg-white/10">
            <span className="flex items-center gap-3"><Award className="h-4 w-4 text-gold" /> Aprobar Sellos VIP</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}