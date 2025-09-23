import React from 'react';
import { useI18n } from '@/context/i18n';
import Layout from './_PageLayout';
import { mdToHtml } from '@/lib/md';

// @ts-ignore - Vite raw import
import privacyEn from '../../specs/Privacy.md?raw';
// @ts-ignore
import privacyAr from '../../specs/PrivacyAR.md?raw';

export default function Privacy() {
  const { t, locale } = useI18n();
  const content = locale === 'ar' ? privacyAr : privacyEn;

  return (
    <Layout title={t('privacy')}>
      <div className="prose max-w-none" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div dangerouslySetInnerHTML={{ __html: mdToHtml(content) }} />
      </div>
    </Layout>
  );
}
