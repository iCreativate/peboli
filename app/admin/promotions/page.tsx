'use client';

import { PromotionSettings } from '@/components/admin/settings/PromotionSettings';

export default function AdminPromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Promotion Settings</h2>
        <p className="text-sm text-gray-500">Manage your store promotions.</p>
      </div>
      <PromotionSettings />
    </div>
  );
}
