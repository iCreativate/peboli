import type { Metadata } from 'next';
import Link from 'next/link';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { AiResellerStudio } from '@/components/ai-reseller/AiResellerStudio';

export const metadata: Metadata = {
  title: 'AI Reseller Studio | Peboli Local Shelf',
  description:
    'Generate Local Shelf product marketing, price at 30–40% markup, and resell AI marketing packages to nearby shops.',
};

export default function AiResellerPage() {
  return (
    <div className="min-h-screen bg-white">
      <TakealotHeader />
      <main>
        <AiResellerStudio />
        <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-[#8B95A5]">
            Optional: set <code className="rounded bg-[#F7F8FA] px-1">OPENAI_API_KEY</code> for
            LLM-backed copy. Without it, the built-in Peboli engine still generates full packs.{' '}
            <Link href="/sell" className="font-medium text-[#FF6B4A] hover:underline">
              Sell on Peboli
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
