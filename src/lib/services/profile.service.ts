import { supabase } from "../supabase/client";
import type { Profile } from "../../types/auth.types";

export class ProfileService {
  /**
   * Обновление профиля
   */
  async updateProfile(
    userId: string,
    updates: Partial<Profile>
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error("Update profile error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Загрузка аватара
   */
  async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileName = `${userId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error("Upload avatar error:", error);
      return { url: null, error: error as Error };
    }
  }

  /**
   * Загрузка обложки профиля
   */
  async uploadCoverImage(
    userId: string,
    file: File
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileName = `${userId}/cover/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error("Upload cover image error:", error);
      return { url: null, error: error as Error };
    }
  }

  /**
   * Загрузка документов (сертификаты, дипломы, лицензии)
   */
  async uploadDocument(
    userId: string,
    file: File,
    type: string
  ): Promise<{ url: string | null; error: Error | null }> {
    try {
      const fileName = `${userId}/${type}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error("Upload document error:", error);
      return { url: null, error: error as Error };
    }
  }

  /**
   * Добавление документа в verification_data
   */
  async addVerificationDocument(
    userId: string,
    document: {
      type: "certificate" | "diploma" | "license" | "other";
      name: string;
      url: string;
      issued_date?: string;
      expiry_date?: string;
      issuer?: string;
    }
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("verification_data")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      const currentDocs = profile.verification_data?.documents || [];
      const updatedDocs = [
        ...currentDocs,
        { id: Date.now().toString(), ...document },
      ];

      const { data, error } = await supabase
        .from("profiles")
        .update({
          verification_data: {
            ...profile.verification_data,
            documents: updatedDocs,
          },
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error("Add verification document error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Удаление документа из verification_data
   */
  async removeVerificationDocument(
    userId: string,
    documentId: string
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("verification_data")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      const currentDocs = profile.verification_data?.documents || [];
      const updatedDocs = currentDocs.filter(
        (doc: any) => doc.id !== documentId
      );

      const { data, error } = await supabase
        .from("profiles")
        .update({
          verification_data: {
            ...profile.verification_data,
            documents: updatedDocs,
          },
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error("Remove verification document error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Обновление социальных ссылок
   */
  async updateSocialLinks(
    userId: string,
    links: Record<string, string>
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ social_links: links })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error("Update social links error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Обновление адреса
   */
  async updateAddress(
    userId: string,
    address: Record<string, any>
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ address })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error("Update address error:", error);
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Обновление локации
   */
  async updateLocation(
    userId: string,
    location: Record<string, any>
  ): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ location })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data as Profile, error: null };
    } catch (error) {
      console.error("Update location error:", error);
      return { profile: null, error: error as Error };
    }
  }
}

export const profileService = new ProfileService();
