import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { profileService } from '../lib/services/profile.service';
import type { Profile } from '../types/auth.types';

export const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'documents' | 'social'>('general');

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Пожалуйста, войдите в аккаунт</p>
      </div>
    );
  }

  const handleEditToggle = () => {
    if (!editMode) {
      setFormData(profile);
    }
    setEditMode(!editMode);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      personal_data: {
        ...prev?.personal_data,
        [name]: value
      }
    }));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      bio: e.target.value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev?.address,
        [name]: value
      }
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    const { url, error: uploadError } = await profileService.uploadAvatar(profile.id, file);

    if (uploadError) {
      setError('Ошибка при загрузке аватара');
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await profileService.updateProfile(profile.id, {
      avatar_url: url
    });

    if (updateError) {
      setError('Ошибка при обновлении профиля');
    } else {
      setSuccess('Аватар успешно обновлен');
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    const { url, error: uploadError } = await profileService.uploadCoverImage(profile.id, file);

    if (uploadError) {
      setError('Ошибка при загрузке обложки');
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await profileService.updateProfile(profile.id, {
      cover_image_url: url
    });

    if (updateError) {
      setError('Ошибка при обновлении профиля');
    } else {
      setSuccess('Обложка успешно обновлена');
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    const docType = (e.target as any).dataset.type || 'other';

    const { url, error: uploadError } = await profileService.uploadDocument(profile.id, file, docType);

    if (uploadError) {
      setError('Ошибка при загрузке документа');
      setIsLoading(false);
      return;
    }

    const { error: addError } = await profileService.addVerificationDocument(profile.id, {
      type: docType as 'certificate' | 'diploma' | 'license' | 'other',
      name: file.name,
      url: url!
    });

    if (addError) {
      setError('Ошибка при добавлении документа');
    } else {
      setSuccess('Документ успешно добавлен');
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleRemoveDocument = async (docId: string) => {
    setIsLoading(true);
    setError('');

    const { error } = await profileService.removeVerificationDocument(profile.id, docId);

    if (error) {
      setError('Ошибка при удалении документа');
    } else {
      setSuccess('Документ успешно удален');
      window.location.reload();
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsLoading(true);
    setError('');

    const { error: updateError } = await profileService.updateProfile(profile.id, formData);

    if (updateError) {
      setError('Ошибка при обновлении профиля');
    } else {
      setSuccess('Профиль успешно обновлен');
      setEditMode(false);
      window.location.reload();
    }
    setIsLoading(false);
  };

  const documents = profile.verification_data?.documents || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-700 rounded-b-lg overflow-hidden">
            {profile.cover_image_url && (
              <img
                src={profile.cover_image_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {editMode && (
              <label className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={isLoading}
                  className="hidden"
                />
                <span className="text-sm font-medium">Изменить обложку</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.personal_data.full_name}
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-semibold border-4 border-white shadow-lg">
                  {profile.personal_data.full_name?.charAt(0) || 'U'}
                </div>
              )}
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-3 cursor-pointer hover:bg-primary-700">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <span>📷</span>
                </label>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">{profile.personal_data.full_name}</h2>
            <p className="text-gray-600 mt-1">
              {profile.user_type === 'specialist' ? 'Специалист' : 'Клиент'}
            </p>
            {profile.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-700 font-medium">{profile.rating.toFixed(1)}</span>
                <span className="text-gray-500">({profile.review_count} отзывов)</span>
              </div>
            )}
            {profile.is_verified && (
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  ✓ Верифицирован
                </span>
              </div>
            )}
            {!editMode && (
              <button
                onClick={handleEditToggle}
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Редактировать профиль
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`pb-4 font-medium text-sm ${
                activeTab === 'general'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Общая информация
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-4 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Документы
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`pb-4 font-medium text-sm ${
                activeTab === 'social'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Социальные ссылки
            </button>
          </div>
        </div>

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {editMode ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Полное имя</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData?.personal_data?.full_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData?.personal_data?.email || ''}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData?.personal_data?.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Биография</label>
                  <textarea
                    value={formData?.bio || ''}
                    onChange={handleBioChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Расскажите о себе..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Город</label>
                    <input
                      type="text"
                      name="city"
                      value={formData?.address?.city || ''}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Страна</label>
                    <input
                      type="text"
                      name="country"
                      value={formData?.address?.country || ''}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    disabled={isLoading}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-900">{profile.personal_data.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="text-lg font-medium text-gray-900">{profile.personal_data.phone || '–'}</p>
                  </div>
                </div>
                {profile.bio && (
                  <div>
                    <p className="text-sm text-gray-600">Биография</p>
                    <p className="text-gray-900">{profile.bio}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Город</p>
                    <p className="text-lg font-medium text-gray-900">{profile.address?.city || '–'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Страна</p>
                    <p className="text-lg font-medium text-gray-900">{profile.address?.country || '–'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Добавить документ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['certificate', 'diploma', 'license'].map(type => (
                  <label key={type} className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleDocumentUpload}
                      data-type={type}
                      disabled={isLoading}
                      className="hidden"
                    />
                    <span className="text-center">
                      <p className="font-medium text-gray-900">
                        {type === 'certificate' && '📜 Сертификат'}
                        {type === 'diploma' && '🎓 Диплом'}
                        {type === 'license' && '📋 Лицензия'}
                      </p>
                      <p className="text-sm text-gray-600">Нажмите для загрузки</p>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {documents.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Загруженные документы</h3>
                <div className="space-y-3">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">
                          {doc.type === 'certificate' && '📜 Сертификат'}
                          {doc.type === 'diploma' && '🎓 Диплом'}
                          {doc.type === 'license' && '📋 Лицензия'}
                          {doc.type === 'other' && '📄 Прочее'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                          Просмотр
                        </a>
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          disabled={isLoading}
                          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Social Tab */}
{activeTab === 'social' && (
  <div className="space-y-6">
    <p className="text-gray-600 mb-6">Добавьте ссылки на ваши социальные сети и профессиональные аккаунты</p>
    
    {editMode ? (
      <>
        <div className="space-y-4">
          {[
            { key: 'telegram', name: 'Telegram', placeholder: 'https://t.me/username' },
            { key: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/1234567890' },
            { key: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/username' },
            { key: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
            { key: 'github', name: 'GitHub', placeholder: 'https://github.com/username' },
            { key: 'portfolio', name: 'Портфолио', placeholder: 'https://yourportfolio.com' }
          ].map(platform => (
            <div key={platform.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {platform.name}
              </label>
              <input
                type="url"
                placeholder={platform.placeholder}
                defaultValue={formData?.social_links?.[platform.key] || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    social_links: {
                      ...prev?.social_links,
                      [platform.key]: e.target.value
                    }
                  }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            onClick={handleEditToggle}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Отмена
          </button>
        </div>
      </>
    ) : (
      <div className="space-y-3">
        {[
          { key: 'telegram', name: 'Telegram', icon: '✈️' },
          { key: 'whatsapp', name: 'WhatsApp', icon: '💬' },
          { key: 'instagram', name: 'Instagram', icon: '📷' },
          { key: 'linkedin', name: 'LinkedIn', icon: '💼' },
          { key: 'github', name: 'GitHub', icon: '🐙' },
          { key: 'portfolio', name: 'Портфолио', icon: '🌐' }
        ].map(platform => {
          const url = profile.social_links?.[platform.key];
          return url ? (
            <div key={platform.key} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{platform.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{platform.name}</p>
                  <p className="text-sm text-gray-600 truncate">{url}</p>
                </div>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Перейти
              </a>
            </div>
          ) : null;
        })}
                {!profile.social_links || Object.keys(profile.social_links).length === 0 && (
                    <p className="text-gray-500 text-center py-8">Социальные ссылки не добавлены</p>
                )}
            </div>
            )}
        </div>
        )}
      </div>
    </div>
  );
};