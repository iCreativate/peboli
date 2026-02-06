'use client';

import { Check, X, ExternalLink, Store, Filter, Download, LayoutDashboard, Eye, MessageSquare } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { exportData } from '@/lib/export';

type Application = {
  id: string;
  name: string;
  email: string;
  tier: string;
  submitted: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  description: string;
  rejectionReason?: string;
  joinedAt: string;
};

const TABS = ['Pending', 'Approved', 'Rejected'];

export default function VendorApprovalsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((v: any) => ({
            id: v.id,
            name: v.name,
            email: v.email,
            tier: v.verificationTier,
            submitted: new Date(v.joinedAt).toLocaleDateString(),
            joinedAt: v.joinedAt,
            status: v.status,
            description: 'No description provided', // API needs to return this if available
            rejectionReason: v.rejectionReason,
        }));
        setApplications(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch vendors', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter applications based on active tab
  const filteredApps = applications.filter(app => {
    // Tab filter
    let matchesTab = false;
    if (activeTab === 'Pending') matchesTab = app.status === 'PENDING';
    else if (activeTab === 'Approved') matchesTab = app.status === 'APPROVED';
    else if (activeTab === 'Rejected') matchesTab = app.status === 'REJECTED';
    else matchesTab = true;

    // Search filter
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    try {
        const res = await fetch(`/api/admin/vendors/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'APPROVED' }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setApplications(apps => apps.map(app => 
              app.id === id ? { ...app, status: 'APPROVED' } : app
            ));
        }
    } catch (error) {
        console.error('Failed to approve', error);
    }
  };

  const openRejectModal = (app: Application) => {
    setSelectedApp(app);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
        const res = await fetch(`/api/admin/vendors/${selectedApp.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'REJECTED', rejectionReason: rejectReason }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            setApplications(apps => apps.map(app => 
              app.id === selectedApp.id ? { ...app, status: 'REJECTED', rejectionReason: rejectReason } : app
            ));
            setIsRejectModalOpen(false);
        }
    } catch (error) {
        console.error('Failed to reject', error);
    }
  };

  const openProfile = (app: Application) => {
    setSelectedApp(app);
    setIsProfileModalOpen(true);
  };

  // Export vendors data
  const handleExport = useCallback(async () => {
    const dataToExport = filteredApps.length > 0 ? filteredApps : applications;
    if (dataToExport.length === 0) {
      alert('No vendors to export');
      return;
    }

    // Transform vendors for export
    const exportDataArray = dataToExport.map(app => ({
      'Name': app.name,
      'Email': app.email,
      'Tier': app.tier,
      'Status': app.status,
      'Submitted': app.submitted,
      'Joined At': app.joinedAt ? new Date(app.joinedAt).toLocaleDateString() : 'N/A',
      'Description': app.description,
      'Rejection Reason': app.rejectionReason || 'N/A',
    }));

    // Ask user for format
    const exportFormat = confirm('Export as Excel? (Click OK for Excel, Cancel for CSV)') ? 'excel' : 'csv';
    
    await exportData(
      exportDataArray,
      `vendors-${activeTab.toLowerCase()}-${new Date().toISOString().split('T')[0]}`,
      exportFormat
    );
  }, [filteredApps, applications, activeTab]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Vendor Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Review and manage vendor applications and accounts.
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handleExport} className="h-10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1220]/10"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
               {/* Search Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No applications found in {activeTab}.</div>
        ) : (
            filteredApps.map((app) => (
            <div
                key={app.id}
                className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 transition-all duration-200"
            >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{app.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.tier === 'Premium' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                        app.tier === 'Standard' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                        {app.tier}
                    </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                        <Store className="h-4 w-4" />
                        {app.email}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>Applied {app.submitted}</span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                    {app.description}
                    </p>
                    
                    {app.rejectionReason && (
                        <p className="text-red-600 text-sm mt-2">Reason: {app.rejectionReason}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openProfile(app)}
                        className="flex-1 lg:flex-none"
                    >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                    </Button>
                    
                    {app.status === 'PENDING' && (
                        <>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openRejectModal(app)}
                            className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                        <Button 
                            size="sm"
                            onClick={() => handleApprove(app.id)}
                            className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                        </>
                    )}
                </div>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-gray-200 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Application</h3>
            <p className="text-gray-500 text-sm mb-4">
              Please provide a reason for rejecting {selectedApp.name}'s application.
              This will be sent to the vendor.
            </p>
            
            <form onSubmit={handleReject}>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full h-32 p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none text-sm mb-4"
                placeholder="Enter rejection reason..."
                required
              />
              
              <div className="flex justify-end gap-3">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setIsRejectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  variant="destructive"
                >
                  Reject Vendor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 border border-gray-100 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={() => setIsProfileModalOpen(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>
                
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApp.name}</h2>
                    <p className="text-gray-500 mt-1">Vendor Application Review</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                                        <Store className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{selectedApp.email}</p>
                                        <p className="text-xs text-gray-500">Business Email</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Business Details</h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                    <span className="text-sm text-gray-500">Tier</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedApp.tier}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                    <span className="text-sm text-gray-500">Submitted</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedApp.submitted}</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className={`text-sm font-medium ${
                                        selectedApp.status === 'APPROVED' ? 'text-green-600' :
                                        selectedApp.status === 'REJECTED' ? 'text-red-600' :
                                        'text-yellow-600'
                                    }`}>{selectedApp.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Business Description</h3>
                        <div className="bg-gray-50 rounded-xl p-4 min-h-[120px]">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {selectedApp.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
                        Close
                    </Button>
                    {selectedApp.status === 'PENDING' && (
                        <Button onClick={() => {
                            setIsProfileModalOpen(false);
                            handleApprove(selectedApp.id);
                        }}>
                            Approve Vendor
                        </Button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
