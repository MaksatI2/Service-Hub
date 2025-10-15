export interface Category {
  id: string;
  parent_id?: string | null;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  sort_order: number;
  is_active: boolean;
  characteristics_schema: Record<string, any>;
  created_at: string;
}

export interface CategoryWithChildren extends Category {
  children?: Category[];
  services_count?: number;
}

export type PriceType = "fixed" | "hourly" | "package" | "custom";

export interface Service {
  id: string;
  specialist_id: string;
  category_id: string;
  title: string;
  slug: string;
  description?: string | null;
  price_type: PriceType;
  price?: number | null;
  currency: string;
  duration_minutes?: number | null;
  package_options: PackageOptions;
  characteristics: ServiceCharacteristics;
  gallery: string[];
  is_active: boolean;
  is_featured: boolean;
  view_count: number;
  booking_count: number;
  created_at: string;
  updated_at: string;

  specialist?: SpecialistInfo;
  category?: Category;
}

export interface SpecialistInfo {
  id: string;
  personal_data: {
    full_name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  avatar_url?: string | null;
  cover_image_url?: string | null;
  bio?: string | null;
  rating: number;
  review_count: number;
  completed_orders: number;
  is_verified: boolean;
  location?: Record<string, any>;
  social_links?: Record<string, any>;
}

export interface PackageOptions {
  basic?: {
    name: string;
    price: number;
    description?: string;
    features: string[];
  };
  standard?: {
    name: string;
    price: number;
    description?: string;
    features: string[];
  };
  premium?: {
    name: string;
    price: number;
    description?: string;
    features: string[];
  };
  [key: string]: any;
}

export interface ServiceCharacteristics {
  experience_years?: number;
  languages?: string[];
  service_area?: string[];
  availability?: {
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
  };
  [key: string]: any;
}

export type SortBy =
  | "price_asc"
  | "price_desc"
  | "rating"
  | "recent"
  | "popular"
  | "booking_count";

export interface ServiceFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: SortBy;
  is_featured?: boolean;
  price_type?: PriceType;
  specialist_id?: string;
  location?: string;
  rating_min?: number;
  page?: number;
  limit?: number;
}

export interface ServiceSearchResult {
  services: Service[];
  total_count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface CreateServiceData {
  category_id: string;
  title: string;
  description?: string;
  price_type: PriceType;
  price?: number;
  currency?: string;
  duration_minutes?: number;
  package_options?: PackageOptions;
  characteristics?: ServiceCharacteristics;
  gallery?: string[];
  is_active?: boolean;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string;
}

export interface ServiceStats {
  total_views: number;
  total_bookings: number;
  average_rating: number;
  review_count: number;
  revenue_total: number;
  revenue_this_month: number;
  conversion_rate: number;
}

export interface FavoriteService {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
  service?: Service;
}

export interface ServiceReview {
  id: string;
  order_id: string;
  author_id: string;
  target_id: string;
  ratings: {
    quality?: number;
    deadlines?: number;
    communication?: number;
    price_quality?: number;
    overall?: number;
  };
  comment?: string | null;
  photos?: string[];
  is_verified: boolean;
  moderation_status: "pending" | "approved" | "rejected";
  moderator_notes?: string | null;
  response_text?: string | null;
  response_created_at?: string | null;
  created_at: string;
  updated_at: string;

  author?: {
    id: string;
    personal_data: {
      full_name?: string;
    };
    avatar_url?: string | null;
  };
}

export type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "paid"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "refunded"
  | "disputed"
  | "archived";

export interface ServiceOrder {
  id: string;
  order_number: number;
  client_id: string;
  specialist_id: string;
  service_id: string;
  status: OrderStatus;
  order_details: Record<string, any>;
  scheduled_date?: string | null;
  duration_minutes?: number | null;
  total_amount?: number | null;
  commission_amount: number;
  payout_amount: number;
  client_address: Record<string, any>;
  specialist_notes?: string | null;
  client_notes?: string | null;
  cancellation_reason?: string | null;
  rating_by_client?: number | null;
  rating_by_specialist?: number | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;

  service?: Service;
  client?: SpecialistInfo;
  specialist?: SpecialistInfo;
}

export interface ServiceImage {
  id: string;
  url: string;
  thumbnail_url?: string;
  alt?: string;
  order: number;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface ServiceAvailability {
  date: string;
  slots: {
    start_time: string;
    end_time: string;
    is_available: boolean;
  }[];
}

export const PRICE_TYPES: Record<PriceType, string> = {
  fixed: "Фиксированная цена",
  hourly: "Почасовая оплата",
  package: "Пакеты услуг",
  custom: "Договорная цена",
};

export const CURRENCIES = {
  KGS: "Сом",
  USD: "$",
  EUR: "€",
  RUB: "₽",
} as const;

export const DEFAULT_SERVICE_LIMIT = 12;
export const MAX_SERVICE_IMAGES = 10;
export const MIN_SERVICE_PRICE = 0;
export const MAX_SERVICE_TITLE_LENGTH = 200;
export const MAX_SERVICE_DESCRIPTION_LENGTH = 5000;
