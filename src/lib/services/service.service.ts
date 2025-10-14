import { supabase } from '../supabase/client';
import type { Service, Category, ServiceFilters } from '../../types/service.types.ts';

class ServiceService {
  /**
   * Получение всех услуг с фильтрацией
   */
  async getServices(filters?: ServiceFilters): Promise<{ services: Service[]; error: Error | null }> {
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          specialist:profiles!services_specialist_id_fkey(
            id,
            personal_data,
            avatar_url,
            rating,
            review_count
          ),
          category:categories(
            id,
            name,
            slug,
            icon
          )
        `)
        .eq('is_active', true);

      // Применяем фильтры
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }

      if (filters?.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }

      if (filters?.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }

      // Сортировка
      switch (filters?.sort_by) {
        case 'price_asc':
          query = query.order('price', { ascending: true, nullsFirst: false });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false, nullsFirst: false });
          break;
        case 'rating':
          // Сортировка по рейтингу специалиста (требует join)
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('booking_count', { ascending: false });
          break;
        case 'recent':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      return { services: (data || []) as Service[], error: null };
    } catch (error) {
      console.error('Get services error:', error);
      return { services: [], error: error as Error };
    }
  }

  /**
   * Получение одной услуги по ID
   */
  async getServiceById(id: string): Promise<{ service: Service | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          specialist:profiles!services_specialist_id_fkey(
            id,
            personal_data,
            avatar_url,
            rating,
            review_count,
            completed_orders,
            is_verified
          ),
          category:categories(
            id,
            name,
            slug,
            icon,
            description
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Увеличиваем счетчик просмотров
      await supabase
        .from('services')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

      return { service: data as Service, error: null };
    } catch (error) {
      console.error('Get service error:', error);
      return { service: null, error: error as Error };
    }
  }

  /**
   * Получение всех категорий
   */
  async getCategories(): Promise<{ categories: Category[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      return { categories: (data || []) as Category[], error: null };
    } catch (error) {
      console.error('Get categories error:', error);
      return { categories: [], error: error as Error };
    }
  }

  /**
   * Получение подкатегорий
   */
  async getSubcategories(parentId: string): Promise<{ categories: Category[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', parentId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      return { categories: (data || []) as Category[], error: null };
    } catch (error) {
      console.error('Get subcategories error:', error);
      return { categories: [], error: error as Error };
    }
  }

  /**
   * Получение рекомендованных/популярных услуг
   */
  async getFeaturedServices(limit: number = 6): Promise<{ services: Service[]; error: Error | null }> {
    return this.getServices({
      is_featured: true,
      sort_by: 'popular'
    });
  }
}

export const serviceService = new ServiceService();