'use client';

import { CatalogSettings } from '@/components/admin/settings/CatalogSettings';

export default function AdminCatalogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Catalog Settings</h2>
        <p className="text-sm text-gray-500">Manage your product catalog settings.</p>
      </div>
      <CatalogSettings />
    </div>
  );
}
