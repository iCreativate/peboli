'use client';

import { useState, useEffect } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Music,
  Save,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SocialMediaPlatform = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  color: string;
};

const PLATFORMS: SocialMediaPlatform[] = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/peboli', color: 'text-blue-600' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, placeholder: 'https://twitter.com/peboli', color: 'text-blue-400' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/peboli', color: 'text-pink-600' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@peboli', color: 'text-red-600' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/peboli', color: 'text-blue-700' },
  { id: 'tiktok', name: 'TikTok', icon: Music, placeholder: 'https://tiktok.com/@peboli', color: 'text-black' },
];

export function SocialMediaSettings() {
  const [socialMedia, setSocialMedia] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const res = await fetch('/api/admin/social-media');
      if (res.ok) {
        const data = await res.json();
        setSocialMedia(data.socialMedia || {});
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch('/api/admin/social-media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialMedia }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Social media handles updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update social media handles.' });
      }
    } catch (error) {
      console.error('Error updating social media:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (platformId: string, value: string) => {
    setSocialMedia((prev) => ({
      ...prev,
      [platformId]: value,
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Facebook className="h-8 w-8 text-gray-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-[#1A1D29]">Loading...</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="font-black text-[#1A1D29]">Social Media Handles</div>
            <div className="mt-1 text-sm text-[#8B95A5]">
              Add your social media profiles. These will be displayed on the platform.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            const value = socialMedia[platform.id] || '';

            return (
              <div key={platform.id}>
                <label className="block text-sm font-bold text-[#1A1D29] mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${platform.color}`} />
                    {platform.name}
                  </div>
                </label>
                <div className="relative">
                  <Input
                    type="url"
                    value={value}
                    onChange={(e) => handleChange(platform.id, e.target.value)}
                    placeholder={platform.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-10"
                  />
                  {value && (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {message && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={saving}
            className="w-full h-12 rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-colors text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Social Media Handles
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

