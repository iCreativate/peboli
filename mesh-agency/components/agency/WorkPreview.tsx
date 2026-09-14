'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const cases = [
  {
    sector: 'B2B SaaS',
    title: 'Sales ops that qualify overnight',
    result: '68% faster lead-to-meeting',
  },
  {
    sector: 'E-commerce',
    title: 'Support triage without the queue',
    result: '41% fewer tickets to humans',
  },
  {
    sector: 'Professional services',
    title: 'Proposal drafts from discovery notes',
    result: '12 hrs saved per week',
  },
];

export function WorkPreview() {
  return (
    <section className="bg-mesh-paper px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight text-mesh-ink sm:text-5xl">
              Selected outcomes
            </h2>
            <p className="mt-4 max-w-lg text-lg text-mesh-muted">
              Real operators. Measurable lift. No vanity dashboards.
            </p>
          </div>
          <Link
            href="/work"
            className="text-sm font-semibold text-mesh-ink underline decoration-mesh-signal decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
          >
            View all work
          </Link>
        </motion.div>

        <div className="mt-14 divide-y divide-mesh-line border-y border-mesh-line">
          {cases.map((item, i) => (
            <motion.div
              key={item.title}
              className="grid gap-3 py-8 md:grid-cols-[140px_1fr_auto] md:items-center md:gap-8"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-mesh-accent">{item.sector}</p>
              <h3 className="text-xl font-semibold text-mesh-ink md:text-2xl">{item.title}</h3>
              <p className="font-display text-lg font-bold text-mesh-ink md:text-right">{item.result}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
