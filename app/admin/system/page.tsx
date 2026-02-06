'use client';

import { SystemSettings } from '@/components/admin/settings/SystemSettings';

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h2>
        <p className="text-sm text-gray-500">Manage system configurations and maintenance.</p>
      </div>
      <SystemSettings />
    </div>
  );
}
