import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useLocation } from 'react-router-dom';

export const Login: React.FC = () => {
  const location = useLocation();
  const fromRegister = location.state?.fromRegister;
  const navigate = useNavigate();
  const { login, isLoading, setNotification, notification } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {fromRegister && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-3 max-w-md bg-blue-500">
            <span className="text-xl">📧</span>
            <span>
              Письмо с подтверждением отправлено на вашу почту.
              Подтвердите его, чтобы войти в аккаунт.
            </span>
          </div>
        </div>
      )}
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-3 max-w-md ${notification.type === 'success'
            ? 'bg-green-500'
            : 'bg-red-500'
            }`}>
            <span className="text-xl">
              {notification.type === 'success' ? '✓' : '✕'}
            </span>
            <span>{notification.message}</span>
            <button
              onClick={handleNotificationClose}
              className="ml-2 text-white hover:opacity-80 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">ServiceHub</h1>
            <h2 className="text-2xl font-bold text-gray-900">Вход в аккаунт</h2>
            <p className="mt-3 text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link to="/auth/register" className="font-semibold text-primary-600 hover:text-primary-500 transition">
                Создайте новый
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email адрес
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="example@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Пароль
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500 transition">
                  Забыли пароль?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Запомнить меня
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600 transition"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Вход...
                </div>
              ) : (
                'Войти'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Или продолжить с</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span className="mr-2">Google</span>
              <span className="text-xs text-gray-400">(скоро)</span>
            </button>
            <button
              type="button"
              disabled
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <span className="mr-2">GitHub</span>
              <span className="text-xs text-gray-400">(скоро)</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            Продолжая, вы согласны с нашими{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Условиями
            </a>
            {' '}и{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500">
              Политикой
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};