'use client';

import { DepartmentSettings } from '@/components/admin/settings/DepartmentSettings';

export default function AdminDepartmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Department Settings</h2>
        <p className="text-sm text-gray-500">Manage your store departments.</p>
      </div>
      <DepartmentSettings />
    </div>
  );
}
