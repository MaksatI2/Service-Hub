import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "../types/auth.types";
import { authService } from "../lib/services/auth.service";

interface AuthStore {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notification: { type: "success" | "error"; message: string } | null;

  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setNotification: (
    notification: { type: "success" | "error"; message: string } | null
  ) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
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
      notification: null,

      setProfile: (profile) =>
        set({
          profile,
          isAuthenticated: !!profile,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setNotification: (notification) => set({ notification }),

      login: async (email, password) => {
        set({ isLoading: true });

        if (!email || !password) {
          set({ isLoading: false });
          const errorMsg = "Заполните все поля";
          set({ notification: { type: "error", message: errorMsg } });
          return { success: false, error: errorMsg };
        }

        if (email.length < 5 || !email.includes("@")) {
          set({ isLoading: false });
          const errorMsg = "Введите корректный email";
          set({ notification: { type: "error", message: errorMsg } });
          return { success: false, error: errorMsg };
        }

        if (password.length < 6) {
          set({ isLoading: false });
          const errorMsg = "Пароль должен быть не менее 6 символов";
          set({ notification: { type: "error", message: errorMsg } });
          return { success: false, error: errorMsg };
        }

        const { profile, error } = await authService.login({ email, password });

        if (error) {
          set({ isLoading: false });
          const errorMsg =
            error.message || "Ошибка входа. Проверьте email и пароль";
          set({ notification: { type: "error", message: errorMsg } });
          return { success: false, error: errorMsg };
        }

        set({
          profile,
          isAuthenticated: true,
          isLoading: false,
          notification: {
            type: "success",
            message: `Добро пожаловать, ${profile?.personal_data.full_name}!`,
          },
        });
        return { success: true };
      },

      register: async (data) => {
        set({ isLoading: true });

        const { error } = await authService.register({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          phone: data.phone,
          user_type: data.user_type,
        });

        set({ 
          isLoading: false,
          profile: null,
          isAuthenticated: false,
          notification: null
        });

        if (error) {
          const errorMsg = error.message || "Ошибка регистрации";
          return { success: false, error: errorMsg };
        }

        return { success: true };
      },

      logout: async () => {
        set({ isLoading: true });
        await authService.logout();
        set({
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          notification: { type: "success", message: "Вы вышли из аккаунта" },
        });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { profile, error } = await authService.getCurrentUser();
          if (error) {
            console.error("CheckAuth error:", error);
            set({ profile: null, isAuthenticated: false, isLoading: false });
            return;
          }
          set({ profile, isAuthenticated: !!profile, isLoading: false });
        } catch (error) {
          console.error("CheckAuth error:", error);
          set({ profile: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);