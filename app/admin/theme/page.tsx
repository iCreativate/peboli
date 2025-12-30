'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import { RotateCcw } from 'lucide-react';

export default function AdminThemePage() {
  const theme = useAdminStore((s) => s.theme);
  const updateTheme = useAdminStore((s) => s.updateTheme);
  
  // Local state for smoother input handling (optional, but good for color pickers)
  // However, since we want instant feedback, we can bind directly or use debounce.
  // Let's bind directly for instant "wow" factor, as it updates CSS vars immediately via the provider.

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
        <div className="text-sm font-bold text-[#8B95A5]">System</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Theme Settings</h2>
        <p className="mt-2 text-sm text-[#8B95A5]">Customize the platform's brand colors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="font-black text-[#1A1D29]">Color Palette</div>
              <Button variant="outline" size="sm" onClick={resetDefaults}>
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                Reset Defaults
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#1A1D29] mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-200">
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
                    className="flex-1 font-mono"
                    maxLength={7}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Used for headers, primary buttons, and navigation.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1D29] mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-200">
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
                    className="flex-1 font-mono"
                    maxLength={7}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Used for sale tags, call-to-actions, and highlights.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1D29] mb-2">Success Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-200">
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
                    className="flex-1 font-mono"
                    maxLength={7}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">Used for success states, stock indicators, and safe actions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
            <div className="font-black text-[#1A1D29] mb-4">Live Preview</div>
            
            {/* Mock Card */}
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              {/* Header */}
              <div 
                className="p-4 text-white flex items-center justify-between"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <div className="font-bold">Peboli Store</div>
                <div className="text-xs opacity-80">Cart (2)</div>
              </div>

              {/* Body */}
              <div className="p-4 bg-gray-50">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 text-xs">Img</div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-[#FF6B4A]" style={{ color: theme.accentColor }}>SALE</div>
                      <h4 className="font-semibold text-gray-900 mt-1">Premium Headphones</h4>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold" style={{ color: theme.primaryColor }}>$299.00</span>
                        <button 
                          className="px-3 py-1.5 rounded text-xs font-bold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: theme.accentColor }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                   <button 
                      className="flex-1 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
                      style={{ backgroundColor: theme.primaryColor }}
                   >
                     Checkout
                   </button>
                   <button 
                      className="flex-1 py-2 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-700 shadow-sm"
                   >
                     View Details
                   </button>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.successColor }}></div>
                   <span className="text-xs font-medium text-gray-700">Order delivered successfully</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Changes are applied instantly across the entire platform.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
