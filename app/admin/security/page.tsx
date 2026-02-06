'use client';

import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Security Settings</h2>
        <p className="text-sm text-gray-500">Manage security settings and access controls.</p>
      </div>
      <SecuritySettings />
    </div>
  );
}
