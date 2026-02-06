'use client';

import { ThemeSettings } from '@/components/admin/settings/ThemeSettings';

export default function AdminThemePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Theme Settings</h2>
        <p className="text-sm text-gray-500">Customize the look and feel of your store.</p>
      </div>
      <ThemeSettings />
    </div>
  );
}
