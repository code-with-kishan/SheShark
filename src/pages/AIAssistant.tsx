import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Send, Bot, User, Sparkles, Heart, Briefcase, History } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const AIAssistant = () => {
  const [mode, setMode] = useState<'business' | 'health'>('business');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { chats, addChatMessage } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentChat = chats[mode] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user' as const, parts: [{ text: input }] };
    addChatMessage(mode, userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/ai/chat', {
        message: input,
        mode,
        history: currentChat
      });

      const aiMessage = { role: 'model' as const, parts: [{ text: response.data.text }] };
      addChatMessage(mode, aiMessage);
    } catch (error) {
      console.error(error);
      addChatMessage(mode, { 
        role: 'model', 
        parts: [{ text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }] 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      {/* Mode Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-slate-500">Your personal advisor for growth and wellness.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => setMode('business')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all",
              mode === 'business' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
            )}
          >
            <Briefcase size={18} /> Business
          </button>
          <button 
            onClick={() => setMode('health')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all",
              mode === 'health' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
            )}
          >
            <Heart size={18} /> Health
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {currentChat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Sparkles size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold">How can I help you today?</h3>
                <p className="max-w-xs">Ask me about business strategies, solar energy, or women's health and wellness.</p>
              </div>
            </div>
          )}
          
          {currentChat.map((msg, i) => (
            <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'user' ? "bg-primary text-white" : "bg-white text-slate-600"
              )}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={cn(
                "max-w-[80%] p-4 rounded-3xl",
                msg.role === 'user' ? "bg-primary text-white" : "bg-slate-50 text-slate-800"
              )}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white text-slate-600 flex items-center justify-center shadow-lg">
                <Bot size={20} />
              </div>
              <div className="bg-slate-50 p-4 rounded-3xl flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100">
          <div className="relative flex items-center gap-4">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'business' ? "Ask about business growth..." : "Ask about health & wellness..."}
              className="flex-1 glass px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button 
              onClick={handleSend}
              loading={loading}
              className="h-14 w-14 rounded-2xl p-0 flex items-center justify-center"
            >
              <Send size={24} />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(mode === 'business' ? [
              "How to start a solar business?",
              "Marketing tips for women entrepreneurs",
              "Solar market trends 2026"
            ] : [
              "Daily wellness routine",
              "Stress management tips",
              "Nutrition for active women"
            ]).map((suggestion, i) => (
              <button 
                key={i}
                onClick={() => setInput(suggestion)}
                className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

import { cn } from '@/lib/utils';
export default AIAssistant;
