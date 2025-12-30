import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AdminAuthState = {
  isAuthed: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;
};

const PASSCODE = 'PEBOLI-TEAM';

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthed: false,
      login: (passcode) => {
        const ok = passcode.trim() === PASSCODE;
        if (ok) {
          set({ isAuthed: true });
        }
        return ok;
      },
      logout: () => set({ isAuthed: false }),
    }),
    { name: 'peboli_admin_auth', version: 1 }
  )
);
