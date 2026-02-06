'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PersonalDetailsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/login?callbackUrl=/account/details');
      return;
    }
    
    // Fetch user details
    fetchUserDetails();
  }, [user]);

  const fetchUserDetails = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      } else {
        // Fallback to store data
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        // Update auth store
        const { login } = useAuthStore.getState();
        login({
          ...user!,
          name: formData.name,
          email: formData.email,
        });
        
        alert('Profile updated successfully!');
        router.push('/account');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 lg:px-6 py-10">
          <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
            <div className="p-6 md:p-10 bg-[#0B1220]">
              <div className="max-w-3xl">
                <Link href="/account" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Account
                </Link>
                <div className="text-white/80 text-sm font-semibold">Account Settings</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Personal Details</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Update your name, email, and phone number. This information is used for order confirmations and account security.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {loading ? (
                <div className="text-center py-20">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-gray-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1D29]">Loading...</h3>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1A1D29] mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.name ? 'border-red-300' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1A1D29] mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </div>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email ? 'border-red-300' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    <p className="mt-1 text-xs text-gray-500">Your email is used for login and order notifications.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#1A1D29] mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </div>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.phone ? 'border-red-300' : 'border-gray-200'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                      placeholder="Enter your phone number (optional)"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    <p className="mt-1 text-xs text-gray-500">Used for delivery updates and account verification.</p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 h-12 px-8 rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-all text-white font-semibold disabled:opacity-50"
                    >
                      {saving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/account')}
                      className="h-12 px-8 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

