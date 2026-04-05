import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getOfflineAssistantReply, getOfflineWelcomeMessage } from '@/lib/offlineAssistant';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

interface FloatingWomenChatbotProps {
  voicePanelOpen?: boolean;
}

const FloatingWomenChatbot = ({ voicePanelOpen = false }: FloatingWomenChatbotProps) => {
  const { language } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const welcome = useMemo(() => getOfflineWelcomeMessage(language), [language]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'bot', text: welcome }]);
    }
  }, [messages.length, welcome]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) {
      return;
    }

    const botReply = getOfflineAssistantReply(text, 'health', language);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      { role: 'bot', text: botReply },
    ]);
    setInput('');
  };

  return (
    <div
      className={
        `fixed z-[60] pointer-events-none left-3 right-3 sm:left-auto ${
          voicePanelOpen
            ? 'bottom-[calc(13rem+env(safe-area-inset-bottom,0px))] sm:bottom-44 sm:right-5'
            : 'bottom-[calc(7rem+env(safe-area-inset-bottom,0px))] sm:bottom-24 sm:right-5'
        }`
      }
    >
      <div className="pointer-events-auto flex w-full flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-full overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl sm:w-[22rem] sm:max-w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-pink-400 px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={16} />
              SheShark Women Chatbot
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-white/20 p-1 hover:bg-white/30"
              aria-label="Close chatbot"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>

          <div ref={listRef} className="max-h-72 space-y-3 overflow-y-auto bg-pink-50/40 p-3">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={
                    msg.role === 'user'
                      ? 'max-w-[80%] rounded-2xl bg-pink-500 px-3 py-2 text-sm text-white'
                      : 'max-w-[80%] rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 border border-slate-100'
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              placeholder={language === 'hi' ? 'कुछ पूछें...' : 'Ask anything...'}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />
            <button
              onClick={sendMessage}
              className="inline-flex items-center justify-center rounded-xl bg-pink-500 p-2 text-white hover:bg-pink-600"
              aria-label="Send message"
              title="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-lg hover:brightness-105 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-full sm:px-4 sm:py-3 sm:font-semibold"
        aria-label={isOpen ? 'Hide chatbot' : 'Open chatbot'}
        title={isOpen ? 'Hide chatbot' : 'Open chatbot'}
      >
        <Bot size={18} />
        <span className="hidden sm:inline">{isOpen ? 'Hide Chatbot' : 'Women Chatbot'}</span>
      </button>
      </div>
    </div>
  );
};

export default FloatingWomenChatbot;
