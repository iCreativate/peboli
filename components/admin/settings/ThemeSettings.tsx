'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import { RotateCcw, Palette } from 'lucide-react';

export function ThemeSettings() {
  const theme = useAdminStore((s) => s.theme);
  const updateTheme = useAdminStore((s) => s.updateTheme);

  const resetDefaults = () => {
    updateTheme({
      primaryColor: '#0B1220',
      accentColor: '#FF6B4A',
      successColor: '#00C48C',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Theme Customization</h2>
        <p className="mt-1 text-sm text-gray-500">Manage global colors and visual preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Palette className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-gray-900">Color Palette</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetDefaults}
                className="text-xs h-8"
              >
                <RotateCcw className="h-3 w-3 mr-2" />
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <label className="block text-sm font-bold text-gray-900 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 ring-2 ring-white">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                    />
                  </div>
                  <Input
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="flex-1 font-mono uppercase"
                    maxLength={7}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Used for headers, primary buttons, and navigation backgrounds.</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <label className="block text-sm font-bold text-gray-900 mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 ring-2 ring-white">
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => updateTheme({ accentColor: e.target.value })}
                      className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                    />
                  </div>
                  <Input
                    value={theme.accentColor}
                    onChange={(e) => updateTheme({ accentColor: e.target.value })}
                    className="flex-1 font-mono uppercase"
                    maxLength={7}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Used for sale tags, call-to-actions, and highlights.</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <label className="block text-sm font-bold text-gray-900 mb-2">Success Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 ring-2 ring-white">
                    <input
                      type="color"
                      value={theme.successColor}
                      onChange={(e) => updateTheme({ successColor: e.target.value })}
                      className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                    />
                  </div>
                  <Input
                    value={theme.successColor}
                    onChange={(e) => updateTheme({ successColor: e.target.value })}
                    className="flex-1 font-mono uppercase"
                    maxLength={7}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Used for success states, stock indicators, and badges.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <div className="sticky top-6">
             <div className="rounded-2xl border border-gray-200 bg-white p-6 overflow-hidden">
              <h3 className="font-bold text-gray-900 mb-4">Live Preview</h3>
              
              <div className="space-y-4 rounded-xl border border-gray-100 p-4 bg-gray-50/50">
                {/* Button Preview */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Buttons</label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-transform active:scale-95"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-transform active:scale-95"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>

                {/* Badge Preview */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Badges</label>
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      SALE
                    </span>
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: theme.successColor }}
                    >
                      In Stock
                    </span>
                  </div>
                </div>

                {/* Typography Preview */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Typography</label>
                  <div className="p-4 bg-white rounded-lg border border-gray-100">
                    <h4 className="font-bold text-lg" style={{ color: theme.primaryColor }}>Heading Text</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      This is how your content will look with the selected <span className="font-medium" style={{ color: theme.accentColor }}>accent color</span> highlights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
