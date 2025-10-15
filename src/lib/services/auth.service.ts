import { supabase } from "../supabase/client";
import type { RegisterData, LoginData, Profile } from "../../types/auth.types";

class AuthService {
  /**
   * Регистрация нового пользователя
   */
  async register(
    data: RegisterData
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            user_type: data.user_type,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Ошибка создания пользователя");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          user_type: data.user_type,
          personal_data: {
            email: data.email,
            full_name: data.full_name,
            phone: data.phone || null,
          },
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return { profile: profileData as Profile, error: null };
    } catch (error) {
      console.error("Register error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Вход в систему
   */
  async login(
    data: LoginData
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Ошибка входа");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) throw profileError;

      return { profile: profileData as Profile, error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      return { error: error as Error };
    }
  }

  /**
   * Получение текущего пользователя
   */
  async getCurrentUser(): Promise<{
    profile: Profile | null;
    error: Error | null;
  }> {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!authUser) return { profile: null, error: null };

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError) throw profileError;

      return { profile: profileData as Profile, error: null };
    } catch (error) {
      console.error("Get current user error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Вход через OAuth (GitHub, Google) - задел на будущее
   */
  async signInWithOAuth(provider: "github" | "google") {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("OAuth error:", error);
      return { data: null, error: error as Error };
    }
  }
}

export const authService = new AuthService();
