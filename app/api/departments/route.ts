import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTING_KEY = 'departments';

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SETTING_KEY },
    });

    const headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    console.log('[API /api/departments] Setting found:', setting ? 'yes' : 'no');
    console.log('[API /api/departments] Raw setting:', setting ? JSON.stringify(setting, null, 2) : 'null');
    
    if (setting && setting.value !== null && setting.value !== undefined) {
      // Prisma JSON fields can be string, array, or object
      let departments: Array<{ name: string; slug: string; icon?: string; productCount?: number }> = [];
      
      try {
        // Handle different Prisma Json type representations
        if (typeof setting.value === 'string') {
          // If it's a string, parse it
          const parsed = JSON.parse(setting.value);
          departments = Array.isArray(parsed) ? parsed : [];
        } else if (Array.isArray(setting.value)) {
          // If it's already an array, use it directly
          departments = setting.value as Array<{ name: string; slug: string; icon?: string }>;
        } else if (typeof setting.value === 'object' && setting.value !== null) {
          // If it's an object, check if it has a departments property or is the array itself
          if (Array.isArray((setting.value as any).departments)) {
            departments = (setting.value as any).departments;
          } else if (Array.isArray(setting.value)) {
            departments = setting.value as Array<{ name: string; slug: string; icon?: string }>;
          } else {
            // Try to convert object to array if it looks like an array-like object
            const keys = Object.keys(setting.value);
            if (keys.length > 0 && keys.every(k => !isNaN(Number(k)))) {
              // It's an array-like object (e.g., {0: {...}, 1: {...}})
              departments = Object.values(setting.value) as Array<{ name: string; slug: string; icon?: string }>;
            }
          }
        }
        
        // Validate that departments is an array with the right structure
        if (!Array.isArray(departments)) {
          console.error('[API /api/departments] Parsed value is not an array:', departments);
          departments = [];
        } else {
          // Filter out invalid entries
          departments = departments.filter(d => d && typeof d === 'object' && d.name && d.slug);

          // Get product counts for each department
          try {
            const departmentsWithCounts = await Promise.all(departments.map(async (dept) => {
              try {
                // Count active products in this category
                // using 'as any' for where clause to handle potential type mismatches with enum
                const count = await prisma.product.count({
                  where: {
                    category: { slug: dept.slug },
                    status: 'ACTIVE'
                  } as any
                });
                return { ...dept, productCount: count };
              } catch (countError) {
                console.warn(`[API /api/departments] Failed to count products for ${dept.slug}:`, countError);
                return { ...dept, productCount: 0 };
              }
            }));
            
            departments = departmentsWithCounts;
          } catch (e) {
            console.error('[API /api/departments] Failed to process product counts:', e);
            // Continue with original departments if parallel fetching fails
          }
        }
      } catch (e: any) {
        console.error('[API /api/departments] Failed to parse setting value:', e);
        console.error('[API /api/departments] Error details:', e.message);
        departments = [];
      }
      
      console.log('[API /api/departments] Parsed departments:', JSON.stringify(departments, null, 2));
      console.log('[API /api/departments] Departments count:', departments.length);
      console.log('[API /api/departments] Raw setting value type:', typeof setting.value);
      console.log('[API /api/departments] Is array check:', Array.isArray(setting.value));
      
      if (departments.length > 0) {
        return NextResponse.json(departments, { headers });
      } else {
        console.warn('[API /api/departments] Setting exists but departments array is empty');
      }
    }

    // Return empty array if not found or empty (NO MOCK DATA)
    console.log('[API /api/departments] No setting found or empty, returning empty array');
    return NextResponse.json([], { headers });
  } catch (error: any) {
    console.error('[API /api/departments] Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

