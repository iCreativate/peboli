'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/lib/stores/admin';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Palette,
  Save,
  Check
} from 'lucide-react';

export function CollectionSettings() {
  const collections = useAdminStore((s) => s.collections);
  const addCollection = useAdminStore((s) => s.addCollection);
  const updateCollection = useAdminStore((s) => s.updateCollection);
  const deleteCollection = useAdminStore((s) => s.deleteCollection);
  const moveCollection = useAdminStore((s) => s.moveCollection);

  const [name, setName] = useState('');
  const [href, setHref] = useState('');
  const [color, setColor] = useState('');
  const [saved, setSaved] = useState(false);

  const onAdd = () => {
    const n = name.trim();
    const h = href.trim();
    if (!n || !h) return;
    const id = n.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, '');
    addCollection({ id, name: n, href: h, color: color.trim() || undefined });
    setName('');
    setHref('');
    setColor('');
    handleSave();
  };

  const handleSave = () => {
    // Force persist by accessing the store
    const store = useAdminStore.getState();
    // Trigger a re-render by updating a dummy state
    useAdminStore.setState({ collections: [...store.collections] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Featured Collections</h2>
          <p className="mt-1 text-sm text-gray-500">Manage the quick navigation links and featured collections.</p>
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

      {/* Add New Collection */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Plus className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-gray-900">Add Collection</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Input
              placeholder="Name (e.g. New Arrivals)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="md:col-span-1">
            <Input
              placeholder="Link (e.g. /new)"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="md:col-span-1">
            <div className="relative">
              <Input
                placeholder="Color (Optional)"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 pl-9"
              />
              <div 
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color || 'transparent' }}
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <Button 
              onClick={onAdd}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white h-10"
              disabled={!name || !href}
            >
              Add Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Collections List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Active Collections</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {collections.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No collections added yet.
            </div>
          ) : (
            collections.map((c, idx) => (
              <div key={c.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label>
                    <Input
                      value={c.name}
                      onChange={(e) => {
                        updateCollection(c.id, { name: e.target.value });
                        setSaved(false);
                      }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Link</label>
                    <div className="flex gap-2">
                      <Input
                        value={c.href}
                        onChange={(e) => {
                          updateCollection(c.id, { href: e.target.value });
                          setSaved(false);
                        }}
                        className="h-9"
                      />
                      <Link 
                        href={c.href}
                        target="_blank"
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          value={c.color || ''}
                          onChange={(e) => {
                            updateCollection(c.id, { color: e.target.value });
                            setSaved(false);
                          }}
                          className="h-9 pl-9"
                          placeholder="#000000"
                        />
                        <div 
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: c.color || 'transparent' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-medium">
                    Position: {idx + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        moveCollection(c.id, 'up');
                        setSaved(false);
                      }}
                      disabled={idx === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        moveCollection(c.id, 'down');
                        setSaved(false);
                      }}
                      disabled={idx === collections.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-4 bg-gray-200 mx-2" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        deleteCollection(c.id);
                        handleSave();
                      }}
                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
