'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';
import { Check } from 'lucide-react';

type Department = { name: string; slug: string };

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [localDepartments, setLocalDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  // Load departments from API
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/admin/departments', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.departments)) {
        setDepartments(data.departments);
        setLocalDepartments(data.departments);
        setHasUnsavedChanges(false);
        // Also update local store for backward compatibility
        const store = useAdminStore.getState();
        // Sync with store - remove old, add new
        const currentSlugs = store.departments.map(d => d.slug);
        const newSlugs = data.departments.map((d: Department) => d.slug);
        
        // Remove deleted departments
        currentSlugs.forEach(slug => {
          if (!newSlugs.includes(slug)) {
            store.deleteDepartment(slug);
          }
        });
        
        // Add/update departments
        data.departments.forEach((dept: Department) => {
          const existing = store.departments.find(d => d.slug === dept.slug);
          if (existing) {
            store.updateDepartment(dept.slug, dept);
          } else {
            store.addDepartment(dept);
          }
        });
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to load departments. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const saveDepartments = useCallback(async (newDepartments: Department[]) => {
    setSaving(true);
    setSaved(false);
    try {
      console.log('[Admin] Attempting to save departments:', newDepartments);
      const payload = { departments: newDepartments };
      console.log('[Admin] Payload to send:', JSON.stringify(payload, null, 2));
      
      const res = await fetch('/api/admin/departments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      
      console.log('[Admin] Response status:', res.status);
      console.log('[Admin] Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('[Admin] Error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP ${res.status}` };
        }
        throw new Error(errorData.error || `Failed to save: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('[Admin] Response data:', data);
      
      if (data.success) {
        setDepartments(newDepartments);
        setLocalDepartments(newDepartments);
        setHasUnsavedChanges(false);
        
        // Verify the save by fetching again
        setTimeout(async () => {
          const verifyRes = await fetch('/api/admin/departments?t=' + Date.now(), { cache: 'no-store' });
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            console.log('[Admin] Verification fetch result:', verifyData);
            if (verifyData.success && Array.isArray(verifyData.departments)) {
              console.log('[Admin] Verified: Departments saved correctly');
            } else {
              console.warn('[Admin] Warning: Verification failed - departments may not have been saved');
            }
          }
        }, 500);
        
        // Also update local store
        const store = useAdminStore.getState();
        // Sync with store
        const currentSlugs = store.departments.map(d => d.slug);
        const newSlugs = newDepartments.map(d => d.slug);
        
        // Remove deleted departments
        currentSlugs.forEach(slug => {
          if (!newSlugs.includes(slug)) {
            store.deleteDepartment(slug);
          }
        });
        
        // Add/update departments
        newDepartments.forEach(dept => {
          const existing = store.departments.find(d => d.slug === dept.slug);
          if (existing) {
            store.updateDepartment(dept.slug, dept);
          } else {
            store.addDepartment(dept);
          }
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        console.log('[Admin] Departments saved successfully:', newDepartments);
        
        // Dispatch custom event to notify landing page components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('departmentsUpdated'));
          // Also try localStorage event for cross-tab communication
          localStorage.setItem('departmentsUpdated', Date.now().toString());
        }
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      console.error('[Admin] Error saving departments:', error);
      console.error('[Admin] Error stack:', error.stack);
      alert('Failed to save departments: ' + (error.message || 'Unknown error') + '\n\nCheck the browser console for details.');
    } finally {
      setSaving(false);
    }
  }, []);

  const onAdd = () => {
    const n = name.trim();
    const s = (slug.trim() || n.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, ''));
    if (!n || !s) return;
    if (localDepartments.some((d) => d.slug === s)) {
      alert('A department with this slug already exists');
      return;
    }
    const newDepartments = [...localDepartments, { name: n, slug: s }];
    setLocalDepartments(newDepartments);
    setHasUnsavedChanges(true);
    setName('');
    setSlug('');
  };

  const handleUpdate = (slug: string, updates: Partial<Department>) => {
    const newDepartments = localDepartments.map(d => 
      d.slug === slug ? { ...d, ...updates } : d
    );
    setLocalDepartments(newDepartments);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('[Admin] Save button clicked');
    console.log('[Admin] Has unsaved changes:', hasUnsavedChanges);
    console.log('[Admin] Local departments to save:', localDepartments);
    if (hasUnsavedChanges && localDepartments.length > 0) {
      saveDepartments(localDepartments);
    } else if (!hasUnsavedChanges) {
      alert('No changes to save');
    } else if (localDepartments.length === 0) {
      if (confirm('You are about to save an empty departments list. This will remove all departments. Continue?')) {
        saveDepartments(localDepartments);
      }
    }
  };

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      const newDepartments = localDepartments.filter(d => d.slug !== slug);
      setLocalDepartments(newDepartments);
      setHasUnsavedChanges(true);
    }
  };

  const handleMove = (slug: string, direction: 'up' | 'down') => {
    const idx = localDepartments.findIndex(d => d.slug === slug);
    if (idx === -1) return;
    const newDepartments = [...localDepartments];
    if (direction === 'up' && idx > 0) {
      [newDepartments[idx], newDepartments[idx - 1]] = [newDepartments[idx - 1], newDepartments[idx]];
    } else if (direction === 'down' && idx < newDepartments.length - 1) {
      [newDepartments[idx], newDepartments[idx + 1]] = [newDepartments[idx + 1], newDepartments[idx]];
    }
    setLocalDepartments(newDepartments);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[#8B95A5]">Homepage</div>
          <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Shop by Department</h2>
          <p className="mt-2 text-sm text-[#8B95A5]">Manage the sidebar department list.</p>
        </div>
        <div className="flex items-center gap-4">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-orange-600">
              <span className="text-sm font-semibold">Unsaved changes</span>
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Saved!</span>
            </div>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!hasUnsavedChanges || saving}
            className="bg-[#0B1220] text-white hover:bg-gray-800"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
        <div className="font-black text-[#1A1D29]">Departments</div>
        {loading ? (
          <div className="mt-4 text-center text-gray-500">Loading departments...</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {localDepartments.map((d, idx) => (
              <div key={d.slug} className="border rounded-xl p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Name</label>
                    <Input
                      className="mt-2 h-10 rounded-xl"
                      value={d.name}
                      onChange={(e) => handleUpdate(d.slug, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Slug</label>
                    <Input
                      className="mt-2 h-10 rounded-xl"
                      value={d.slug}
                      onChange={(e) => handleUpdate(d.slug, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, '') })}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleMove(d.slug, 'up')} disabled={saving}>Move up</Button>
                  <Button variant="outline" size="sm" onClick={() => handleMove(d.slug, 'down')} disabled={saving}>Move down</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(d.slug)} disabled={saving}>Delete</Button>
                  <Link href={`/categories/${d.slug}`} className="text-sm text-[#0B1220] hover:underline">Preview</Link>
                </div>
                <div className="mt-2 text-xs text-[#8B95A5]">Position: {idx + 1}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t pt-6">
          <div className="font-black text-[#1A1D29]">Add department</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              className="h-10 rounded-xl"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="h-10 rounded-xl"
              placeholder="Slug (optional)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <Button onClick={onAdd}>Add</Button>
          </div>
          <div className="mt-2 text-xs text-[#8B95A5]">If slug is empty, it is generated from the name.</div>
        </div>
      </div>
    </div>
  );
}
