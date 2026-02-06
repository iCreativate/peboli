'use client';

import { SocialMediaSettings } from '@/components/admin/settings/SocialMediaSettings';

export default function AdminSocialMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Social Media Settings</h2>
        <p className="text-sm text-gray-500">Manage your social media links and integrations.</p>
      </div>
      <SocialMediaSettings />
    </div>
  );
}
