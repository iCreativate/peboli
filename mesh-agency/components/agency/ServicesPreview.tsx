'use client';

import { motion } from 'framer-motion';

const services = [
  {
    title: 'Custom AI agents',
    body: 'Purpose-built agents that research, draft, qualify, and act inside your existing tools — trained on how your business actually works.',
  },
  {
    title: 'Workflow automation',
    body: 'End-to-end pipelines across CRM, support, finance, and ops. Fewer handoffs. Fewer dropped balls. Faster cycle times.',
  },
  {
    title: 'Systems integration',
    body: 'We connect the stack you already pay for — Slack, HubSpot, Notion, Stripe, email, sheets — into one coherent operating system.',
  },
];

export function ServicesPreview() {
  return (
    <section className="bg-mesh-paper px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl font-bold tracking-tight text-mesh-ink sm:text-5xl">
            What we build
          </h2>
          <p className="mt-4 max-w-xl text-lg text-mesh-muted">
            Three levers. One outcome: more output from the same team.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-mesh-accent">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-mesh-ink">
                {service.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-mesh-muted">{service.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
