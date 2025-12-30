'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TakealotHeader } from '@/components/layout/TakealotHeader';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle, AlertCircle, Loader2, Store, FileText, User, Building2 } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth';
import { useUIStore } from '@/lib/stores/ui';

export default function VendorApplicationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { openLogin } = useUIStore();
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'BUSINESS',
    idDocument: '',
    proofOfAddress: '',
    businessDocuments: '',
  });

  // Verification State
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  // Upload State
  const [uploading, setUploading] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, [field]: result.url }));
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Upload error');
    } finally {
      setUploading(null);
    }
  };

  const verifyPhone = async () => {
    if (!formData.phone) return alert('Please enter a phone number');
    setVerifyingPhone(true);
    // Simulate API call
    setTimeout(() => {
      setPhoneVerified(true);
      setVerifyingPhone(false);
      alert('Phone number verified successfully!');
    }, 1500);
  };

  const verifyEmail = async () => {
    if (!formData.email) return alert('Please enter an email address');
    setVerifyingEmail(true);
    // Simulate API call
    setTimeout(() => {
      setEmailVerified(true);
      setVerifyingEmail(false);
      alert(`Verification email sent to ${formData.email}. (Simulated: Verified)`);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in or create an account to apply.');
      openLogin();
      return;
    }

    if (!phoneVerified) return alert('Please verify your phone number');
    if (!emailVerified) return alert('Please verify your email address');
    if (!formData.idDocument) return alert('Please upload your ID document');
    if (!formData.proofOfAddress) return alert('Please upload proof of address');
    if (formData.businessType === 'BUSINESS' && !formData.businessDocuments) {
      return alert('Please upload business registration documents');
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/vendors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          isPhoneVerified: phoneVerified,
          isEmailVerified: emailVerified,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Application submitted successfully! We will review your application shortly.');
        router.push('/');
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TakealotHeader />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white">
              <h1 className="text-3xl font-bold mb-2">Vendor Application</h1>
              <p className="text-blue-100 text-lg">
                Join our marketplace and start selling to millions of customers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Business Type Selection */}
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900 block">I am operating as a...</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, businessType: 'INDIVIDUAL' }))}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-4 transition-all ${
                      formData.businessType === 'INDIVIDUAL' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${formData.businessType === 'INDIVIDUAL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Individual</h3>
                      <p className="text-sm text-gray-500">Sole proprietor or freelancer</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, businessType: 'BUSINESS' }))}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-4 transition-all ${
                      formData.businessType === 'BUSINESS' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${formData.businessType === 'BUSINESS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Registered Business</h3>
                      <p className="text-sm text-gray-500">Company, Pty Ltd, or Corp</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.businessType === 'BUSINESS' ? 'Company Name' : 'Full Name'}
                    </label>
                    <Input 
                      name={formData.businessType === 'BUSINESS' ? 'businessName' : 'name'}
                      value={formData.businessType === 'BUSINESS' ? formData.businessName : formData.name}
                      onChange={handleInputChange}
                      placeholder={formData.businessType === 'BUSINESS' ? 'e.g. Acme Trading Pty Ltd' : 'e.g. John Doe'}
                      required
                      className="h-11"
                    />
                  </div>

                  {/* Email Verification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex gap-2">
                      <Input 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        disabled={emailVerified}
                        className="h-11"
                      />
                      <Button 
                        type="button"
                        onClick={verifyEmail}
                        disabled={emailVerified || verifyingEmail || !formData.email}
                        className={`min-w-[100px] h-11 ${emailVerified ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      >
                        {verifyingEmail ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : emailVerified ? (
                          <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Verified</span>
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                    {!emailVerified && <p className="text-xs text-gray-500 mt-1">We'll send a verification link to this email.</p>}
                  </div>

                  {/* Phone Verification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex gap-2">
                      <Input 
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+27 12 345 6789"
                        required
                        disabled={phoneVerified}
                        className="h-11"
                      />
                      <Button 
                        type="button"
                        onClick={verifyPhone}
                        disabled={phoneVerified || verifyingPhone || !formData.phone}
                        className={`min-w-[100px] h-11 ${phoneVerified ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      >
                        {verifyingPhone ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : phoneVerified ? (
                          <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Verified</span>
                        ) : (
                          'Verify'
                        )}
                      </Button>
                    </div>
                    {!phoneVerified && <p className="text-xs text-gray-500 mt-1">We'll verify this number via SMS.</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Required Documents
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID Document */}
                  <div className="border border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-blue-50 p-3 rounded-full mb-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">ID Document</h3>
                      <p className="text-sm text-gray-500 mb-4">Upload a clear copy of your ID</p>
                      
                      {formData.idDocument ? (
                        <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle className="h-4 w-4" /> Uploaded
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <span className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                            {uploading === 'idDocument' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Choose File
                          </span>
                          <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'idDocument')} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Proof of Address */}
                  <div className="border border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-purple-50 p-3 rounded-full mb-3">
                        <Store className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Proof of Address</h3>
                      <p className="text-sm text-gray-500 mb-4">Utility bill or bank statement (Max 3 months)</p>
                      
                      {formData.proofOfAddress ? (
                        <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle className="h-4 w-4" /> Uploaded
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <span className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                             {uploading === 'proofOfAddress' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Choose File
                          </span>
                          <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'proofOfAddress')} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Business Documents (Conditional) */}
                  {formData.businessType === 'BUSINESS' && (
                    <div className="border border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors md:col-span-2">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-orange-50 p-3 rounded-full mb-3">
                          <Building2 className="h-6 w-6 text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Business Registration</h3>
                        <p className="text-sm text-gray-500 mb-4">CIPC registration documents (CK/Pty Ltd)</p>
                        
                        {formData.businessDocuments ? (
                          <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircle className="h-4 w-4" /> Uploaded
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <span className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                               {uploading === 'businessDocuments' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                              Choose File
                            </span>
                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'businessDocuments')} />
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Submitting Application...</span>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  By submitting this form, you agree to our Seller Terms & Conditions.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
