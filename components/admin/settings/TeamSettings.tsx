'use client';

import Link from 'next/link';
import { Shield, Users } from 'lucide-react';

export function TeamSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Team & Roles</h2>
        <p className="mt-1 text-sm text-gray-500">
          This section is reserved for Peboli Team access control and role management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-black text-[#1A1D29]">Admins</div>
              <div className="mt-2 text-sm text-[#8B95A5]">Add/remove Peboli Team members (planned).</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0B1220]">
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
