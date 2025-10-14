import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '../types/auth.types';
import { authService } from '../lib/services/auth.service';

interface AuthStore {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      profile: null,
      isAuthenticated: false,
      isLoading: true,

      setProfile: (profile) => set({ 
        profile, 
        isAuthenticated: !!profile,
        isLoading: false 
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      login: async (email, password) => {
        set({ isLoading: true });
        const { profile, error } = await authService.login({ email, password });
        
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }

        set({ profile, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      register: async (data) => {
        set({ isLoading: true });
        const { profile, error } = await authService.register(data);
        
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }

        set({ profile, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      logout: async () => {
        set({ isLoading: true });
        await authService.logout();
        set({ profile: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        const { profile } = await authService.getCurrentUser();
        set({ profile, isAuthenticated: !!profile, isLoading: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ profile: state.profile, isAuthenticated: state.isAuthenticated })
    }
  )
);