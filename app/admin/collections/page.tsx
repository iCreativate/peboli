'use client';

import { CollectionSettings } from '@/components/admin/settings/CollectionSettings';

export default function AdminCollectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Collection Settings</h2>
        <p className="text-sm text-gray-500">Manage your product collections.</p>
      </div>
      <CollectionSettings />
    </div>
  );
}
