'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?callbackUrl=/account/addresses');
      return;
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.province.trim()) newErrors.province = 'Province is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      const url = editingAddress 
        ? `/api/user/addresses/${editingAddress.id}`
        : '/api/user/addresses';
      
      const method = editingAddress ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setEditingAddress(null);
        resetForm();
        fetchAddresses();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchAddresses();
      } else {
        alert('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}/default`, {
        method: 'PUT',
      });
      
      if (res.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'South Africa',
      isDefault: false,
    });
    setErrors({});
  };

  const openModal = () => {
    resetForm();
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  if (!user) return null;

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
                <h1 className="mt-1 text-3xl md:text-4xl font-black text-white tracking-tight">Delivery Addresses</h1>
                <p className="mt-3 text-white/75 max-w-2xl">
                  Manage your delivery addresses for faster checkout. Set a default address for quick access.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1A1D29]">Saved Addresses</h2>
                <Button
                  onClick={openModal}
                  className="flex items-center gap-2 h-11 px-6 rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-all text-white font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  Add New Address
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-gray-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1D29]">Loading addresses...</h3>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#1A1D29] mb-2">No addresses saved</h3>
                  <p className="text-gray-500 mb-6">Add your first delivery address to get started.</p>
                  <Button
                    onClick={openModal}
                    className="flex items-center gap-2 h-11 px-6 rounded-xl bg-[#0B1220] hover:bg-[#1a283a] transition-colors text-white font-semibold mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border-2 rounded-2xl p-6 ${
                        address.isDefault
                          ? 'border-blue-500 bg-blue-50/30'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {address.isDefault && (
                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-3">
                          <Check className="h-4 w-4" />
                          Default Address
                        </div>
                      )}
                      <div className="space-y-2 mb-4">
                        <p className="font-bold text-[#1A1D29]">{address.fullName}</p>
                        <p className="text-sm text-gray-600">{address.line1}</p>
                        {address.line2 && <p className="text-sm text-gray-600">{address.line2}</p>}
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.province} {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                            className="flex-1"
                          >
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(address)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-[#1A1D29] mb-6">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1A1D29] mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.fullName ? 'border-red-300' : 'border-gray-200'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1D29] mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.phone ? 'border-red-300' : 'border-gray-200'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1D29] mb-2">Address Line 1 *</label>
            <input
              type="text"
              value={formData.line1}
              onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.line1 ? 'border-red-300' : 'border-gray-200'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
            />
            {errors.line1 && <p className="mt-1 text-xs text-red-600">{errors.line1}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1D29] mb-2">Address Line 2</label>
            <input
              type="text"
              value={formData.line2}
              onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1A1D29] mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.city ? 'border-red-300' : 'border-gray-200'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              />
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1D29] mb-2">Province *</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.province ? 'border-red-300' : 'border-gray-200'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              />
              {errors.province && <p className="mt-1 text-xs text-red-600">{errors.province}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1D29] mb-2">Postal Code *</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.postalCode ? 'border-red-300' : 'border-gray-200'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              />
              {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1D29] mb-2">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-[#1A1D29]">
              Set as default address
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded-xl bg-[#0B1220] hover:bg-[#0B1220]/90 transition-colors text-white font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}

