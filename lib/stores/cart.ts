import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  vendor?: string;
  image?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  updateItem: (id: string, patch: Partial<Omit<CartItem, 'id'>>) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const qty = Math.max(1, item.qty ?? 1);
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)),
          });
          return;
        }
        set({ items: [...get().items, { ...item, qty }] });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) => {
        const nextQty = Math.max(1, Math.floor(qty || 1));
        set({ items: get().items.map((i) => (i.id === id ? { ...i, qty: nextQty } : i)) });
      },
      updateItem: (id, patch) => {
        set({ items: get().items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'peboli_cart',
      version: 1,
    }
  )
);
