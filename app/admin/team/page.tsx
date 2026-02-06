'use client';

import { TeamSettings } from '@/components/admin/settings/TeamSettings';

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Team Settings</h2>
        <p className="text-sm text-gray-500">Manage your team members and permissions.</p>
      </div>
      <TeamSettings />
    </div>
  );
}
