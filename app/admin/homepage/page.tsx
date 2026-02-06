'use client';

import { HomepageSettings } from '@/components/admin/settings/HomepageSettings';

export default function AdminHomepagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Homepage Settings</h2>
        <p className="text-sm text-gray-500">Manage your homepage hero section and other content.</p>
      </div>
      <HomepageSettings />
    </div>
  );
}
