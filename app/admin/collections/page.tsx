'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';

export default function AdminCollectionsPage() {
  const collections = useAdminStore((s) => s.collections);
  const addCollection = useAdminStore((s) => s.addCollection);
  const updateCollection = useAdminStore((s) => s.updateCollection);
  const deleteCollection = useAdminStore((s) => s.deleteCollection);
  const moveCollection = useAdminStore((s) => s.moveCollection);

  const [name, setName] = useState('');
  const [href, setHref] = useState('');
  const [color, setColor] = useState('');

  const onAdd = () => {
    const n = name.trim();
    const h = href.trim();
    if (!n || !h) return;
    const id = n.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, '');
    addCollection({ id, name: n, href: h, color: color.trim() || undefined });
    setName('');
    setHref('');
    setColor('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-bold text-[#8B95A5]">Homepage</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Featured Collections</h2>
        <p className="mt-2 text-sm text-[#8B95A5]">Manage the quick navigation links in the header.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
        <div className="font-black text-[#1A1D29]">Collections</div>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {collections.map((c, idx) => (
            <div key={c.id} className="border rounded-xl p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29]">Name</label>
                  <Input
                    className="mt-2 h-10 rounded-xl"
                    value={c.name}
                    onChange={(e) => updateCollection(c.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29]">Link (href)</label>
                  <Input
                    className="mt-2 h-10 rounded-xl"
                    value={c.href}
                    onChange={(e) => updateCollection(c.id, { href: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29]">Color (Hex)</label>
                  <Input
                    className="mt-2 h-10 rounded-xl"
                    placeholder="#000000"
                    value={c.color || ''}
                    onChange={(e) => updateCollection(c.id, { color: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => moveCollection(c.id, 'up')}>Move up</Button>
                <Button variant="outline" size="sm" onClick={() => moveCollection(c.id, 'down')}>Move down</Button>
                <Button variant="destructive" size="sm" onClick={() => deleteCollection(c.id)}>Delete</Button>
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
