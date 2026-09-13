import type { Metadata } from 'next';
import { AgencyNav } from '@/components/agency/AgencyNav';
import { AgencyFooter } from '@/components/agency/AgencyFooter';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services | MESH',
  description: 'Custom AI agents, workflow automation, and systems integration from MESH.',
};

const services = [
  {
    title: 'Custom AI agents',
    body: 'Agents that research accounts, draft outreach, summarize meetings, update CRM fields, and escalate only when judgment is required. Built around your playbooks — not generic prompts.',
    outcomes: ['Faster response cycles', 'Consistent quality at scale', 'Clear human-in-the-loop gates'],
  },
  {
    title: 'Workflow automation',
    body: 'We wire multi-step processes that used to live in someone’s head: onboarding sequences, approval chains, renewal reminders, inventory alerts, and weekly reporting packs.',
    outcomes: ['Fewer missed steps', 'Lower operational cost', 'Audit-friendly logs'],
  },
  {
    title: 'Systems integration',
    body: 'Your tools should talk. We connect CRMs, helpdesks, finance apps, data warehouses, and internal APIs so information moves without copy-paste.',
    outcomes: ['Single source of truth', 'Less tool sprawl pain', 'Reliable event-driven sync'],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-mesh-paper">
      <AgencyNav />
      <main className="pt-28">
        <section className="px-6 pb-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mesh-accent">Services</p>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-mesh-ink sm:text-6xl">
              MESH
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-mesh-muted">
              Automation designed for how your company actually operates — not a catalog of chatbot templates.
            </p>
          </div>
        </section>

        <section className="border-t border-mesh-line px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-7xl space-y-20">
            {services.map((service, i) => (
              <article key={service.title} className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-mesh-accent">0{i + 1}</p>
                  <h2 className="mt-3 font-display text-3xl font-bold text-mesh-ink">{service.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-mesh-muted">{service.body}</p>
                </div>
                <ul className="space-y-4 self-center border-l-2 border-mesh-signal pl-6">
                  {service.outcomes.map((outcome) => (
                    <li key={outcome} className="text-base font-medium text-mesh-ink">
                      {outcome}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-mesh-ink px-6 py-20 text-white lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display max-w-xl text-3xl font-bold sm:text-4xl">
              Not sure where to start? We’ll map it with you.
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit rounded-sm bg-mesh-signal px-6 py-3.5 text-sm font-semibold text-mesh-ink"
            >
              Book a call
            </Link>
          </div>
        </section>
      </main>
      <AgencyFooter />
    </div>
  );
}
