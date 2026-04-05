type Language = 'en' | 'hi' | 'es';

type AssistantMode = 'business' | 'health';

const makerInfo = [
  'Shakshi: Frontend and UI/UX Designer',
  'Rohan: Models Generator and Business Research',
  'Kishan Nishad: Main role implemented full backend, voice command features, 3D model implementation, and AI assistant core work',
  'Shambhavi + Armaan: Combined research contribution',
  'Swayam: Designing and frontend contribution',
];

const makerProfiles: Record<string, string> = {
  shakshi: 'Shakshi worked on Frontend and UI/UX design. She helped shape the website layout, interactions, and user-first visual experience.',
  rohan: 'Rohan worked on model generation and business research, including research-backed direction for marketplace and business features.',
  kishan: 'Kishan Nishad implemented the backend in main role, plus core feature implementation including voice commands, 3D model handling, and AI assistant systems.',
  nishad: 'Kishan Nishad implemented the backend in main role, plus core feature implementation including voice commands, 3D model handling, and AI assistant systems.',
  shambhavi: 'Shambhavi contributed to the research stream, combined with Armaan as a joint research contribution.',
  armaan: 'Armaan contributed to the research stream, combined with Shambhavi as a joint research contribution.',
  swayam: 'Swayam contributed to design and frontend implementation support.',
};

const featuresKnowledge = [
  {
    keys: ['voice', 'command', 'speech', 'audio'],
    answer:
      'Voice system supports multilingual speech commands, transcript display, and spoken responses. You can say commands like "Open login page", "Open marketplace", and "Safety section kholo" for quick navigation.',
  },
  {
    keys: ['marketplace', '3d', 'glb', 'model'],
    answer:
      'Marketplace includes product listings, 3D model viewing, and .glb upload support. Models are served from public storage and can be previewed in the integrated viewer.',
  },
  {
    keys: ['brand', 'amazon', 'collaboration'],
    answer:
      'Collaborated brands are supported through brand models, brand pages, and filtered product browsing. Amazon and other brand flows are available from the marketplace.',
  },
  {
    keys: ['panic', 'safety', 'sos', 'police'],
    answer:
      'Safety module includes SOS panic flow, location capture, emergency contact notifications, police station lookup, route safety scoring, and anonymous reporting support.',
  },
  {
    keys: ['route', 'safe route', 'community voting', 'score'],
    answer:
      'Safe routes include community ratings, average safety score calculation, and safer-route suggestions based on available route variants and score aggregation.',
  },
  {
    keys: ['anonymous', 'report'],
    answer:
      'Anonymous reporting supports public incident submissions, PII masking, status workflow tracking, and admin/business review visibility.',
  },
  {
    keys: ['service', 'monetization', 'booking', 'earning', 'skill'],
    answer:
      'Skill monetization includes service listing creation, category and pricing setup, booking flow, and earnings summary for business users.',
  },
  {
    keys: ['mental', 'chatbot', 'health support'],
    answer:
      'Mental health assistant supports supportive chat, mood-linked guidance, and offline chat persistence in local saved state for continued sessions.',
  },
  {
    keys: ['health', 'mood', 'wellness'],
    answer:
      'Health features include education modules, mood tracking, mood history, and practical wellbeing resources.',
  },
  {
    keys: ['language', 'hindi', 'english', 'translation', 'i18n'],
    answer:
      'App supports multi-language controls with English, Hindi, and Spanish options for key assistant and UI flows.',
  },
  {
    keys: ['dashboard', 'customer', 'business role', 'role'],
    answer:
      'Dual user system includes customer and business roles, protected routes, and role-aware dashboard experiences.',
  },
  {
    keys: ['offline', 'without api', 'no api', 'local'],
    answer:
      'This assistant can run fully offline for core responses, using local saved knowledge and browser state so it can still help even when remote AI APIs are unavailable.',
  },
  {
    keys: ['privacy', 'data', 'saved', 'storage'],
    answer:
      'Chat history and assistant context can be stored in browser local state for continuity. Sensitive production deployments should additionally encrypt personal data and enforce strict access controls.',
  },
  {
    keys: ['tech stack', 'architecture', 'react', 'vite', 'zustand', 'firebase'],
    answer:
      'Website architecture includes React + TypeScript + Vite frontend, Zustand state management, route-based navigation, and Firebase auth integration with role-based experiences.',
  },
];

const greeting = {
  en: 'Namaste! Welcome to SheShark. I am your offline women-first AI assistant. Ask me about any platform feature, team info, safety tools, marketplace, or business growth.',
  hi: 'नमस्ते! SheShark में आपका स्वागत है। मैं आपकी ऑफलाइन women-first AI assistant हूँ। आप मुझसे फीचर्स, टीम, सुरक्षा, मार्केटप्लेस या बिज़नेस ग्रोथ के बारे में पूछ सकती हैं।',
  es: 'Namaste! Bienvenida a SheShark. Soy tu asistente AI offline. Preguntame sobre funciones, equipo, seguridad, marketplace o crecimiento.',
};

const fallback = {
  en: 'I can help with SheShark features, voice commands, safety tools, marketplace, services, health support, and makers info. Try asking: "Who made this website?" or "Explain all features".',
  hi: 'मैं SheShark के फीचर्स, voice commands, safety tools, marketplace, services, health support और makers info में मदद कर सकती हूँ। पूछें: "Who made this website?" या "Explain all features".',
  es: 'Puedo ayudarte con funciones de SheShark, comandos de voz, seguridad, marketplace, servicios, salud y creadores.',
};

const smallTalkAnswers: Record<Language, Record<string, string>> = {
  en: {
    hello: 'Namaste! Hello, I am your SheShark women AI assistant. I am fully offline and ready to help.',
    hru: 'I am doing great and ready to support you. You can ask about features, makers, safety, marketplace, voice commands, and more.',
    thanks: 'You are welcome. I am always here to support you.',
    alr: 'Alright, tell me what you want to know next.',
  },
  hi: {
    hello: 'नमस्ते! मैं आपकी SheShark women AI assistant हूँ। मैं पूरी तरह offline हूँ और मदद के लिए तैयार हूँ।',
    hru: 'मैं बिल्कुल ठीक हूँ और आपकी मदद के लिए तैयार हूँ। आप फीचर्स, makers, safety, marketplace और voice commands के बारे में पूछ सकती हैं।',
    thanks: 'धन्यवाद! मैं हमेशा आपकी मदद के लिए यहाँ हूँ।',
    alr: 'ठीक है, अब आप अगला सवाल पूछें।',
  },
  es: {
    hello: 'Namaste! Soy tu asistente AI de SheShark y estoy lista para ayudarte sin API.',
    hru: 'Estoy bien y lista para ayudarte con funciones, seguridad, marketplace y equipo.',
    thanks: 'De nada, siempre estoy aqui para ayudarte.',
    alr: 'Perfecto, dime que quieres saber ahora.',
  },
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function getLanguageText(lang: Language, value: Record<Language, string>): string {
  return value[lang] || value.en;
}

function isGreeting(input: string): boolean {
  return /(^|\s)(hello|hi|hii|hey|namaste|namaskar|hola)(\s|$)/i.test(input);
}

function asksForMakers(input: string): boolean {
  return /(maker|made this|developer|team|who built|creator|kisne banaya|kaun banaya|who made)/i.test(input);
}

function getSmallTalkReply(input: string, language: Language): string | null {
  if (/(how are you|how r u|kese ho|kaise ho|कैसे हो)/i.test(input)) {
    return smallTalkAnswers[language].hru;
  }
  if (/(thank you|thanks|thx|shukriya|धन्यवाद)/i.test(input)) {
    return smallTalkAnswers[language].thanks;
  }
  if (/(alr|alright|ok|okay|theek hai|ठीक है)/i.test(input)) {
    return smallTalkAnswers[language].alr;
  }
  if (isGreeting(input)) {
    return smallTalkAnswers[language].hello;
  }
  return null;
}

function asksForSpecificMaker(input: string): string | null {
  for (const [makerKey, profile] of Object.entries(makerProfiles)) {
    if (new RegExp(`(^|\\s)${makerKey}(\\s|$)`, 'i').test(input)) {
      return profile;
    }
  }
  return null;
}

function asksAllFeatures(input: string): boolean {
  return /(all features|all feature|explain features|what can this website do|platform features|sab features)/i.test(input);
}

function getAllFeaturesSummary(): string {
  return [
    'SheShark feature overview:',
    '1. Multi-language voice assistant and voice command navigation',
    '2. Marketplace with 3D model preview and .glb upload support',
    '3. Collaborated brands and brand-specific pages',
    '4. Dual-role system for customer and business users',
    '5. Safety tools: panic flow, emergency contacts, police lookup, safer routes',
    '6. Anonymous incident reporting and admin review support',
    '7. Skill monetization: services, pricing, bookings, earnings',
    '8. AI assistant for business and wellness',
    '9. Health education and mood tracking support',
    '10. Local offline-saved chat memory in this browser',
  ].join('\n');
}

export function getOfflineAssistantReply(input: string, mode: AssistantMode, language: Language): string {
  const text = normalize(input);

  const smallTalk = getSmallTalkReply(text, language);
  if (smallTalk) {
    return smallTalk;
  }

  const specificMakerInfo = asksForSpecificMaker(text);
  if (specificMakerInfo) {
    return specificMakerInfo;
  }

  if (asksForMakers(text)) {
    return ['Namaste! Here is the maker team info you provided:', ...makerInfo.map((entry, index) => `${index + 1}. ${entry}`)].join('\n');
  }

  if (asksAllFeatures(text)) {
    return getAllFeaturesSummary();
  }

  for (const item of featuresKnowledge) {
    if (item.keys.some((key) => text.includes(key))) {
      return item.answer;
    }
  }

  if (mode === 'health') {
    return 'Namaste! In health mode I can guide you on mood tracking, wellness routines, stress support, safety tools, and app health resources. Ask me something specific like "stress tips" or "mood tracker feature".';
  }

  return getLanguageText(language, fallback);
}

export function getOfflineWelcomeMessage(language: Language): string {
  return getLanguageText(language, greeting);
}
