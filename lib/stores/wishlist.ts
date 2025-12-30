import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  vendor?: string;
  image?: string;
  categoryHref?: string;
};

type WishlistState = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, patch: Partial<Omit<WishlistItem, 'id'>>) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((i) => i.id === item.id)) {
          return;
        }
        set({ items: [...get().items, item] });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateItem: (id, patch) => {
        set({ items: get().items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'peboli_wishlist',
      version: 1,
    }
  )
);
