'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';
import { Check } from 'lucide-react';

type Collection = { id: string; name: string; href: string; color?: string };

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('');
  const [href, setHref] = useState('');
  const [color, setColor] = useState('');

  // Load collections from API
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/admin/collections', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.collections)) {
        setCollections(data.collections);
        // Also update local store for backward compatibility
        const store = useAdminStore.getState();
        // Sync with store
        const currentIds = store.collections.map(c => c.id);
        const newIds = data.collections.map((c: Collection) => c.id);
        
        // Remove deleted collections
        currentIds.forEach(id => {
          if (!newIds.includes(id)) {
            store.deleteCollection(id);
          }
        });
        
        // Add/update collections
        data.collections.forEach((coll: Collection) => {
          const existing = store.collections.find(c => c.id === coll.id);
          if (existing) {
            store.updateCollection(coll.id, coll);
          } else {
            store.addCollection(coll);
          }
        });
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      alert('Failed to load collections. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const saveCollections = useCallback(async (newCollections: Collection[]) => {
    setSaving(true);
    setSaved(false);
    try {
      console.log('[Admin] Saving collections to API:', newCollections);
      const res = await fetch('/api/admin/collections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collections: newCollections }),
        cache: 'no-store',
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        console.error('[Admin] Save failed:', errorData);
        throw new Error(errorData.error || `Failed to save: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('[Admin] Save response:', data);
      if (data.success) {
        setCollections(newCollections);
        // Also update local store
        const store = useAdminStore.getState();
        // Sync with store
        const currentIds = store.collections.map(c => c.id);
        const newIds = newCollections.map(c => c.id);
        
        // Remove deleted collections
        currentIds.forEach(id => {
          if (!newIds.includes(id)) {
            store.deleteCollection(id);
          }
        });
        
        // Add/update collections
        newCollections.forEach(coll => {
          const existing = store.collections.find(c => c.id === coll.id);
          if (existing) {
            store.updateCollection(coll.id, coll);
          } else {
            store.addCollection(coll);
          }
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        console.log('[Admin] Collections saved successfully to database:', newCollections);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      console.error('[Admin] Error saving collections:', error);
      alert('Failed to save collections: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  }, []);

  const onAdd = () => {
    const n = name.trim();
    const h = href.trim();
    if (!n || !h) return;
    const id = n.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, '');
    if (collections.some(c => c.id === id)) {
      alert('A collection with this ID already exists');
      return;
    }
    const newCollections = [...collections, { id, name: n, href: h, color: color.trim() || undefined }];
    saveCollections(newCollections);
    setName('');
    setHref('');
    setColor('');
  };

  const handleUpdate = (id: string, updates: Partial<Collection>) => {
    const newCollections = collections.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    saveCollections(newCollections);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      const newCollections = collections.filter(c => c.id !== id);
      saveCollections(newCollections);
    }
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const idx = collections.findIndex(c => c.id === id);
    if (idx === -1) return;
    const newCollections = [...collections];
    if (direction === 'up' && idx > 0) {
      [newCollections[idx], newCollections[idx - 1]] = [newCollections[idx - 1], newCollections[idx]];
    } else if (direction === 'down' && idx < newCollections.length - 1) {
      [newCollections[idx], newCollections[idx + 1]] = [newCollections[idx + 1], newCollections[idx]];
    }
    saveCollections(newCollections);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[#8B95A5]">Homepage</div>
          <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Featured Collections</h2>
          <p className="mt-2 text-sm text-[#8B95A5]">Manage the quick navigation links in the header.</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="font-semibold">Saved!</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
        <div className="font-black text-[#1A1D29]">Collections</div>
        {loading ? (
          <div className="mt-4 text-center text-gray-500">Loading collections...</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4">
            {collections.map((c, idx) => (
              <div key={c.id} className="border rounded-xl p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Name</label>
                    <Input
                      className="mt-2 h-10 rounded-xl"
                      value={c.name}
                      onChange={(e) => handleUpdate(c.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Link (href)</label>
                    <Input
                      className="mt-2 h-10 rounded-xl"
                      value={c.href}
                      onChange={(e) => handleUpdate(c.id, { href: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#1A1D29]">Color (Hex)</label>
                    <Input
                      className="mt-2 h-10 rounded-xl"
                      placeholder="#000000"
                      value={c.color || ''}
                      onChange={(e) => handleUpdate(c.id, { color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleMove(c.id, 'up')} disabled={saving}>Move up</Button>
                  <Button variant="outline" size="sm" onClick={() => handleMove(c.id, 'down')} disabled={saving}>Move down</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)} disabled={saving}>Delete</Button>
                  <Link 
                    href={c.href} 
                    className="text-sm text-[#0B1220] hover:underline"
                    style={{ color: c.color }}
                  >
                    Preview
                  </Link>
                </div>
                <div className="mt-2 text-xs text-[#8B95A5]">Position: {idx + 1}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t pt-6">
          <div className="font-black text-[#1A1D29]">Add Collection</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              className="h-10 rounded-xl"
              placeholder="Name (e.g. New Arrivals)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="h-10 rounded-xl"
              placeholder="Link (e.g. /new)"
              value={href}
              onChange={(e) => setHref(e.target.value)}
            />
             <Input
              className="h-10 rounded-xl"
              placeholder="Color (optional)"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <Button onClick={onAdd}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
