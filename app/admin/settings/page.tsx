'use client';

import { useState } from 'react';
import { HomepageSettings } from '@/components/admin/settings/HomepageSettings';
import { DepartmentSettings } from '@/components/admin/settings/DepartmentSettings';
import { CatalogSettings } from '@/components/admin/settings/CatalogSettings';
import { PromotionSettings } from '@/components/admin/settings/PromotionSettings';
import { TeamSettings } from '@/components/admin/settings/TeamSettings';
import { SystemSettings } from '@/components/admin/settings/SystemSettings';

import { CollectionSettings } from '@/components/admin/settings/CollectionSettings';
import { ThemeSettings } from '@/components/admin/settings/ThemeSettings';

const TABS = [
  'Homepage',
  'Departments',
  'Collections',
  'Catalog',
  'Promotions',
  'Team',
  'Theme',
  'System'
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('Homepage');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Configuration</h2>
        <p className="text-sm text-gray-500">
          Manage platform content, structure, and system settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'Homepage' && <HomepageSettings />}
        {activeTab === 'Departments' && <DepartmentSettings />}
        {activeTab === 'Collections' && <CollectionSettings />}
        {activeTab === 'Catalog' && <CatalogSettings />}
        {activeTab === 'Promotions' && <PromotionSettings />}
        {activeTab === 'Team' && <TeamSettings />}
        {activeTab === 'Theme' && <ThemeSettings />}
        {activeTab === 'System' && <SystemSettings />}
      </div>
    </div>
  );
}
