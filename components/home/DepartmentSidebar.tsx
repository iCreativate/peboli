'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { MAIN_CATEGORIES } from '@/lib/constants/categories';
import { useAdminStore } from '@/lib/stores/admin';

export function DepartmentSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const megaMenuRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseEnter = (category: string) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150); // 150ms delay to allow moving to mega menu
  };

  const handlePanelMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleSidebarMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && megaMenuRef.current && megaMenuRef.current.contains(next)) {
      return;
    }
    handleMouseLeave();
  };

  const handleMegaMenuMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && sidebarRef.current && sidebarRef.current.contains(next)) {
      return;
    }
    handleMouseLeave();
  };

  useEffect(() => {
    if (!hoveredCategory) {
      return;
    }

    const isInside = (rect: DOMRect, x: number, y: number) => {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const sidebarEl = sidebarRef.current;
        const megaEl = megaMenuRef.current;
        if (!sidebarEl || !megaEl) {
          return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const inSidebar = isInside(sidebarEl.getBoundingClientRect(), x, y);
        const inMega = isInside(megaEl.getBoundingClientRect(), x, y);

        if (!inSidebar && !inMega) {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
          }
          setHoveredCategory(null);
        }
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [hoveredCategory]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const [megaMenuData, setMegaMenuData] = useState<Record<string, any>>({});
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    fetch('/api/mega-menu')
      .then(res => res.json())
      .then(data => {
        setMegaMenuData(data);
        setLoadingMenu(false);
      })
      .catch((err) => {
        console.error('Failed to load mega menu', err);
        setLoadingMenu(false);
      });
  }, []);

  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);
  
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
            setCategories(data);
          }
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setCategories([]);
      }
    };
    
    fetchDepartments();
    
    // Refresh every 30 seconds to get updates
    const interval = setInterval(fetchDepartments, 30000);
    return () => clearInterval(interval);
  }, []);

  // Find data for hovered category
  const hoveredSlug = categories.find(c => c.name === hoveredCategory)?.slug;
  const activeMenu = hoveredSlug ? megaMenuData[hoveredSlug] : null;

  return (
    <div 
      className="relative"
    >
      <aside
        className="w-64 border-r border-gray-200 bg-white h-[600px] flex flex-col relative z-10"
        ref={sidebarRef}
        onMouseEnter={handlePanelMouseEnter}
      >
        {/* Shop by Department Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full premium-gradient text-white font-semibold py-3 px-4 flex items-center justify-between transition-colors flex-shrink-0"
        >
          <span>Shop by Department</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Category List - Scrollable */}
        <div className={`${isOpen ? 'flex' : 'hidden'} flex-1 overflow-y-auto border-b border-gray-200`}>
          <nav className="w-full py-2">
            {categories.map((category, index) => (
              <div
                key={index}
                onMouseEnter={() => handleMouseEnter(category.name)}
                className="relative"
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex items-center justify-between py-2.5 px-4 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0B1220] transition-colors group"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#0B1220] transition-colors" />
                </Link>
              </div>
            ))}
          </nav>
        </div>

        {/* Peboli More Deals Button */}
        <div className="p-4 flex-shrink-0">
          <Link
            href="/deals"
            className="block w-full bg-red-600 text-white font-semibold py-2.5 px-4 text-center rounded hover:bg-red-700 transition-colors"
          >
            Peboli Splash Deals
          </Link>
        </div>
      </aside>

      {/* Mega Menu Panel */}
      <div 
        className={`hidden lg:block absolute left-64 top-0 h-[600px] w-[800px] bg-white shadow-2xl border border-gray-200 z-50 overflow-y-auto transition-opacity ${
          hoveredCategory && activeMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ marginLeft: '-1px' }}
        ref={megaMenuRef}
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handleMegaMenuMouseLeave}
      >
        {hoveredCategory && activeMenu && (
          <div className="flex h-full">
            {/* Left Section - Categories */}
            <div className="w-64 border-r border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#0B1220] mb-4">{hoveredCategory}</h3>
              <div className="space-y-6">
                {activeMenu.subcategories.map((group: any, idx: number) => (
                  <div key={idx}>
                    <Link
                      href={`/categories/${hoveredSlug}/${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm font-semibold text-[#1A1D29] mb-3 inline-block hover:text-[#0B1220] transition-colors"
                    >
                      {group.title}
                    </Link>
                    {group.links.length > 0 && (
                      <ul className="space-y-2">
                        {group.links.map((link: { name: string; slug: string }) => (
                          <li key={link.slug}>
                            <Link
                              href={`/products/${link.slug}`}
                              className="text-sm text-gray-700 hover:text-[#0B1220] transition-colors block truncate"
                            >
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Section - Featured Stores */}
            <div className="w-48 border-r border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#1A1D29] mb-4">Featured Stores</h3>
              <ul className="space-y-3">
                {activeMenu.featuredStores.map((store: string) => (
                  <li key={store}>
                    <Link
                      href={`/brands/${store.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-gray-700 hover:text-[#0B1220] transition-colors block"
                    >
                      {store}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Section - Featured Product */}
            <div className="flex-1 p-6 bg-gray-50">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <div className="text-xl font-bold text-red-600 mb-2">
                    {activeMenu.featuredProduct.brand}
                  </div>
                  <h4 className="text-base font-semibold text-[#1A1D29] mb-1">
                    {activeMenu.featuredProduct.name}
                  </h4>
                  {activeMenu.featuredProduct.model && (
                    <p className="text-xs text-gray-600 mb-4">
                      {activeMenu.featuredProduct.model}
                    </p>
                  )}
                </div>
                
                {/* Product Image Placeholder */}
                <div className="flex-1 flex items-center justify-center mb-4 bg-white rounded-lg">
                  {activeMenu.featuredProduct.image && activeMenu.featuredProduct.image !== '/products/placeholder.svg' ? (
                     <img 
                       src={activeMenu.featuredProduct.image} 
                       alt={activeMenu.featuredProduct.name} 
                       className="max-h-full max-w-full object-contain"
                     />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      Product Image
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="text-3xl font-bold text-red-600">
                    {activeMenu.featuredProduct.price}
                  </div>
                  <p className="text-xs text-gray-600">T&C's Apply</p>
                  {activeMenu.featuredProduct.validUntil && (
                    <p className="text-xs text-gray-600">
                      Valid until {activeMenu.featuredProduct.validUntil}
                    </p>
                  )}
                  <Link
                    href={`/products/${activeMenu.featuredProduct.slug}`}
                    className="block w-full bg-red-600 text-white font-bold py-3 px-6 text-center rounded hover:bg-red-700 transition-colors"
                  >
                    SHOP NOW
                  </Link>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Exclusive to <span className="font-bold text-black">peboli.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
