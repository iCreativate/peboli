'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden text-white">
      <HeroVisual />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 lg:justify-center lg:px-10 lg:pb-24 lg:pt-32">
        <motion.p
          className="font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          MESH
        </motion.p>
        <motion.h1
          className="mt-4 max-w-2xl text-2xl font-medium leading-tight text-white/90 sm:text-3xl lg:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          AI systems that run your operations while your team sleeps.
        </motion.h1>
        <motion.p
          className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          We design custom agents, workflow automation, and integrations for teams who want leverage — not more software tabs.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <Link
            href="/contact"
            className="rounded-sm bg-mesh-signal px-6 py-3.5 text-sm font-semibold text-mesh-ink transition-transform hover:scale-[1.03]"
          >
            Start a project
          </Link>
          <Link
            href="/work"
            className="rounded-sm border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
          >
            See our work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
