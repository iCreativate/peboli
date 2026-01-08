'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MAIN_CATEGORIES } from '@/lib/constants/categories';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/lib/stores/admin';

export function CategoryGrid() {
  const adminDepartments = useAdminStore((s) => s.departments);
  const [mounted, setMounted] = useState(false);
  
  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Always use admin departments when mounted (even if empty), only fall back if not mounted yet
  const categories = mounted && adminDepartments
    ? adminDepartments.map((dept) => ({
        id: dept.slug,
        name: dept.name,
        slug: dept.slug,
        icon: '📦',
        productCount: 0,
      }))
    : MAIN_CATEGORIES;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#F7F8FA] to-white">
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
              whileHover={{ y: -8, scale: 1.03 }}
              className="h-full"
            >
              <Link
                href={`/categories/${category.slug}`}
                className="block h-full bg-white rounded-2xl border border-gray-100 overflow-hidden premium-shadow hover:premium-shadow-xl transition-all duration-300 group"
              >
                <div className="aspect-square relative bg-gradient-to-br from-[#0B1220]/6 via-[#FF6B4A]/5 to-[#00C48C]/5 flex items-center justify-center group-hover:from-[#0B1220]/10 group-hover:via-[#FF6B4A]/10 group-hover:to-[#00C48C]/10 transition-all duration-300">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-[#1A1D29] group-hover:text-gradient transition-all duration-200 text-base mb-1">
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

