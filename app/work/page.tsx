import type { Metadata } from 'next';
import { AgencyNav } from '@/components/agency/AgencyNav';
import { AgencyFooter } from '@/components/agency/AgencyFooter';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected AI automation outcomes from MESH engagements.',
};

const projects = [
  {
    sector: 'B2B SaaS',
    title: 'Overnight lead qualification',
    summary:
      'Inbound demos were sitting for hours. We built an agent that enriches, scores, and books meetings before the sales team clocks in.',
    result: '68% faster lead-to-meeting',
  },
  {
    sector: 'E-commerce',
    title: 'Support triage without the queue',
    summary:
      'A multi-brand retailer was drowning in repetitive tickets. MESH classified intent, drafted replies, and routed only edge cases to humans.',
    result: '41% fewer tickets to humans',
  },
  {
    sector: 'Professional services',
    title: 'Proposals from discovery notes',
    summary:
      'Consultants spent evenings rewriting the same scope language. An agent now drafts proposals from call transcripts and past wins.',
    result: '12 hours saved per week',
  },
  {
    sector: 'Fintech',
    title: 'KYC follow-up that never forgets',
    summary:
      'Incomplete applications stalled growth. Automated, personalized nudges closed the loop while compliance stayed in control.',
    result: '23% lift in completed applications',
  },
];

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-mesh-paper">
      <AgencyNav />
      <main className="pt-28">
        <section className="px-6 pb-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mesh-accent">Work</p>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-mesh-ink sm:text-6xl">
              MESH
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-mesh-muted">
              Selected systems we’ve shipped for operators who needed leverage, not another pilot.
            </p>
          </div>
        </section>

        <section className="border-t border-mesh-line px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-7xl divide-y divide-mesh-line">
            {projects.map((project) => (
              <article key={project.title} className="grid gap-4 py-12 lg:grid-cols-[160px_1fr_220px] lg:gap-10">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-mesh-accent">{project.sector}</p>
                <div>
                  <h2 className="font-display text-2xl font-bold text-mesh-ink sm:text-3xl">{project.title}</h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-mesh-muted">{project.summary}</p>
                </div>
                <p className="font-display text-xl font-bold text-mesh-ink lg:text-right">{project.result}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-mesh-ink px-6 py-20 text-white lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Want results like these?</h2>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-sm bg-mesh-signal px-6 py-3.5 text-sm font-semibold text-mesh-ink"
            >
              Start a project
            </Link>
          </div>
        </section>
      </main>
      <AgencyFooter />
    </div>
  );
}
