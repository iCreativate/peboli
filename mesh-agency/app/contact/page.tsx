import type { Metadata } from 'next';
import { AgencyNav } from '@/components/agency/AgencyNav';
import { AgencyFooter } from '@/components/agency/AgencyFooter';
import { ContactForm } from '@/components/agency/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Book a discovery call with MESH — AI automation agency.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-mesh-paper">
      <AgencyNav />
      <main className="pt-28">
        <section className="px-6 pb-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-mesh-accent">Contact</p>
              <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-mesh-ink sm:text-6xl">
                MESH
              </h1>
              <p className="mt-4 text-xl text-mesh-muted">
                Tell us what is eating your team’s time. We’ll reply with a clear path — or an honest no.
              </p>
              <div className="mt-10 space-y-4 text-sm text-mesh-muted">
                <p>
                  <span className="font-semibold text-mesh-ink">Email</span>
                  <br />
                  hello@mesh.agency
                </p>
                <p>
                  <span className="font-semibold text-mesh-ink">Typical kickoff</span>
                  <br />
                  2–3 weeks from signed scope to first live automation
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <AgencyFooter />
    </div>
  );
}
