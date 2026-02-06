'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ICON_LIST = [
  'Smartphone', 'Shirt', 'Home', 'Sparkles', 'Dumbbell', 'Baby', 'Wine', 'Gamepad2', 
  'Book', 'Car', 'Dog', 'Briefcase', 'Package', 'Laptop', 'Tv', 'Utensils', 'Sofa', 
  'Hammer', 'Music', 'Camera', 'Watch', 'ShoppingBag', 'Gift', 'Truck', 'CreditCard', 
  'Tag', 'Star', 'Heart', 'Smile', 'Zap', 'Coffee', 'Monitor', 'Headphones', 'Speaker', 
  'Printer', 'Wifi', 'Battery', 'Sun', 'Moon', 'Cloud', 'Umbrella', 'Scissors', 'Key', 
  'Lock', 'Map', 'Globe', 'Anchor', 'Armchair', 'Bath', 'Bed', 'BedDouble', 'Bike',
  'Bus', 'Calculator', 'Calendar', 'Clock', 'Compass', 'Crown', 'Diamond', 'DollarSign',
  'Droplet', 'Eye', 'Feather', 'Film', 'Flag', 'Flame', 'Flower', 'Folder', 'Ghost',
  'Glasses', 'GraduationCap', 'HandMetal', 'HardHat', 'Hash', 'Image', 'Inbox', 'Infinity', 
  'Info', 'Lamp', 'Layers', 'Layout', 'Leaf', 'Library', 'LifeBuoy', 'Lightbulb', 'Link', 
  'List', 'Loader', 'Luggage', 'Mail', 'MapPin', 'Medal', 'Menu', 'Mic', 'Minus', 'Mouse', 
  'Move', 'Navigation', 'Network', 'Newspaper', 'Palette', 'Paperclip', 'Pause', 'Pen', 
  'Phone', 'PieChart', 'Pin', 'Play', 'Plug', 'Plus', 'Pocket', 'Power', 'Puzzle', 'QrCode',
  'Radio', 'RefreshCw', 'Repeat', 'Reply', 'Rocket', 'RotateCcw', 'Ruler', 'Save',
  'Scale', 'Scan', 'ScreenShare', 'Send', 'Server', 'Settings', 'Share', 'Shield', 
  'ShoppingCart', 'Shuffle', 'Sidebar', 'Signal', 'Skull', 'Slack', 'Slash', 'Sliders', 
  'Snowflake', 'Square', 'StopCircle', 'Sunrise', 'Sunset', 'Tablet', 'Target', 'Terminal',
  'Thermometer', 'ThumbsUp', 'Ticket', 'Timer', 'ToggleLeft', 'ToggleRight', 'Tool',
  'Trash', 'Trash2', 'Trophy', 'Twitter', 'Type', 'Underline', 'Unlock', 'Upload', 
  'User', 'Users', 'Video', 'Voicemail', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 
  'Wallet', 'Wand', 'Wind', 'WrapText', 'Wrench', 'XCircle', 'XOctagon', 'XSquare', 
  'Youtube', 'ZapOff', 'ZoomIn', 'ZoomOut'
];

// Remove duplicates and sort
const UNIQUE_ICONS = Array.from(new Set(ICON_LIST)).sort();

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = UNIQUE_ICONS.filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  // Safe icon retrieval
  const getIcon = (name: string) => {
    const Icon = (Icons as any)[name];
    return Icon || Icons.Package;
  };

  const SelectedIcon = value ? getIcon(value) : Icons.Package;

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between h-10 rounded-xl px-3 bg-white border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {value ? <SelectedIcon className="h-4 w-4 text-[#0B1220]" /> : <Search className="h-4 w-4 text-gray-400" />}
          <span className={`truncate ${!value ? 'text-gray-500' : 'text-gray-900'}`}>
            {value || 'Select Icon'}
          </span>
        </div>
        {value && (
          <div 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
          >
            <X className="h-3 w-3 text-gray-400" />
          </div>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-full min-w-[300px] bg-white rounded-xl border border-gray-200 shadow-xl z-50 p-4">
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 rounded-lg border-gray-200 focus:border-[#0B1220] focus:ring-[#0B1220]"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-6 gap-2 max-h-[240px] overflow-y-auto p-1 custom-scrollbar">
              {filteredIcons.map((iconName) => {
                const Icon = (Icons as any)[iconName];
                if (!Icon) return null;
                
                return (
                  <button
                    key={iconName}
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center gap-1 transition-all border ${
                      value === iconName 
                        ? 'bg-[#0B1220]/5 border-[#0B1220] text-[#0B1220]' 
                        : 'border-transparent text-gray-500 hover:text-[#0B1220] hover:border-gray-100'
                    }`}
                    title={iconName}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
              
              {filteredIcons.length === 0 && (
                <div className="col-span-6 text-center py-8 text-sm text-gray-500">
                  No icons found matching "{search}"
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
