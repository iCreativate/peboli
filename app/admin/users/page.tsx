'use client';

import { Search, MoreHorizontal, ShieldCheck, ShieldAlert, Filter, Download, UserPlus, Trash2, Edit2, X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'Buyer' | 'Vendor' | 'Admin';
  status: 'Active' | 'Suspended' | 'Pending';
  joined: string;
  avatar: string;
};

const INITIAL_USERS: User[] = [
  { id: 1, name: 'Alice Freeman', email: 'alice@example.com', role: 'Buyer', status: 'Active', joined: 'Oct 24, 2023', avatar: 'AF' },
  { id: 2, name: 'Bob Smith', email: 'bob@store.com', role: 'Vendor', status: 'Active', joined: 'Nov 12, 2023', avatar: 'BS' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Buyer', status: 'Suspended', joined: 'Dec 01, 2023', avatar: 'CB' },
  { id: 4, name: 'Diana Prince', email: 'diana@admin.com', role: 'Admin', status: 'Active', joined: 'Jan 15, 2024', avatar: 'DP' },
  { id: 5, name: 'Evan Wright', email: 'evan@store.com', role: 'Vendor', status: 'Pending', joined: 'Feb 20, 2024', avatar: 'EW' },
];

const TABS = ['All Users', 'Buyers', 'Vendors', 'Admins'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState('All Users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'Buyer',
    status: 'Active'
  });

  // Filter Users
  const filteredUsers = users.filter(user => {
    const matchesTab = 
      activeTab === 'All Users' ? true :
      activeTab === 'Buyers' ? user.role === 'Buyer' :
      activeTab === 'Vendors' ? user.role === 'Vendor' :
      user.role === 'Admin';
      
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Buyer', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Edit
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
    } else {
      // Add
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: formData.name!,
        email: formData.email!,
        role: formData.role as any,
        status: formData.status as any,
        joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        avatar: formData.name!.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      };
      setUsers([newUser, ...users]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-2">Manage user access, roles, and platform activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleOpenAdd} className="bg-gray-900 text-white hover:bg-gray-800">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-1">
        <div className="flex items-center gap-8 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Search & Bulk Actions */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-gray-400"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Status: All</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Role: All</option>
              <option>Buyer</option>
              <option>Vendor</option>
              <option>Admin</option>
            </select>
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Joined: Anytime</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-medium text-gray-500 w-[40px]">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                </th>
                <th className="px-6 py-4 font-medium text-gray-500">User</th>
                <th className="px-6 py-4 font-medium text-gray-500">Role</th>
                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 font-medium text-gray-500">Joined</th>
                <th className="px-6 py-4 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-500">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      user.role === 'Vendor' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : user.role === 'Admin'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      user.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : user.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {user.status === 'Active' ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">1-{filteredUsers.length}</span> of <span className="font-medium text-gray-900">{users.length}</span> users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">Previous</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{Math.min(startIndex + 1, filteredUsers.length)}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> users
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  >
                    <option value="Buyer">Buyer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  {editingUser ? 'Save Changes' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
