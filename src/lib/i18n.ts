import { useStore } from '@/store/useStore';

type Dictionary = Record<string, { en: string; hi: string; es: string }>;

const dictionary: Dictionary = {
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', es: 'Panel' },
  'nav.marketplace': { en: 'Marketplace', hi: 'मार्केटप्लेस', es: 'Mercado' },
  'nav.safety': { en: 'Safety', hi: 'सुरक्षा', es: 'Seguridad' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफ़ाइल', es: 'Perfil' },
  'voice.listen': { en: 'Start Listening', hi: 'सुनना शुरू करें', es: 'Comenzar a escuchar' },
  'voice.stop': { en: 'Stop Listening', hi: 'सुनना बंद करें', es: 'Dejar de escuchar' },
  'voice.unsupported': {
    en: 'Voice Assistant is not supported in your browser',
    hi: 'आपके ब्राउज़र में वॉयस असिस्टेंट समर्थित नहीं है',
    es: 'El asistente de voz no es compatible con su navegador',
  },
  'safety.title': { en: 'Safety Module', hi: 'सुरक्षा मॉड्यूल', es: 'Módulo de seguridad' },
  'safety.report': { en: 'Anonymous Report', hi: 'गुमनाम रिपोर्ट', es: 'Reporte anónimo' },
  'marketplace.title': { en: 'Marketplace', hi: 'मार्केटप्लेस', es: 'Mercado' },
  'marketplace.upload': { en: 'Upload 3D Model', hi: '3D मॉडल अपलोड करें', es: 'Subir modelo 3D' },
  'ai.title': { en: 'AI Assistant', hi: 'एआई सहायक', es: 'Asistente IA' },
};

export const translate = (key: string, lang: 'en' | 'hi' | 'es') => {
  const phrase = dictionary[key];
  if (!phrase) {
    return key;
  }

  return phrase[lang] || phrase.en;
};

export const useI18n = () => {
  const language = useStore((state) => state.language);
  return {
    language,
    t: (key: string) => translate(key, language),
  };
};
