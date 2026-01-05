'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Check, ShoppingBag, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}


export function VendorNotificationList() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (status === 'authenticated' && userId) {
      fetchNotifications(userId);
    } else if (status === 'unauthenticated') {
      setNotifications([]);
      setLoading(false);
    }
  }, [session, status]);

  const fetchNotifications = async (userId?: string) => {
    try {
      const id = userId || (session?.user as any)?.id;
      if (!id) {
        setLoading(false);
        return;
      }
      
      const res = await fetch(`/api/notifications?userId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data || []);
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ShoppingBag className="h-5 w-5 text-green-500" />;
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

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <div className="text-sm text-gray-500">
          {notifications.filter(n => !n.isRead).length} unread
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No notifications yet</p>
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
                    <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
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
