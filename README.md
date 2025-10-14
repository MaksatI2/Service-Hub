# 🎯 ServiceHub - Платформа для поиска и оказания услуг

## 📋 Описание проекта

ServiceHub - это двусторонняя маркетплейс-платформа, которая соединяет специалистов с клиентами, предоставляя полный цикл взаимодействия от поиска до выполнения заказа.

## 🏗️ Архитектура проекта

### Технологический стек

**Frontend:**
- React 18 + TypeScript
- Vite (сборщик)
- Tailwind CSS (стилизация)
- Zustand (state management)
- React Router DOM (роутинг)
- React Hook Form + Zod (формы и валидация)

**Backend:**
- Supabase (PostgreSQL, Auth, Storage, Realtime)

## 📁 Структура проекта

```
servicehub/
├── src/
│   ├── types/                    # TypeScript типы
│   │   ├── auth.types.ts        # Типы аутентификации и профилей
│   │   └── service.types.ts     # Типы услуг и категорий
│   │
│   ├── lib/                      # Библиотеки и утилиты
│   │   ├── supabase/
│   │   │   └── client.ts        # Клиент Supabase + типы БД
│   │   └── services/            # API сервисы
│   │       ├── auth.service.ts  # Сервис аутентификации
│   │       └── service.service.ts # Сервис работы с услугами
│   │
│   ├── store/                    # Zustand хранилища
│   │   └── auth.store.ts        # Store аутентификации
│   │
│   ├── pages/                    # Страницы приложения
│   │   ├── auth/
│   │   │   ├── Login.tsx        # Страница входа
│   │   │   └── Register.tsx     # Страница регистрации
│   │   └── Home.tsx             # Главная страница с каталогом
│   │
│   ├── App.tsx                   # Главный компонент с роутингом
│   └── main.tsx                  # Точка входа
│
├── .env.example                  # Пример переменных окружения
├── tailwind.config.js           # Конфигурация Tailwind
└── package.json                 # Зависимости проекта
```

## 🗄️ Структура базы данных

### Основные таблицы

#### 1. **profiles** - Профили пользователей
```sql
- id (UUID, PK)
- user_type (ENUM: 'client', 'specialist', 'admin')
- personal_data (JSONB) - email, full_name, phone
- avatar_url, cover_image_url, bio
- rating, review_count, completed_orders
- is_verified, verification_data
- location, address, social_links
- notification_settings
```

#### 2. **categories** - Категории услуг
```sql
- id (UUID, PK)
- parent_id (UUID, FK) - для иерархии
- name, slug, icon, description
- meta_title, meta_description
- sort_order, is_active
- characteristics_schema (JSONB)
```

#### 3. **services** - Услуги специалистов
```sql
- id (UUID, PK)
- specialist_id (UUID, FK → profiles)
- category_id (UUID, FK → categories)
- title, slug, description
- price_type ('fixed', 'hourly', 'package', 'custom')
- price, currency, duration_minutes
- package_options, characteristics (JSONB)
- gallery (JSONB массив URL)
- is_active, is_featured
- view_count, booking_count
```

#### 4. **orders** - Заказы
```sql
- id (UUID, PK)
- order_number (SERIAL)
- client_id, specialist_id, service_id (FK)
- status (ENUM: 12 статусов)
- order_details (JSONB)
- scheduled_date, duration_minutes
- total_amount, commission_amount, payout_amount
- ratings (rating_by_client, rating_by_specialist)
```

#### 5. **reviews** - Отзывы
```sql
- id (UUID, PK)
- order_id, author_id, target_id (FK)
- ratings (JSONB) - качество, сроки, коммуникация
- comment, photos (JSONB)
- is_verified, moderation_status
- response_text (ответ специалиста)
```

#### 6. **messages** - Сообщения
```sql
- id (UUID, PK)
- order_id, sender_id, receiver_id (FK)
- message_type ('text', 'image', 'file', 'system')
- content, attachment_url
- read_by (JSONB), read_at
```

#### 7. **notifications** - Уведомления
```sql
- id (UUID, PK)
- user_id (FK)
- type, title, content
- action_url, metadata (JSONB)
- channels (JSONB)
- sent_at, read_at
```

## 🔧 Настройка проекта

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Настройка Supabase

1. Создайте проект в [Supabase](https://supabase.com)
2. Выполните SQL скрипт из вашей схемы БД
3. Настройте Authentication providers (опционально для OAuth)

### 4. Запуск проекта

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🔐 Аутентификация

### Текущая реализация

✅ **Реализовано:**
- Регистрация с выбором роли (клиент/специалист)
- Вход по email/password
- Автоматическое сохранение сессии
- Protected routes для авторизованных пользователей

🔜 **Планируется (заготовки готовы):**
- OAuth через GitHub
- OAuth через Google
- Восстановление пароля
- Верификация email

### Использование

```typescript
// В компоненте
import { useAuthStore } from '@/store/auth.store';

const MyComponent = () => {
  const { profile, isAuthenticated, login, logout } = useAuthStore();
  
  // Проверка авторизации
  if (!isAuthenticated) return <Login />;
  
  // Доступ к данным пользователя
  console.log(profile.personal_data.full_name);
  console.log(profile.user_type); // 'client' | 'specialist' | 'admin'
};
```

## 📡 API Сервисы

### AuthService

```typescript
import { authService } from '@/lib/services/auth.service';

// Регистрация
const { profile, error } = await authService.register({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'Иван Иванов',
  user_type: 'client',
  phone: '+996700123456'
});

// Вход
const { profile, error } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Выход
await authService.logout();

// Получить текущего пользователя
const { profile } = await authService.getCurrentUser();
```

### ServiceService

```typescript
import { serviceService } from '@/lib/services/service.service';

// Получить все услуги с фильтрами
const { services, error } = await serviceService.getServices({
  category_id: 'uuid',
  min_price: 1000,
  max_price: 5000,
  search: 'ремонт',
  sort_by: 'price_asc'
});

// Получить одну услугу
const { service } = await serviceService.getServiceById('uuid');

// Получить категории
const { categories } = await serviceService.getCategories();

// Получить подкатегории
const { categories } = await serviceService.getSubcategories('parent_uuid');
```

## 🎨 Дизайн-система

### Цветовая палитра

```css
/* Primary Colors (Синий) */
--primary-500: #0ea5e9
--primary-600: #0284c7
--primary-700: #0369a1

/* Secondary Colors (Фиолетовый) */
--secondary-500: #8b5cf6
--secondary-600: #7c3aed

/* Semantic Colors */
--success-500: #10b981
--warning-500: #f59e0b
--error-500: #ef4444
```

### Типография

- Шрифт: **Inter** (Google Fonts)
- Заголовки: 32px, 24px, 20px, 18px
- Текст: 16px (base), 14px (small), 12px (xs)

### Компоненты

Все компоненты используют Tailwind CSS классы. Примеры:

```tsx
// Кнопка Primary
<button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">

// Карточка
<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition border">

// Input
<input className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
```

## 🚀 Развертывание

### Vercel (рекомендуется)

1. Подключите GitHub репозиторий к Vercel
2. Добавьте переменные окружения
3. Vercel автоматически определит Vite и выполнит сборку

### Другие платформы

```bash
npm run build
# Результат в папке dist/
```

## 📝 TODO - Следующие этапы

### Высокий приоритет
- [ ] Детальная страница услуги
- [ ] Профиль специалиста
- [ ] Система бронирования/создания заказов
- [ ] Личный кабинет клиента
- [ ] Личный кабинет специалиста

### Средний приоритет
- [ ] Чат между клиентом и специалистом (Realtime)
- [ ] Система отзывов и рейтингов
- [ ] Система уведомлений
- [ ] Фильтры и поиск (расширенные)
- [ ] Календарь доступности специалиста

### Низкий приоритет
- [ ] OAuth (GitHub, Google)
- [ ] Платежная система (Stripe/ЮKassa)
- [ ] Админ-панель
- [ ] Аналитика и отчеты
- [ ] Мобильное приложение

## 🤝 Контакты и поддержка

- Документация Supabase: https://supabase.com/docs
- Документация React: https://react.dev
- Документация Tailwind: https://tailwindcss.com

---

**Версия:** 0.1.0  
**Статус:** В разработке  
**Последнее обновление:** 2025