import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface SheSharkState {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  chats: Record<string, ChatMessage[]>;
  addChatMessage: (mode: string, message: ChatMessage) => void;
}

export const useStore = create<SheSharkState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
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
    }),
    {
      name: 'sheshark-storage',
    }
  )
);
