import { ref, computed } from 'vue';
import { translations, type Language, type TranslationKey } from './translations';

const currentLanguage = ref<Language>('en');

export function useLanguage() {
  const isRTL = computed(() => currentLanguage.value === 'ar');

  const t = (key: TranslationKey): string => {
    return translations[currentLanguage.value]?.[key] || translations.en[key] || key;
  };

  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return {
    currentLanguage: computed(() => currentLanguage.value),
    isRTL,
    t,
    setLanguage,
  };
}
