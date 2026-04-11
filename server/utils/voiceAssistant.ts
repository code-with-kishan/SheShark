/**
 * Voice Assistant Utilities
 * Web Speech API wrapper for voice interaction
 */

export interface VoiceCommand {
  command: string;
  action: () => void;
}

export class VoiceAssistant {
  private recognition: any; // SpeechRecognition instance
  private isListening: boolean = false;
  private language: string;

  constructor(language: 'en' | 'hi' | 'es' = 'en') {
    this.language = language;

    if (typeof window === 'undefined') {
      return;
    }
    
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    
    // Set language code
    const languageCodes: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      es: 'es-ES',
    };
    this.recognition.lang = languageCodes[this.language] || 'en-US';
  }

  /**
   * Start listening for voice input
   */
  public startListening(onResult: (transcript: string) => void, onError?: (error: any) => void) {
    if (!this.recognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech Recognition error:', event.error);
      if (onError) onError(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  /**
   * Stop listening
   */
  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Speak text using Web Speech API
   */
  public speak(text: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = this.language === 'hi' ? 'hi-IN' : this.language === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Parse voice command and return action
   */
  public parseCommand(transcript: string): string | null {
    const lower = transcript.toLowerCase();

    const commands: Record<string, string> = {
      'show products': 'navigate-marketplace',
      'open marketplace': 'navigate-marketplace',
      'marketplace': 'navigate-marketplace',
      
      'safety': 'navigate-safety',
      'open safety': 'navigate-safety',
      'help': 'navigate-safety',
      'emergency': 'toggle-panic',
      'panic': 'toggle-panic',
      
      'health': 'navigate-health',
      'open health': 'navigate-health',
      'health information': 'navigate-health',
      
      'dashboard': 'navigate-dashboard',
      'profile': 'navigate-profile',
      'my account': 'navigate-profile',
      
      'learning': 'navigate-learning',
      'workshops': 'navigate-learning',
      
      'go back': 'go-back',
      'back': 'go-back',
      'home': 'navigate-home',
    };

    for (const [key, value] of Object.entries(commands)) {
      if (lower.includes(key)) {
        return value;
      }
    }

    return null;
  }

  /**
   * Check if speech recognition is supported
   */
  public isSupported(): boolean {
    return !!this.recognition;
  }

  /**
   * Get current listening state
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Set language
   */
  public setLanguage(language: 'en' | 'hi' | 'es') {
    this.language = language;
    this.setupRecognition();
  }
}

// Export singleton instance
export const voiceAssistant = new VoiceAssistant();
 
