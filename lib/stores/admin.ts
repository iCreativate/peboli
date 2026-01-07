import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  image?: string;
  images?: string[];
  isSplashSale?: boolean;
  origin?: 'Local' | 'International';
  standardDeliveryPrice?: number;
  expressDeliveryPrice?: number;
  description?: string;
};

export type HeroSettings = {
  title: string;
  subtitle: string;
  imageUrls: string[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type Department = {
  name: string;
  slug: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  website?: string;
  description?: string;
  category?: string; // e.g. Electronics, Fashion
};

export type Collection = {
  id: string;
  name: string;
  href: string;
  color?: string; // Hex color for text highlight
};

type AdminState = {
  hero: HeroSettings;
  products: AdminProduct[];
  departments: Department[];
  collections: Collection[];
  brands: Brand[];
  theme: {
    primaryColor: string;
    accentColor: string;
    successColor: string;
  };
  setHero: (patch: Partial<HeroSettings>) => void;
  addProduct: (p: AdminProduct) => void;
  updateProduct: (id: string, patch: Partial<Omit<AdminProduct, 'id'>>) => void;
  deleteProduct: (id: string) => void;
  addDepartment: (d: Department) => void;
  updateDepartment: (slug: string, patch: Partial<Department>) => void;
  deleteDepartment: (slug: string) => void;
  moveDepartment: (slug: string, direction: 'up' | 'down') => void;
  addCollection: (c: Collection) => void;
  updateCollection: (id: string, patch: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  moveCollection: (id: string, direction: 'up' | 'down') => void;

  addBrand: (b: Brand) => void;
  updateBrand: (id: string, patch: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  
  updateTheme: (updates: Partial<{ primaryColor: string; accentColor: string; successColor: string }>) => void;
};

const DEFAULT_HERO: HeroSettings = {
  title: 'Best deals. Zero hassle.',
  subtitle: 'Discover premium picks and splash sales across top categories.',
  imageUrls: [],
  ctaLabel: 'Shop Now',
  ctaHref: '/deals',
};

const DEFAULT_COLLECTIONS: Collection[] = [
  { id: 'new-arrivals', name: 'New Arrivals', href: '/new' },
  { id: 'christmas', name: 'Christmas', href: '/christmas' },
  { id: 'summer', name: 'Summer', href: '/summer' },
  { id: 'deals', name: 'Deals & Promotions', href: '/deals' },
  { id: 'liquor', name: 'Festive Liquor', href: '/liquor' },
  { id: 'brands', name: 'Brands Store', href: '/brands' },
  { id: 'splash', name: 'PeboliSPLASH', href: '/more', color: '#db2777' }, // pink-600
  { id: 'clearance', name: 'Clearance', href: '/clearance' },
];

const DEFAULT_DEPARTMENTS: Department[] = [
  { name: 'Appliances', slug: 'appliances' },
  { name: 'Automotive & DIY', slug: 'automotive-diy' },
  { name: 'Baby & Toddler', slug: 'baby-toddler' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Books & Courses', slug: 'books-courses' },
  { name: 'Camping & Outdoor', slug: 'camping-outdoor' },
  { name: 'Clothing & Shoes', slug: 'clothing-shoes' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Gaming & Media', slug: 'gaming-media' },
  { name: 'Garden, Pool & Patio', slug: 'garden-pool-patio' },
  { name: 'Groceries & Household', slug: 'groceries-household' },
  { name: 'Health & Personal Care', slug: 'health-personal-care' },
  { name: 'Homeware', slug: 'homeware' },
  { name: 'Liquor', slug: 'liquor' },
  { name: 'Office & Stationery', slug: 'office-stationery' },
  { name: 'Pets', slug: 'pets' },
  { name: 'Sport & Training', slug: 'sport-training' },
  { name: 'Toys', slug: 'toys' },
];

const DEFAULT_BRANDS: Brand[] = [
  'Samsung', 'Apple', 'Sony', 'LG', 'Nike', 'Adidas', 'Dyson', 'Canon', 'Maybelline', "L'Oréal"
].map(name => ({
  id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
  name,
  slug: name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
}));

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      hero: DEFAULT_HERO,
      products: [],
      departments: DEFAULT_DEPARTMENTS,
      collections: DEFAULT_COLLECTIONS,
      brands: DEFAULT_BRANDS,
      theme: {
        primaryColor: '#0B1220', // Default Peboli Navy
        accentColor: '#FF6B4A',  // Default Coral
        successColor: '#00C48C', // Default Green
      },
      setHero: (patch) => set({ hero: { ...get().hero, ...patch } }),
      addProduct: (p) => set({ products: [p, ...get().products] }),
      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      addDepartment: (dept) =>
        set((state) => ({ departments: [...state.departments, dept] })),
      updateDepartment: (slug, updates) =>
        set((state) => {
          const deptIndex = state.departments.findIndex((d) => d.slug === slug);
          if (deptIndex === -1) return state;
          const updated = { ...state.departments[deptIndex], ...updates };
          const newDepartments = [...state.departments];
          newDepartments[deptIndex] = updated;
          return { departments: newDepartments };
        }),
      deleteDepartment: (slug) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.slug !== slug),
        })),
      moveDepartment: (slug, direction) =>
        set((state) => {
          const idx = state.departments.findIndex((d) => d.slug === slug);
          if (idx === -1) return {};
          const newDepts = [...state.departments];
          if (direction === 'up' && idx > 0) {
            [newDepts[idx], newDepts[idx - 1]] = [newDepts[idx - 1], newDepts[idx]];
          } else if (direction === 'down' && idx < newDepts.length - 1) {
            [newDepts[idx], newDepts[idx + 1]] = [newDepts[idx + 1], newDepts[idx]];
          }
          return { departments: newDepts };
        }),

      addCollection: (col) => set((state) => ({ collections: [...state.collections, col] })),
      updateCollection: (id, updates) =>
        set((state) => {
          const colIndex = state.collections.findIndex((c) => c.id === id);
          if (colIndex === -1) return state;
          const updated = { ...state.collections[colIndex], ...updates };
          const newCollections = [...state.collections];
          newCollections[colIndex] = updated;
          return { collections: newCollections };
        }),
      deleteCollection: (id) =>
        set((state) => ({ collections: state.collections.filter((c) => c.id !== id) })),
      moveCollection: (id, direction) =>
        set((state) => {
          const idx = state.collections.findIndex((c) => c.id === id);
          if (idx === -1) return {};
          const newCols = [...state.collections];
          if (direction === 'up' && idx > 0) {
            [newCols[idx], newCols[idx - 1]] = [newCols[idx - 1], newCols[idx]];
          } else if (direction === 'down' && idx < newCols.length - 1) {
            [newCols[idx], newCols[idx + 1]] = [newCols[idx + 1], newCols[idx]];
          }
          return { collections: newCols };
        }),

      addBrand: (b) => set((state) => ({ brands: [...state.brands, b] })),
      updateBrand: (id, updates) =>
        set((state) => ({
          brands: state.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBrand: (id) =>
        set((state) => ({ brands: state.brands.filter((b) => b.id !== id) })),

      updateTheme: (updates) => set({ theme: { ...get().theme, ...updates } }),
    }),
    {
      name: 'peboli_admin',
      version: 7,
      migrate: (persistedState: unknown) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState;
        }
        const stateObj = persistedState as {
          products?: unknown;
          hero?: { title?: unknown; subtitle?: unknown; imageUrls?: unknown; imageUrl?: unknown; ctaLabel?: unknown; ctaHref?: unknown };
          departments?: unknown;
          collections?: unknown;
        };
        const products = Array.isArray(stateObj.products) ? stateObj.products : [];
        const hero = stateObj.hero || {};
        const imageUrls: string[] = Array.isArray(hero.imageUrls)
          ? hero.imageUrls
          : (typeof hero.imageUrl === 'string' && hero.imageUrl.trim()
              ? [hero.imageUrl]
              : []);
        const departments: Department[] = Array.isArray(stateObj.departments)
          ? (stateObj.departments as Department[]).map((d) => {
              const name = typeof (d as any).name === 'string' ? (d as any).name : '';
              const slug = typeof (d as any).slug === 'string' ? (d as any).slug : '';
              if (!name) return null as unknown as Department;
              return { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').replace(/,+/g, '') };
            }).filter(Boolean)
          : DEFAULT_DEPARTMENTS;
        const collections: Collection[] = Array.isArray(stateObj.collections)
          ? (stateObj.collections as Collection[])
          : DEFAULT_COLLECTIONS;
        return {
          ...(stateObj as object),
          hero: {
            title: typeof hero.title === 'string' ? hero.title : DEFAULT_HERO.title,
            subtitle: typeof hero.subtitle === 'string' ? hero.subtitle : DEFAULT_HERO.subtitle,
            imageUrls,
            ctaLabel: typeof hero.ctaLabel === 'string' ? hero.ctaLabel : DEFAULT_HERO.ctaLabel,
            ctaHref: typeof hero.ctaHref === 'string' ? hero.ctaHref : DEFAULT_HERO.ctaHref,
          },
          products: products.map((p) => {
            const prod = p as {
              description?: unknown;
            };
            return {
              ...(p as object),
              description: typeof prod.description === 'string' ? prod.description : undefined,
            };
          }),
          departments,
          collections,
        };
      },
    }
  )
);
