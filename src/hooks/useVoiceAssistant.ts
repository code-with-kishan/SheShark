import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type VoiceLanguageMode = 'auto' | 'en' | 'hi';
export type VoiceLanguage = 'en' | 'hi';

export interface VoiceCommandResult {
  route: string;
  transcript: string;
  response: string;
  language: VoiceLanguage;
}

export interface UseVoiceAssistantOptions {
  initialLanguageMode?: VoiceLanguageMode;
  speechEnabled?: boolean;
  onCommand?: (result: VoiceCommandResult) => void;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const languageLabels: Record<VoiceLanguageMode, string> = {
  auto: 'Auto',
  en: 'English',
  hi: 'Hindi',
};

const recognitionLanguageMap: Record<VoiceLanguage, string> = {
  en: 'en-US',
  hi: 'hi-IN',
};

const conversationPatterns = [
  {
    response: {
      en: 'Namaste! Hello. I am your SheShark voice assistant. How can I help you today?',
      hi: 'नमस्ते! मैं आपकी SheShark वॉइस असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?',
    },
    keywords: ['hello', 'hell', 'hii', 'hi', 'hey', 'namaste', 'namastee', 'namaste ji', 'namaskar', 'mnamaste', 'हेलो', 'नमस्ते', 'नमस्कार'],
  },
  {
    response: {
      en: 'I am doing great, thank you for asking. I am ready to help you with any SheShark feature.',
      hi: 'मैं बहुत अच्छी हूँ, पूछने के लिए धन्यवाद। मैं SheShark के किसी भी फीचर में आपकी मदद के लिए तैयार हूँ।',
    },
    keywords: ['how are you', 'how r u', 'how you', 'kaise ho', 'kaisi ho', 'aap kaise ho', 'aap kaise hain', 'aap kese ho', 'app kaise ho', 'kaise ho aap', 'कैसे हो', 'कैसी हो', 'आप कैसे हो', 'आप कैसे हैं'],
  },
  {
    response: {
      en: 'I am helping you with voice support, navigation, and SheShark platform guidance.',
      hi: 'मैं आपकी वॉइस सपोर्ट, नेविगेशन और SheShark प्लेटफॉर्म गाइडेंस में मदद कर रही हूँ।',
    },
    keywords: ['what are you doing', 'what do you do', 'kya kar rahe ho', 'kya kar raho ho', 'kya kar rahi ho', 'क्या कर रहे हो', 'क्या कर रही हो', 'क्या कर रहे हैं'],
  },
  {
    response: {
      en: 'To use SheShark, start from the dashboard or voice assistant, then open Marketplace, Safety, Community, Services, or AI Assistant as needed. You can also say commands like "Open marketplace" or "Open safety section".',
      hi: 'SheShark use karne ke liye dashboard ya voice assistant se start karein. Phir Marketplace, Safety, Community, Services ya AI Assistant khol sakte hain. Aap "marketplace kholo" ya "safety section kholo" jaise commands bhi bol sakte hain.',
    },
    keywords: [
      'how to use',
      'how do i use',
      'how to use this app',
      'how to use this website',
      'how to use sheshark',
      'use this app',
      'use this website',
      'app kaise use',
      'app kaise chalaye',
      'website kaise use',
      'sheshark kaise use',
      'sheshark ko kaise chalaye',
      'kaise istemal kare',
      'kaise istemal karen',
      'kaise chale',
      'kaise chalaye',
      'is app ko kaise use kare',
      'ye app kaise use kare',
      'ye website kaise use kare',
      'how do i start',
      'how does it work',
      'kaise start kare',
    ],
  },
  {
    response: {
      en: 'You are always welcome. I am here whenever you need me.',
      hi: 'आपका हमेशा स्वागत है। जब भी आपको जरूरत हो मैं यहीं हूँ।',
    },
    keywords: ['thank you', 'thanks', 'dhanyavad', 'shukriya', 'धन्यवाद', 'शुक्रिया'],
  },
];

const commandPatterns = [
  {
    route: '/login',
    response: {
      en: 'Opening login page.',
      hi: 'मैं लॉगिन पेज खोल रही हूँ।',
    },
    keywords: [
      'login',
      'log in',
      'open login',
      'open login page',
      'go to login',
      'sign in page',
      'लॉगिन',
      'लॉगिन खोलो',
      'लॉगिन पेज खोलो',
    ],
  },
  {
    route: '/',
    response: {
      en: 'Opening home page.',
      hi: 'मैं होम पेज खोल रही हूँ।',
    },
    keywords: ['home', 'open home', 'go home', 'landing page', 'main page', 'होम', 'होम खोलो', 'मुख्य पेज खोलो'],
  },
  {
    route: '/marketplace',
    response: {
      en: 'Opening marketplace.',
      hi: 'मैं मार्केटप्लेस खोल रही हूँ।',
    },
    keywords: [
      'open marketplace',
      'open market place',
      'show products',
      'marketplace',
      'market place',
      'products',
      'market',
      'shop',
      'store',
      'मार्केटप्लेस',
      'मार्केटप्लेस खोलो',
      'मार्क खोलो',
      'प्रोडक्ट दिखाओ',
    ],
  },
  {
    route: '/safety',
    response: {
      en: 'Opening safety section.',
      hi: 'मैं सुरक्षा अनुभाग खोल रही हूँ।',
    },
    keywords: [
      'open safety',
      'safety section kholo',
      'safety section khol',
      'safety section',
      'safety',
      'suraksha',
      'surakshit',
      'kholo safety',
      'safety kholo',
      'सुरक्षा',
      'सुरक्षा सेक्शन खोलो',
      'सेफ्टी सेक्शन खोलो',
    ],
  },
  {
    route: '/dashboard',
    response: {
      en: 'Opening dashboard.',
      hi: 'मैं डैशबोर्ड खोल रही हूँ।',
    },
    keywords: ['dashboard', 'my dashboard', 'open dashboard', 'डैशबोर्ड', 'डैशबोर्ड खोलो'],
  },
  {
    route: '/profile',
    response: {
      en: 'Opening profile.',
      hi: 'मैं प्रोफ़ाइल खोल रही हूँ।',
    },
    keywords: ['profile', 'my profile', 'open profile', 'प्रोफाइल', 'प्रोफाइल खोलो'],
  },
  {
    route: '/ai',
    response: {
      en: 'Opening AI assistant.',
      hi: 'मैं एआई असिस्टेंट खोल रही हूँ।',
    },
    keywords: ['ai assistant', 'open ai', 'open ai assistant', 'chat assistant', 'एआई असिस्टेंट', 'एआई खोलो'],
  },
  {
    route: '/community',
    response: {
      en: 'Opening community.',
      hi: 'मैं कम्युनिटी पेज खोल रही हूँ।',
    },
    keywords: ['community', 'open community', 'community page', 'open community page', 'कम्युनिटी', 'कम्युनिटी खोलो', 'कम्युनिटी पेज खोलो'],
  },
  {
    route: '/features',
    response: {
      en: 'Opening features page.',
      hi: 'मैं फीचर्स पेज खोल रही हूँ।',
    },
    keywords: ['features', 'open features', 'features page', 'show features', 'फीचर्स', 'फीचर्स खोलो'],
  },
  {
    route: '/download-app',
    response: {
      en: 'Opening download app page.',
      hi: 'मैं डाउनलोड ऐप पेज खोल रही हूँ।',
    },
    keywords: ['download app', 'open download', 'download page', 'app download', 'डाउनलोड ऐप', 'ऐप डाउनलोड'],
  },
  {
    route: '/profit-loss',
    response: {
      en: 'Opening profit and loss page.',
      hi: 'मैं प्रॉफिट और लॉस पेज खोल रही हूँ।',
    },
    keywords: [
      'profit loss',
      'profit and loss',
      'open profit loss',
      'energy hub',
      'open energy hub',
      'pnl',
      'profit page',
      'loss page',
      'प्रॉफिट लॉस',
      'एनर्जी हब',
    ],
  },
  {
    route: '/services',
    response: {
      en: 'Opening services.',
      hi: 'मैं सर्विसेज पेज खोल रही हूँ।',
    },
    keywords: ['services', 'open services', 'service page', 'skills', 'सर्विस', 'सर्विसेज', 'सर्विस पेज खोलो'],
  },
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectLanguage(text: string): VoiceLanguage {
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  const normalized = normalizeText(text);
  const hindiHints = [
    'kholo',
    'khol',
    'suraksha',
    'surakshit',
    'kripya',
    'namaste',
    'namaskar',
    'aap kaise',
    'app kaise',
    'kaise ho',
    'kaisi ho',
    'marketplace',
    'community',
  ];
  if (hindiHints.some((hint) => normalized.includes(hint))) {
    return 'hi';
  }

  return 'en';
}

function getCommandResponse(transcript: string, language: VoiceLanguage) {
  const normalized = normalizeText(transcript);

  for (const conversation of conversationPatterns) {
    if (conversation.keywords.some((keyword) => normalized.includes(keyword))) {
      return {
        route: '',
        response: conversation.response[language],
        matched: true,
      };
    }
  }

  for (const command of commandPatterns) {
    if (command.keywords.some((keyword) => normalized.includes(keyword))) {
      return {
        route: command.route,
        response: command.response[language],
        matched: true,
      };
    }
  }

  if (normalized.includes('kholo') || normalized.includes('खोलो')) {
    if (normalized.includes('marketplace') || normalized.includes('मार्केटप्लेस')) {
      return { route: '/marketplace', response: language === 'hi' ? 'मैं मार्केटप्लेस खोल रही हूँ।' : 'Opening marketplace.', matched: true };
    }
    if (normalized.includes('safety') || normalized.includes('सुरक्षा')) {
      return { route: '/safety', response: language === 'hi' ? 'मैं सुरक्षा अनुभाग खोल रही हूँ।' : 'Opening safety section.', matched: true };
    }
    if (normalized.includes('login') || normalized.includes('लॉगिन')) {
      return { route: '/login', response: language === 'hi' ? 'मैं लॉगिन पेज खोल रही हूँ।' : 'Opening login page.', matched: true };
    }
    if (normalized.includes('community') || normalized.includes('कम्युनिटी')) {
      return { route: '/community', response: language === 'hi' ? 'मैं कम्युनिटी पेज खोल रही हूँ।' : 'Opening community.', matched: true };
    }
  }

  return {
    route: '',
    response:
      language === 'hi'
        ? 'मुझे यह कमांड समझ नहीं आया। कृपया लॉगिन, होम, मार्केटप्लेस या सुरक्षा अनुभाग कहें।'
        : 'I did not understand that command. Try "Open login page", "Open marketplace", or "Safety section kholo".',
    matched: false,
  };
}

function getBrowserLanguage(): VoiceLanguage {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const browserLanguages = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((lang) => lang.toLowerCase());

  return browserLanguages.some((lang) => lang.startsWith('hi')) ? 'hi' : 'en';
}

export function useVoiceAssistant(options: UseVoiceAssistantOptions = {}) {
  const { initialLanguageMode = 'auto', speechEnabled = true, onCommand } = options;
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const latestTranscriptRef = useRef('');
  const processedTranscriptRef = useRef('');
  const hasFinalResultRef = useRef(false);
  const hasRetriedRef = useRef(false);
  const autoSubmitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [languageMode, setLanguageMode] = useState<VoiceLanguageMode>(initialLanguageMode);
  const [detectedLanguage, setDetectedLanguage] = useState<VoiceLanguage>(getBrowserLanguage());

  const canSpeak = useMemo(() => {
    return speechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window;
  }, [speechEnabled]);

  const currentLanguage: VoiceLanguage = languageMode === 'auto' ? detectedLanguage : languageMode;

  const speak = useCallback((message: string, languageOverride?: VoiceLanguage) => {
    if (!canSpeak || typeof window === 'undefined') {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = recognitionLanguageMap[languageOverride || currentLanguage];
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [canSpeak, currentLanguage]);

  const processTranscript = useCallback((value: string) => {
    const cleanTranscript = value.trim();
    if (!cleanTranscript) {
      return null;
    }

    const language = languageMode === 'auto' ? detectLanguage(cleanTranscript) : languageMode;
    const commandResult = getCommandResponse(cleanTranscript, language);
    const responseText = commandResult.response;

    setDetectedLanguage(language);
    setResponse(responseText);
    setError('');

    console.log('Recognized text:', cleanTranscript);

    if (commandResult.matched) {
      if (commandResult.route) {
        onCommand?.({
          route: commandResult.route,
          transcript: cleanTranscript,
          response: responseText,
          language,
        });
      }
    }

    speak(responseText, language);
    return {
      route: commandResult.route,
      transcript: cleanTranscript,
      response: responseText,
      language,
      matched: commandResult.matched,
    };
  }, [languageMode, onCommand, speak]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsProcessing(false);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || typeof window === 'undefined') {
      setError('Voice recognition is not supported in this browser.');
      setResponse('Voice assistant is not supported in this browser.');
      return;
    }

    const SpeechRecognitionCtor = (window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }).SpeechRecognition || (window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setIsSupported(false);
      setError('Voice recognition is not supported in this browser.');
      setResponse('Voice assistant is not supported in this browser.');
      return;
    }

    const browserLanguage = getBrowserLanguage();
    const primaryRecognitionLang = languageMode === 'auto'
      ? (browserLanguage === 'hi' ? 'hi-IN' : 'en-US')
      : recognitionLanguageMap[currentLanguage];
    const fallbackRecognitionLang = languageMode === 'auto'
      ? (primaryRecognitionLang === 'hi-IN' ? 'en-US' : 'hi-IN')
      : '';

    const runRecognition = (recognitionLang: string, allowRetry: boolean) => {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = recognitionLang;

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(true);
        setError('');
        setTranscript('');
        setResponse('');
        latestTranscriptRef.current = '';
        processedTranscriptRef.current = '';
        hasFinalResultRef.current = false;
        if (autoSubmitTimerRef.current) {
          clearTimeout(autoSubmitTimerRef.current);
          autoSubmitTimerRef.current = null;
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let index = event.resultIndex; index < event.results.length; index++) {
          const result = event.results[index];
          const spokenText = result[0]?.transcript || '';

          if (result.isFinal) {
            finalTranscript += spokenText;
          } else {
            interimTranscript += spokenText;
          }
        }

        const combinedTranscript = (finalTranscript || interimTranscript).trim();
        if (combinedTranscript) {
          setTranscript(combinedTranscript);
          latestTranscriptRef.current = combinedTranscript;

          if (autoSubmitTimerRef.current) {
            clearTimeout(autoSubmitTimerRef.current);
          }

          autoSubmitTimerRef.current = setTimeout(() => {
            const latestTranscript = latestTranscriptRef.current.trim();
            if (latestTranscript && processedTranscriptRef.current !== latestTranscript) {
              processedTranscriptRef.current = latestTranscript;
              processTranscript(latestTranscript);
              recognition.stop();
            }
          }, 450);
        }

        if (finalTranscript.trim()) {
          hasFinalResultRef.current = true;
          const recognized = finalTranscript.trim();
          latestTranscriptRef.current = recognized;

          if (processedTranscriptRef.current !== recognized) {
            processedTranscriptRef.current = recognized;
            processTranscript(recognized);
            recognition.stop();
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsListening(false);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
        recognitionRef.current = null;

        if (autoSubmitTimerRef.current) {
          clearTimeout(autoSubmitTimerRef.current);
          autoSubmitTimerRef.current = null;
        }

        const transcriptToProcess = latestTranscriptRef.current.trim();
        if (transcriptToProcess && processedTranscriptRef.current !== transcriptToProcess) {
          processedTranscriptRef.current = transcriptToProcess;
          processTranscript(transcriptToProcess);
          return;
        }

        if (!hasFinalResultRef.current && allowRetry && fallbackRecognitionLang && !hasRetriedRef.current) {
          hasRetriedRef.current = true;
          setResponse('Trying again in alternate language...');
          runRecognition(fallbackRecognitionLang, false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    };

    hasRetriedRef.current = false;
    runRecognition(primaryRecognitionLang, true);
  }, [currentLanguage, isSupported, languageMode, processTranscript]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  }, [isListening, startListening, stopListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    latestTranscriptRef.current = '';
    processedTranscriptRef.current = '';
    if (autoSubmitTimerRef.current) {
      clearTimeout(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
  }, []);

  const clearResponse = useCallback(() => {
    setResponse('');
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    isSupported,
    canSpeak,
    isListening,
    isProcessing,
    transcript,
    response,
    error,
    languageMode,
    detectedLanguage,
    currentLanguage,
    setLanguageMode,
    startListening,
    stopListening,
    toggleListening,
    processTranscript,
    speak,
    clearTranscript,
    clearResponse,
  };
}

export { languageLabels };
