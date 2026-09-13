import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English + Tamil translations. Add more keys here as the UI grows.
const resources = {
  en: {
    translation: {
      appName: 'CivicConnect',
      tagline: 'Report civic issues. Track real progress.',
      home: 'Home',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      reportIssue: 'Report Issue',
      myReports: 'My Reports',
      profile: 'Profile',
      notifications: 'Notifications',
      admin: 'Admin',
      analytics: 'Analytics',
      about: 'About',
      contact: 'Contact',
      logout: 'Logout',
    },
  },
  ta: {
    translation: {
      appName: 'சிவிக்கனெக்ட்',
      tagline: 'நகர பிரச்சனைகளை அறிவிக்கவும். முன்னேற்றத்தை கண்காணிக்கவும்.',
      home: 'முகப்பு',
      login: 'உள்நுழைய',
      register: 'பதிவு செய்ய',
      dashboard: 'டாஷ்போர்டு',
      reportIssue: 'பிரச்சனையை அறிவிக்க',
      myReports: 'என் அறிக்கைகள்',
      profile: 'சுயவிவரம்',
      notifications: 'அறிவிப்புகள்',
      admin: 'நிர்வாகி',
      analytics: 'பகுப்பாய்வு',
      about: 'எங்களை பற்றி',
      contact: 'தொடர்பு கொள்ள',
      logout: 'வெளியேறு',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('cc_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
