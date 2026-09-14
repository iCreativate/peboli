'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0a1620_0%,#132838_50%,#0d1f2a_100%)] px-6 py-24 text-white lg:px-10 lg:py-32">
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(184,240,0,0.2),transparent_65%)]"
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative mx-auto max-w-7xl">
        <motion.h2
          className="font-display max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to automate the work that slows you down?
        </motion.h2>
        <motion.p
          className="mt-5 max-w-lg text-lg text-white/65"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Tell us where the friction is. We’ll map a system you can ship in weeks — not quarters.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <Link
            href="/contact"
            className="mt-10 inline-flex rounded-sm bg-mesh-signal px-7 py-4 text-sm font-semibold text-mesh-ink transition-transform hover:scale-[1.03]"
          >
            Book a discovery call
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
