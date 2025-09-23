import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/i18n';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { profile, session, refreshProfile, logout } = useAuth();
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // try to refresh profile on mount
    (async () => {
      setLoading(true);
      try {
        await refreshProfile?.();
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshProfile]);

  if (loading) return <div className="container py-16">{t('loading')}</div>;

  if (!profile) {
    return (
      <main className="container py-16 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">{t('profile')}</h1>
          <p className="text-gray-600">{t('noAccount')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`container py-16 max-w-lg mx-auto ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('profile')}</h1>
        <div className="border p-4 rounded">
          <div><strong>{t('firstName')}:</strong> {profile.firstName || profile.first_name || ''}</div>
          <div><strong>{t('lastName')}:</strong> {profile.lastName || profile.last_name || ''}</div>
          <div><strong>{t('emailAddress')}:</strong> {profile.email}</div>
          <div><strong>{t('phoneNumber')}:</strong> {profile.phone || ''}</div>
          <div><strong>{t('iAmAStudent')}:</strong> {profile.isStudent || profile.is_student ? t('yes') : t('no')}</div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => logout?.()}>{t('logout')}</Button>
        </div>
      </div>
    </main>
  );
}
