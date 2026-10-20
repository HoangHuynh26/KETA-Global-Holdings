import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function SEOHead() {
  const { lang, t } = useLanguage();
  const {
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    locale
  } = t.seo || {};

  useEffect(() => {
    // 1. Update HTML lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

    // 2. Update Page Title
    if (title) {
      document.title = title;
    }

    // Helper function to update or create meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Standard SEO Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 4. Update Open Graph Tags
    setMetaTag('property', 'og:title', ogTitle || title);
    setMetaTag('property', 'og:description', ogDescription || description);
    setMetaTag('property', 'og:locale', locale || (lang === 'vi' ? 'vi_VN' : lang === 'zh' ? 'zh_CN' : 'en_US'));

    // 5. Update Twitter Tags
    setMetaTag('name', 'twitter:title', ogTitle || title);
    setMetaTag('name', 'twitter:description', ogDescription || description);
  }, [lang, title, description, keywords, ogTitle, ogDescription, locale]);

  return null;
}
