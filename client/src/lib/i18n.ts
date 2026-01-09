import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// TODO: Migrate to 'typesafe-i18n' or add 'react-i18next.d.ts' augmentation 
// for compile-time safe keys (Senior Engineering Roadmap).
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true, // Enabled for debugging
        load: 'languageOnly',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
            useSuspense: true, // Ensure suspense is used for loading states
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        }
    });

export default i18n;
