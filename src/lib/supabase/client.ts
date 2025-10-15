import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file or GitHub secrets."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Tables = {
  profiles: {
    Row: {
      id: string;
      user_type: "client" | "specialist" | "admin";
      personal_data: Record<string, any>;
      avatar_url: string | null;
      cover_image_url: string | null;
      bio: string | null;
      rating: number;
      review_count: number;
      completed_orders: number;
      is_verified: boolean;
      verification_data: Record<string, any>;
      location: Record<string, any>;
      address: Record<string, any>;
      social_links: Record<string, any>;
      notification_settings: Record<string, any>;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id: string;
      user_type: "client" | "specialist" | "admin";
      personal_data?: Record<string, any>;
      avatar_url?: string | null;
      bio?: string | null;
    };
    Update: Partial<Tables["profiles"]["Insert"]>;
  };
  services: {
    Row: {
      id: string;
      specialist_id: string;
      category_id: string;
      title: string;
      slug: string;
      description: string | null;
      price_type: "fixed" | "hourly" | "package" | "custom";
      price: number | null;
      currency: string;
      duration_minutes: number | null;
      package_options: Record<string, any>;
      characteristics: Record<string, any>;
      gallery: string[];
      is_active: boolean;
      is_featured: boolean;
      view_count: number;
      booking_count: number;
      created_at: string;
      updated_at: string;
    };
  };
  categories: {
    Row: {
      id: string;
      parent_id: string | null;
      name: string;
      slug: string;
      icon: string | null;
      description: string | null;
      meta_title: string | null;
      meta_description: string | null;
      sort_order: number;
      is_active: boolean;
      characteristics_schema: Record<string, any>;
      created_at: string;
    };
  };
  orders: {
    Row: {
      id: string;
      order_number: number;
      client_id: string;
      specialist_id: string;
      service_id: string;
      status: string;
      order_details: Record<string, any>;
      scheduled_date: string | null;
      duration_minutes: number | null;
      total_amount: number | null;
      commission_amount: number;
      payout_amount: number;
      client_address: Record<string, any>;
      specialist_notes: string | null;
      client_notes: string | null;
      cancellation_reason: string | null;
      rating_by_client: number | null;
      rating_by_specialist: number | null;
      created_at: string;
      updated_at: string;
      completed_at: string | null;
    };
  };
};
