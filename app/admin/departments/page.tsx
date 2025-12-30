'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';

export default function AdminDepartmentsPage() {
  const departments = useAdminStore((s) => s.departments);
  const addDepartment = useAdminStore((s) => s.addDepartment);
  const updateDepartment = useAdminStore((s) => s.updateDepartment);
  const deleteDepartment = useAdminStore((s) => s.deleteDepartment);
  const moveDepartment = useAdminStore((s) => s.moveDepartment);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const onAdd = () => {
    const n = name.trim();
    const s = (slug.trim() || n.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, ''));
    if (!n || !s) return;
    if (departments.some((d) => d.slug === s)) return;
    addDepartment({ name: n, slug: s });
    setName('');
    setSlug('');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-bold text-[#8B95A5]">Homepage</div>
        <h2 className="mt-1 text-2xl md:text-3xl font-black text-[#1A1D29] tracking-tight">Shop by Department</h2>
        <p className="mt-2 text-sm text-[#8B95A5]">Manage the sidebar department list.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white premium-shadow p-6">
        <div className="font-black text-[#1A1D29]">Departments</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((d, idx) => (
            <div key={d.slug} className="border rounded-xl p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29]">Name</label>
                  <Input
                    className="mt-2 h-10 rounded-xl"
                    value={d.name}
                    onChange={(e) => updateDepartment(d.slug, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#1A1D29]">Slug</label>
                  <Input
                    className="mt-2 h-10 rounded-xl"
                    value={d.slug}
                    onChange={(e) => updateDepartment(d.slug, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, '') })}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="outline" onClick={() => moveDepartment(d.slug, 'up')}>Move up</Button>
                <Button variant="outline" onClick={() => moveDepartment(d.slug, 'down')}>Move down</Button>
                <Button variant="destructive" onClick={() => deleteDepartment(d.slug)}>Delete</Button>
                <Link href={`/categories/${d.slug}`} className="text-sm text-[#0B1220] hover:underline">Preview</Link>
              </div>
              <div className="mt-2 text-xs text-[#8B95A5]">Position: {idx + 1}</div>
            </div>
          ))}
        </div>

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
