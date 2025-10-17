import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  // Функция для рендеринга навигации в зависимости от роли
  const renderNavigation = () => {
    if (!isAuthenticated || !profile) {
      return (
        <>
          <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
            Услуги
          </Link>
          <a href="#" className="text-gray-700 hover:text-primary-600 transition">
            Специалисты
          </a>
          <a href="#" className="text-gray-700 hover:text-primary-600 transition">
            Как это работает
          </a>
        </>
      );
    }

    switch (profile.user_type) {
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 transition">
              Панель управления
            </Link>
            <Link to="/admin/users" className="text-gray-700 hover:text-primary-600 transition">
              Пользователи
            </Link>
            <Link to="/admin/services" className="text-gray-700 hover:text-primary-600 transition">
              Услуги
            </Link>
            <Link to="/chats" className="text-gray-700 hover:text-primary-600 transition">
              Чаты
            </Link>
          </>
        );

      case 'specialist':
        return (
          <>
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Услуги
            </Link>
            <Link to="/specialists" className="text-gray-700 hover:text-primary-600 transition">
              Специалисты
            </Link>
            <Link to="/chats" className="text-gray-700 hover:text-primary-600 transition">
              Чаты
            </Link>
            <a href="#" className="text-gray-700 hover:text-primary-600 transition">
              Как это работает
            </a>
          </>
        );

      case 'client':
      default:
        return (
          <>
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Услуги
            </Link>
            <Link to="/specialists" className="text-gray-700 hover:text-primary-600 transition">
              Специалисты
            </Link>
            <Link to="/chats" className="text-gray-700 hover:text-primary-600 transition">
              Чаты
            </Link>
            <a href="#" className="text-gray-700 hover:text-primary-600 transition">
              Как это работает
            </a>
          </>
        );
    }
  };

  const renderDropdownItems = () => {
    if (!profile) return null;

    return (
      <>
        {/* Profile Info */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            {profile.personal_data.full_name}
          </p>
          <p className="text-xs text-gray-500">{profile.personal_data.email}</p>
        </div>

        {/* Common Items */}
        <button
          onClick={handleProfileClick}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
        >
          <span>👤</span>
          Профиль
        </button>

        <Link
          to="/chats"
          onClick={() => setIsDropdownOpen(false)}
          className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
        >
          <span>💬</span>
          Чаты
        </Link>

        {/* Role-specific Items */}
        {profile.user_type === 'admin' && (
          <>
            <Link
              to="/admin/dashboard"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <span>📊</span>
              Админ панель
            </Link>
            <Link
              to="/admin/users"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <span>👥</span>
              Управление пользователями
            </Link>
          </>
        )}

        {profile.user_type === 'specialist' && (
          <>
            <Link
              to="/specialist/dashboard"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <span>📊</span>
              Панель управления
            </Link>
            <Link
              to="/my-services"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <span>🛠️</span>
              Мои услуги
            </Link>
            <Link
              to="/my-orders"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <span>📋</span>
              Мои заказы
            </Link>
          </>
        )}

        {profile.user_type === 'client' && (
          <>
            <Link
              to="/my-orders"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <span>📋</span>
              Мои заказы
            </Link>
            <Link
              to="/favorites"
              onClick={() => setIsDropdownOpen(false)}
              className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <span>❤️</span>
              Избранное
            </Link>
          </>
        )}

        {/* Common Settings */}
        <button
          onClick={() => {
            setIsDropdownOpen(false);
            navigate('/settings');
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
        >
          <span>⚙️</span>
          Настройки
        </button>

        {/* Divider */}
        <div className="border-t border-gray-100 my-2"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition flex items-center gap-2"
        >
          <span></span>
          Выйти
        </button>
      </>
    );
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary-600">ServiceHub</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {renderNavigation()}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && profile ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition"
                >
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.personal_data.full_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                      {profile.personal_data.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {profile.personal_data.full_name?.split(' ')[0] || 'Пользователь'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {profile.user_type === 'client' 
                        ? 'Клиент' 
                        : profile.user_type === 'specialist' 
                        ? 'Специалист' 
                        : 'Администратор'}
                    </p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-600 transition ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {renderDropdownItems()}
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Войти
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};