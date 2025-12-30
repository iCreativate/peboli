import Link from 'next/link';
import { BadgeCheck, Sparkles, Tag } from 'lucide-react';

export default function AdminPromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-bold text-[#8B95A5]">Promotions</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Splash sales & campaigns</h2>
        <p className="mt-2 text-sm text-[#8B95A5]">
          Configure promotions and campaign hubs. This page is a scaffold for future scheduling/automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-[#1A1D29]">Splash sale rules</div>
              <div className="mt-2 text-sm text-[#8B95A5]">Define selection criteria (planned).</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-[#1A1D29]">Collections</div>
              <div className="mt-2 text-sm text-[#8B95A5]">Seasonal campaign content (existing pages).</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-[#1A1D29]">Featured placement</div>
              <div className="mt-2 text-sm text-[#8B95A5]">Homepage placements and prioritization (planned).</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <div className="text-sm text-[#8B95A5]">
          View the public deals hub at{' '}
          <Link href="/deals" className="font-semibold text-[#0B1220] hover:underline">
            /deals
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
