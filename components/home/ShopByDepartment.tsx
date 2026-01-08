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
        const res = await fetch('/api/departments?t=' + Date.now(), { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDepartments(data.map((dept: Department) => ({
              id: dept.slug,
              name: dept.name,
              slug: dept.slug,
              icon: '📦', // Default icon, could be enhanced later
              productCount: 0, // Could be calculated from products
            })));
          }
        } else {
          console.error('Failed to fetch departments:', res.status);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
    
    // Refresh every 30 seconds to get updates
    const interval = setInterval(fetchDepartments, 30000);
    return () => clearInterval(interval);
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

