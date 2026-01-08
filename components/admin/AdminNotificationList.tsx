'use client';

import { useState, useEffect, useMemo } from 'react';
import { Bell, ShoppingBag, Info, AlertTriangle, ExternalLink, Search, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const NOTIFICATION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'sale', label: 'Sales' },
  { value: 'order', label: 'Orders' },
  { value: 'deal', label: 'Deals' },
  { value: 'vendor', label: 'Vendors' },
  { value: 'user', label: 'Users' },
  { value: 'stock', label: 'Stock' },
  { value: 'system', label: 'System' },
];

export function AdminNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [readFilter, setReadFilter] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [searchQuery, typeFilter, readFilter]);

  const fetchNotifications = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (typeFilter) params.append('type', typeFilter);
      if (readFilter !== '') params.append('isRead', readFilter);

      const res = await fetch(`/api/admin/notifications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        } else {
          setNotifications([]);
        }
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      await Promise.all(unreadIds.map(id => 
        fetch('/api/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
      ));
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ShoppingBag className="h-5 w-5 text-green-500" />;
      case 'order': return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'deal': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'vendor': return <Info className="h-5 w-5 text-purple-500" />;
      case 'user': return <Info className="h-5 w-5 text-indigo-500" />;
      case 'stock': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'system': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleOpen = (notification: Notification) => {
    if (!notification.isRead) markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
      return;
    }
    setSelected(notification);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasActiveFilters = searchQuery || typeFilter || readFilter !== '';

  if (loading && notifications.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">All system notifications and updates</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {unreadCount} unread
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              id="notificationSearch"
              name="notificationSearch"
              placeholder="Search notifications..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <select
              id="typeFilter"
              name="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {NOTIFICATION_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Read Status Filter */}
            <select
              id="readFilter"
              name="readFilter"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="false">Unread</option>
              <option value="true">Read</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {typeFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                Type: {NOTIFICATION_TYPES.find(t => t.value === typeFilter)?.label}
                <button onClick={() => setTypeFilter('')} className="hover:text-blue-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {readFilter !== '' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                Status: {readFilter === 'true' ? 'Read' : 'Unread'}
                <button onClick={() => setReadFilter('')} className="hover:text-blue-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('');
                setReadFilter('');
              }}
              className="text-xs h-6"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>{hasActiveFilters ? 'No notifications match your filters' : 'No notifications yet'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 transition-colors hover:bg-gray-50 flex gap-4 cursor-pointer ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                onClick={() => handleOpen(notification)}
              >
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      {notification.user && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {notification.user.name} ({notification.user.role})
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  {notification.link && (
                    <Link 
                      href={notification.link}
                      className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      View Details <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  )}
                </div>

                {!notification.isRead && (
                  <div className="flex-shrink-0 self-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={closeModal} className="sm:max-w-[560px]">
        {selected && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">{selected.title}</h2>
              <span className="text-xs text-gray-400">
                {format(new Date(selected.createdAt), 'MMM d, h:mm a')}
              </span>
            </div>
            {selected.user && (
              <p className="text-xs text-gray-500 mb-2">
                From: {selected.user.name} ({selected.user.email})
              </p>
            )}
            <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
            {selected.link && (
              <Link 
                href={selected.link}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mt-4"
                onClick={() => {
                  closeModal();
                }}
              >
                View Details <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
