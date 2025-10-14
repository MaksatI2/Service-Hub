export type UserType = 'client' | 'specialist' | 'admin';

export interface Profile {
  id: string;
  user_type: UserType;
  personal_data: {
    email?: string;
    full_name?: string;
    phone?: string;
    [key: string]: any;
  };
  avatar_url?: string;
  cover_image_url?: string;
  bio?: string;
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
}

export interface AuthState {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  user_type: UserType;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  profile: Profile;
  session: {
    access_token: string;
    refresh_token: string;
  };
}