'use client';

import { useState, useMemo, useCallback } from 'react';
import { HomepageSettings } from '@/components/admin/settings/HomepageSettings';
import { DepartmentSettings } from '@/components/admin/settings/DepartmentSettings';
import { CollectionSettings } from '@/components/admin/settings/CollectionSettings';
import { CatalogSettings } from '@/components/admin/settings/CatalogSettings';
import { PromotionSettings } from '@/components/admin/settings/PromotionSettings';
import { TeamSettings } from '@/components/admin/settings/TeamSettings';
import { SystemSettings } from '@/components/admin/settings/SystemSettings';
import { SecuritySettings } from '@/components/admin/settings/SecuritySettings';
import { SocialMediaSettings } from '@/components/admin/settings/SocialMediaSettings';
import { ThemeSettings } from '@/components/admin/settings/ThemeSettings';

const TABS = [
  'Homepage',
  'Departments',
  'Collections',
  'Catalog',
  'Promotions',
  'Team',
  'Theme',
  'Social Media',
  'Security',
  'System'
] as const;

type TabName = typeof TABS[number];

// Tab content mapping for faster lookups
const TAB_COMPONENTS: Record<TabName, React.ComponentType> = {
  'Homepage': HomepageSettings,
  'Departments': DepartmentSettings,
  'Collections': CollectionSettings,
  'Catalog': CatalogSettings,
  'Promotions': PromotionSettings,
  'Team': TeamSettings,
  'Theme': ThemeSettings,
  'Social Media': SocialMediaSettings,
  'Security': SecuritySettings,
  'System': SystemSettings,
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('Homepage');

  // Memoize the active component to prevent unnecessary re-renders
  const ActiveComponent = useMemo(() => {
    return TAB_COMPONENTS[activeTab];
  }, [activeTab]);

  // Optimize click handler with useCallback
  const handleTabClick = useCallback((tab: TabName) => {
    setActiveTab(tab);
  }, []);

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
              onClick={() => handleTabClick(tab)}
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

      {/* Tab Content - Optimized rendering */}
      <div className="mt-6">
        <ActiveComponent />
      </div>
    </div>
  );
}
