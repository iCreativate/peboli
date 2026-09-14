import { AgencyNav } from '@/components/agency/AgencyNav';
import { AgencyFooter } from '@/components/agency/AgencyFooter';
import { Hero } from '@/components/agency/Hero';
import { ServicesPreview } from '@/components/agency/ServicesPreview';
import { Process } from '@/components/agency/Process';
import { WorkPreview } from '@/components/agency/WorkPreview';
import { FinalCta } from '@/components/agency/FinalCta';

export default function Home() {
  return (
    <div className="min-h-screen bg-mesh-paper">
      <AgencyNav variant="onDark" />
      <main>
        <Hero />
        <ServicesPreview />
        <Process />
        <WorkPreview />
        <FinalCta />
      </main>
      <AgencyFooter />
    </div>
  );
}
