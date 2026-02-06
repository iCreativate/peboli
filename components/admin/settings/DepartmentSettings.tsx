'use client';

import { useState, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';
import { Save, Check } from 'lucide-react';
import { IconPicker } from './IconPicker';

export const DepartmentSettings = memo(function DepartmentSettings() {
  const departments = useAdminStore((s) => s.departments);
  const addDepartment = useAdminStore((s) => s.addDepartment);
  const updateDepartment = useAdminStore((s) => s.updateDepartment);
  const deleteDepartment = useAdminStore((s) => s.deleteDepartment);
  const moveDepartment = useAdminStore((s) => s.moveDepartment);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('');
  const [saved, setSaved] = useState(false);

  const onAdd = () => {
    const n = name.trim();
    const s = (slug.trim() || n.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, ''));
    if (!n || !s) return;
    if (departments.some((d) => d.slug === s)) return;
    addDepartment({ name: n, slug: s, icon });
    setName('');
    setSlug('');
    setIcon('');
    handleSave();
  };

  const handleSave = () => {
    // Force persist by accessing the store
    const store = useAdminStore.getState();
    // Trigger a re-render by updating a dummy state
    useAdminStore.setState({ departments: [...store.departments] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Shop by Department</h2>
          <p className="mt-1 text-sm text-gray-500">Manage the sidebar department list.</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#0B1220] hover:bg-[#0B1220]/90 text-white"
          disabled={saved}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="font-black text-[#1A1D29]">Departments</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((d, idx) => (
            <div key={d.slug} className="border rounded-xl p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-[#1A1D29]">Icon</label>
                  <div className="mt-2">
                    <IconPicker 
                      value={d.icon} 
                      onChange={(iconName) => {
                        updateDepartment(d.slug, { icon: iconName });
                        setSaved(false);
                      }} 
                    />
                  </div>
                </div>
                <div className="md:col-span-5">
                  <label className="text-sm font-semibold text-[#1A1D29]">Name</label>
                  <Input
                    className="mt-2 h-10 rounded-xl"
                    value={d.name}
                    onChange={(e) => {
                      updateDepartment(d.slug, { name: e.target.value });
                      setSaved(false);
                    }}
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="text-sm font-semibold text-[#1A1D29]">Slug</label>
                  <Input
                    className="mt-2 h-10 rounded-xl"
                    value={d.slug}
                    onChange={(e) => {
                      updateDepartment(d.slug, { slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, '') });
                      setSaved(false);
                    }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    moveDepartment(d.slug, 'up');
                    setSaved(false);
                  }}
                >
                  Move up
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    moveDepartment(d.slug, 'down');
                    setSaved(false);
                  }}
                >
                  Move down
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteDepartment(d.slug);
                    handleSave();
                  }}
                >
                  Delete
                </Button>
                <Link href={`/categories/${d.slug}`} className="text-sm text-[#0B1220] hover:underline">Preview</Link>
              </div>
              <div className="mt-2 text-xs text-[#8B95A5]">Position: {idx + 1}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="font-black text-[#1A1D29]">Add department</div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-2">
              <IconPicker value={icon} onChange={setIcon} />
            </div>
            <div className="md:col-span-4">
              <Input
                className="h-10 rounded-xl"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="md:col-span-4">
              <Input
                className="h-10 rounded-xl"
                placeholder="Slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={onAdd} className="w-full">Add</Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-[#8B95A5]">If slug is empty, it is generated from the name.</div>
        </div>
      </div>
    </div>
  );
});
