'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Department = { name: string; slug: string };

export function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);
  
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
            setCategories(data.map((dept: Department) => ({
              id: dept.slug,
              name: dept.name,
              slug: dept.slug,
              icon: '📦',
              productCount: 0,
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    
    fetchDepartments();
    
    // Refresh every 10 seconds to get updates (reduced from 30s for faster updates)
    const interval = setInterval(fetchDepartments, 10000);
    
    // Listen for custom event from admin page
    window.addEventListener('departmentsUpdated', fetchDepartments);
    window.addEventListener('storage', () => {
      if (localStorage.getItem('departmentsUpdated')) {
        fetchDepartments();
      }
    });
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('departmentsUpdated', fetchDepartments);
    };
  }, []);

  // Don't render if no categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-[#F7F8FA]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#1A1D29] mb-3 tracking-tight">Shop by Category</h2>
          <p className="text-lg text-[#8B95A5] font-medium">Explore our curated collections</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="h-full"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="block h-full bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-400 transition-colors duration-200 group"
              >
                <div className="aspect-square relative bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-all duration-300">
                  <span className="text-6xl transition-transform duration-300">{category.icon}</span>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-[#1A1D29] transition-all duration-200 text-base mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#8B95A5] font-medium">
                    {category.productCount?.toLocaleString()} products
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

