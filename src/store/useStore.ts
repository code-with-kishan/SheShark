import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type UserRole = 'customer' | 'business';
export type AppLanguage = 'en' | 'hi' | 'es';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface SheSharkState {
  user: User | null;
  setUser: (user: User | null) => void;
  demoAuth: boolean;
  setDemoAuth: (enabled: boolean) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  isVoicePanelOpen: boolean;
  setIsVoicePanelOpen: (open: boolean) => void;
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  chats: Record<string, ChatMessage[]>;
  addChatMessage: (mode: string, message: ChatMessage) => void;
  setChatMessages: (mode: string, messages: ChatMessage[]) => void;
  clearChatMessages: (mode?: string) => void;
}

export const useStore = create<SheSharkState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      demoAuth: false,
      setDemoAuth: (enabled) => set({ demoAuth: enabled }),
      role: 'customer',
      setRole: (role) => set({ role }),
      language: 'en',
      setLanguage: (language) => set({ language }),
      voiceEnabled: true,
      setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
      audioEnabled: true,
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
      isVoicePanelOpen: false,
      setIsVoicePanelOpen: (open) => set({ isVoicePanelOpen: open }),
      cart: [],
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
      clearCart: () => set({ cart: [] }),
      chats: { business: [], health: [] },
      addChatMessage: (mode, message) => set((state) => ({
        chats: {
          ...state.chats,
          [mode]: [...(state.chats[mode] || []), message]
        }
      })),
      setChatMessages: (mode, messages) => set((state) => ({
        chats: {
          ...state.chats,
          [mode]: messages,
        }
      })),
      clearChatMessages: (mode) => set((state) => {
        if (!mode) {
          return { chats: { business: [], health: [] } };
        }

        return {
          chats: {
            ...state.chats,
            [mode]: [],
          },
        };
      }),
    }),
    {
      name: 'sheshark-storage',
      partialize: (state) => ({
        user: state.user,
        demoAuth: state.demoAuth,
        role: state.role,
        language: state.language,
        voiceEnabled: state.voiceEnabled,
        audioEnabled: state.audioEnabled,
        isVoicePanelOpen: state.isVoicePanelOpen,
        cart: state.cart,
        chats: state.chats,
      }),
    }
  )
);
