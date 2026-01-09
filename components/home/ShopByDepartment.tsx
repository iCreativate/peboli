'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MAIN_CATEGORIES } from '@/lib/constants/categories';
import { motion } from 'framer-motion';

type Department = { name: string; slug: string };

export function ShopByDepartment() {
  const [departments, setDepartments] = useState<typeof MAIN_CATEGORIES>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const timestamp = Date.now();
        const res = await fetch(`/api/departments?t=${timestamp}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        if (res.ok) {
          const data = await res.json();
          console.log('[ShopByDepartment] Raw API response:', JSON.stringify(data, null, 2));
          console.log('[ShopByDepartment] Data type:', typeof data);
          console.log('[ShopByDepartment] Is array:', Array.isArray(data));
          console.log('[ShopByDepartment] Data length:', Array.isArray(data) ? data.length : 'N/A');
          
          // Handle different response formats
          let departmentsArray: Department[] = [];
          
          if (Array.isArray(data)) {
            departmentsArray = data;
          } else if (data && typeof data === 'object') {
            // Handle wrapped response like { departments: [...] }
            if (Array.isArray(data.departments)) {
              departmentsArray = data.departments;
            } else if (data.success && Array.isArray(data.departments)) {
              departmentsArray = data.departments;
            }
          }
          
          console.log('[ShopByDepartment] Extracted departments array:', departmentsArray);
          
          if (departmentsArray.length > 0) {
            const mapped = departmentsArray.map((dept: Department) => ({
              id: dept.slug || dept.name?.toLowerCase().replace(/\s+/g, '-'),
              name: dept.name,
              slug: dept.slug || dept.name?.toLowerCase().replace(/\s+/g, '-'),
              icon: '📦', // Default icon, could be enhanced later
              productCount: 0, // Could be calculated from products
            }));
            console.log('[ShopByDepartment] Mapped departments:', mapped);
            setDepartments(mapped);
          } else {
            console.warn('[ShopByDepartment] No departments found in response');
            setDepartments([]);
          }
        } else {
          const errorText = await res.text();
          console.error('[ShopByDepartment] Failed to fetch departments:', res.status, errorText);
          setDepartments([]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
    
    // Refresh every 10 seconds to get updates (reduced from 30s for faster updates)
    const interval = setInterval(fetchDepartments, 10000);
    
    // Also listen for storage events to refresh when admin saves
    const handleStorageChange = () => {
      fetchDepartments();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event from admin page
    window.addEventListener('departmentsUpdated', fetchDepartments);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('departmentsUpdated', fetchDepartments);
    };
  }, []);

  // Don't render if no departments
  if (!loading && departments.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B95A5] mb-1">
              Shop by Department
            </h2>
            <p className="text-lg font-semibold text-[#1A1D29]">
              Jump straight into what you&apos;re looking for
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-[#0B1220] font-semibold cursor-pointer">
            <span>View all departments</span>
            <span>→</span>
          </div>
        </div>

        <div className="relative -mx-4 lg:mx-0">
          <div className="flex gap-3 overflow-x-auto px-4 pb-1 md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-4 md:px-0 md:overflow-visible">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ y: -4 }}
                className="min-w-[160px] md:min-w-0"
              >
                <Link
                  href={`/categories/${dept.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 premium-shadow hover:premium-shadow-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B1220]/10 via-[#FF6B4A]/10 to-[#00C48C]/10 text-2xl">
                    <span>{dept.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1D29] truncate">
                      {dept.name}
                    </p>
                    <p className="text-[11px] text-[#8B95A5] font-medium">
                      {dept.productCount?.toLocaleString()} items
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

