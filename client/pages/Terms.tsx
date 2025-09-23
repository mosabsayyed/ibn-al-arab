import React from 'react';
import { useI18n } from '@/context/i18n';
import Layout from './_PageLayout';

// Import specs directly as raw strings from the repository so the pages use
// the exact files you provided as the source of truth.
// Vite's raw import loads the file contents as a string at build time.
// @ts-ignore - Vite will replace these during the build step
import termsEn from '../../specs/TandC.md?raw';
// @ts-ignore
import termsAr from '../../specs/TandCAR.md?raw';

import { mdToHtml } from '@/lib/md';

export default function Terms() {
  const { t, locale } = useI18n();
  const content = locale === 'ar' ? termsAr : termsEn;

  return (
    <Layout title={t('terms')}>
      <div className="prose max-w-none" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div dangerouslySetInnerHTML={{ __html: mdToHtml(content) }} />
      </div>
    </Layout>
  );
}
