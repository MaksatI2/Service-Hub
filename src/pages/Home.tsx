import React, { useEffect, useState } from 'react';
import { serviceService } from '../lib/services/service.service';
import type { Service, Category } from '../types/service.types.ts';

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadServices();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setIsLoading(true);

    const { categories: cats } = await serviceService.getCategories();
    setCategories(cats);

    await loadServices();

    setIsLoading(false);
  };

  const loadServices = async () => {
    const { services: servs } = await serviceService.getServices({
      category_id: selectedCategory,
      search: searchQuery || undefined
    });
    setServices(servs);
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(price);
    switch (type) {
      case 'hourly':
        return `${formatted} сом/час`;
      case 'package':
        return `от ${formatted} сом`;
      default:
        return `${formatted} сом`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Найдите нужную услугу за минуты
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Тысячи проверенных специалистов готовы помочь вам
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Поиск услуг..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button className="px-8 py-4 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 font-medium">
                  Найти
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${!selectedCategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Все категории
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Доступные услуги
              {services.length > 0 && (
                <span className="ml-2 text-gray-500 text-lg font-normal">
                  ({services.length})
                </span>
              )}
            </h3>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Сортировка</option>
              <option value="price_asc">Цена: по возрастанию</option>
              <option value="price_desc">Цена: по убыванию</option>
              <option value="rating">По рейтингу</option>
              <option value="recent">Новые</option>
            </select>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Услуги не найдены</p>
              <p className="text-gray-400 mt-2">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 overflow-hidden"
                >
                  {/* Service Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-4xl">🛠️</span>
                  </div>

                  <div className="p-6">
                    {/* Category Badge */}
                    {service.category && (
                      <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full mb-3">
                        {service.category.name}
                      </span>
                    )}

                    {/* Title */}
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {service.title}
                    </h4>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Specialist Info */}
                    {service.specialist && (
                      <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
                        {service.specialist.avatar_url ? (
                          <img
                            src={service.specialist.avatar_url}
                            alt={service.specialist.personal_data.full_name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                            {service?.specialist?.personal_data?.full_name ? service.specialist.personal_data.full_name.charAt(0).toUpperCase() : ''}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {service.specialist.personal_data.full_name}
                          </p>
                          {service.specialist.rating && (
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600 ml-1">
                                {service.specialist.rating.toFixed(1)}
                              </span>
                              {/* {service.specialist.review_count && (
                                <span className="text-sm text-gray-400 ml-1">
                                  ({service.specialist.review_count})
                                </span>
                              )} */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Price & Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(service.price ?? 0, service.price_type)}
                        </p>
                        {service.duration_minutes && (
                          <p className="text-xs text-gray-500 mt-1">
                            Длительность: {service.duration_minutes} мин
                          </p>
                        )}
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm">
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">© 2025 ServiceHub. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};