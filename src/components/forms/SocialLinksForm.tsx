import React, { useState } from 'react';
import { profileService } from '../../lib/services/profile.service';
import type { Profile } from '../../types/auth.types';
import { FaTelegram, FaWhatsapp, FaInstagram, FaLinkedin, FaGithub, FaGlobe, FaFacebook, FaYoutube } from 'react-icons/fa';

interface SocialLinksFormProps {
  profile: Profile;
  onSave?: (updatedProfile: Profile) => void;
}

const SOCIAL_PLATFORMS = [
  {
    key: 'telegram',
    name: 'Telegram',
    icon: <FaTelegram className="w-4 h-4" />,
    placeholder: 'https://t.me/username'
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    icon: <FaWhatsapp className="w-4 h-4" />,
    placeholder: 'https://wa.me/1234567890'
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: <FaInstagram className="w-4 h-4" />,
    placeholder: 'https://instagram.com/username'
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: <FaLinkedin className="w-4 h-4" />,
    placeholder: 'https://linkedin.com/in/username'
  },
  {
    key: 'github',
    name: 'GitHub',
    icon: <FaGithub className="w-4 h-4" />,
    placeholder: 'https://github.com/username'
  },
  {
    key: 'portfolio',
    name: 'Портфолио',
    icon: <FaGlobe className="w-4 h-4" />,
    placeholder: 'https://yourportfolio.com'
  },
  {
    key: 'facebook',
    name: 'Facebook',
    icon: <FaFacebook className="w-4 h-4" />,
    placeholder: 'https://facebook.com/username'
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: <FaYoutube className="w-4 h-4" />,
    placeholder: 'https://youtube.com/@username'
  }
];

export const SocialLinksForm: React.FC<SocialLinksFormProps> = ({ profile, onSave }) => {
  const [links, setLinks] = useState<Record<string, string>>(profile.social_links || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLinkChange = (platform: string, value: string) => {
    setLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    const { profile: updated, error: updateError } = await profileService.updateSocialLinks(profile.id, links);

    if (updateError) {
      setError('Ошибка при сохранении ссылок');
    } else {
      setSuccess('Социальные ссылки успешно обновлены');
      if (onSave && updated) {
        onSave(updated);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {SOCIAL_PLATFORMS.map(platform => (
          <div key={platform.key}>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <span className="mr-2 flex items-center">{platform.icon}</span>
              {platform.name}
            </label>
            <input
              type="url"
              value={links[platform.key] || ''}
              onChange={e => handleLinkChange(platform.key, e.target.value)}
              placeholder={platform.placeholder}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isLoading ? 'Сохранение...' : 'Сохранить ссылки'}
      </button>
    </div>
  );
};