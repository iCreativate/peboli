'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Map the friction',
    body: 'We audit the processes eating your team’s hours — from lead response to invoice chase — and find where AI compounds.',
  },
  {
    title: 'Design the system',
    body: 'Agents, triggers, and human checkpoints. Clear ownership. Measurable outcomes before a single line of glue code.',
  },
  {
    title: 'Ship and stabilize',
    body: 'We build, integrate, train your team, and stay until the automation is quieter than the work it replaced.',
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden bg-mesh-ink px-6 py-24 text-mesh-paper lg:px-10 lg:py-32">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-mesh-signal/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">How engagement works</h2>
          <p className="mt-4 max-w-xl text-lg text-mesh-fog">
            A focused partnership — not a never-ending retainer of tickets.
          </p>
        </motion.div>

        <ol className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <span className="font-display text-5xl font-bold text-mesh-signal/90">{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mesh-fog">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
