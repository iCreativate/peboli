'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Server, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '@/lib/stores/admin';

export function SystemSettings() {
  const system = useAdminStore((state) => state.system);
  const updateSystem = useAdminStore((state) => state.updateSystem);

  const [platformName, setPlatformName] = useState(system?.platformName || 'Peboli');
  const [maintenanceMode, setMaintenanceMode] = useState(system?.maintenanceMode || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (system) {
      setPlatformName(system.platformName);
      setMaintenanceMode(system.maintenanceMode);
    }
  }, [system]);

  const handleSave = async () => {
    setLoading(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateSystem({ platformName, maintenanceMode });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">System Configuration</h2>
        <p className="mt-1 text-sm text-gray-500">Manage core system settings and preferences.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <Server className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-gray-900">General Settings</h3>
        </div>

        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Platform Name</label>
            <Input 
              value={platformName} 
              onChange={(e) => setPlatformName(e.target.value)} 
              className="h-11 rounded-xl"
            />
            <p className="mt-2 text-xs text-gray-500">The name displayed in the browser tab and emails.</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div>
              <div className="font-bold text-gray-900">Maintenance Mode</div>
              <div className="text-sm text-gray-500">Temporarily disable the platform for all users.</div>
            </div>
            <button
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B1220] focus:ring-offset-2 ${
                maintenanceMode ? 'bg-[#0B1220]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`${
                  maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="h-11 rounded-xl bg-[#0B1220] hover:bg-[#1a283a] text-white font-bold transition-colors"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-gray-900">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-red-900">Clear System Cache</div>
              <div className="text-sm text-red-700">Remove all temporary files and cached data. This may slow down initial requests.</div>
            </div>
            <Button variant="outline" className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 font-bold rounded-xl whitespace-nowrap">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-red-900">Reset All Data</div>
              <div className="text-sm text-red-700">Permanently delete all products, orders, and users. This action cannot be undone.</div>
            </div>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl whitespace-nowrap">
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Database
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
