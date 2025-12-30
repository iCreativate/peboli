import Link from 'next/link';
import { Shield, Users } from 'lucide-react';

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-bold text-[#8B95A5]">Team</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Team & roles</h2>
        <p className="mt-2 text-sm text-[#8B95A5]">
          This section is reserved for Peboli Team access control and role management (to be connected to real auth later).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-[#1A1D29]">Admins</div>
              <div className="mt-2 text-sm text-[#8B95A5]">Add/remove Peboli Team members (planned).</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 flex items-center justify-center text-[#0B1220]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-[#1A1D29]">Roles</div>
              <div className="mt-2 text-sm text-[#8B95A5]">Define permissions (planned).</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <div className="text-sm text-[#8B95A5]">
          Vendor tools remain separate under{' '}
          <Link href="/vendor/dashboard" className="font-semibold text-[#0B1220] hover:underline">
            /vendor/dashboard
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
