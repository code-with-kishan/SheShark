import React, { useState, useRef, useEffect } from 'react';
import { GlassCard, Button } from '@/components/UI';
import { Send, Bot, User, Sparkles, Heart, Briefcase, Download, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { aiService } from '@/services/api';

const AIAssistant = () => {
  const [mode, setMode] = useState<'business' | 'health'>('business');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { chats, addChatMessage, setChatMessages, clearChatMessages, language } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentChat = chats[mode] || [];

  useEffect(() => {
    if (currentChat.length === 0) {
      addChatMessage(mode, {
        role: 'model',
        parts: [{ text: mode === 'business' ? 'Welcome to SheShark Business AI. Ask me about growth, sales, operations, and strategy.' : 'Welcome to SheShark Health AI. Ask me about wellness, routines, stress, and healthy habits.' }],
      });
    }
  }, [addChatMessage, currentChat.length, mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChat]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const query = input.trim();
    const userMessage = { role: 'user' as const, parts: [{ text: query }] };
    addChatMessage(mode, userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.chat(query, mode, language);
      const reply = response?.data?.text || 'I could not generate a response right now. Please try again.';

      const aiMessage = { role: 'model' as const, parts: [{ text: reply }] };
      addChatMessage(mode, aiMessage);
    } catch (error) {
      console.error(error);
      addChatMessage(mode, { 
        role: 'model',
        parts: [{ text: "I'm sorry, I couldn't reach the AI service right now. Please check backend/API and try again." }]
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentChat = () => {
    clearChatMessages(mode);
    addChatMessage(mode, {
      role: 'model',
      parts: [{ text: mode === 'business' ? 'Welcome to SheShark Business AI. Ask me about growth, sales, operations, and strategy.' : 'Welcome to SheShark Health AI. Ask me about wellness, routines, stress, and healthy habits.' }],
    });
  };

  const exportCurrentChat = () => {
    const blob = new Blob([
      currentChat
        .map((msg) => `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.parts[0].text}`)
        .join('\n\n'),
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sheshark-${mode}-chat.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col gap-4 sm:gap-6">
      {/* Mode Selector */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">AI Assistant</h1>
          <p className="text-slate-500">Your personal advisor for growth and wellness.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
            <button 
              onClick={() => setMode('business')}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all sm:flex-initial sm:px-6",
                mode === 'business' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
              )}
            >
              <Briefcase size={18} /> Business
            </button>
            <button 
              onClick={() => setMode('health')}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all sm:flex-initial sm:px-6",
                mode === 'health' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
              )}
            >
              <Heart size={18} /> Health
            </button>
          </div>
          <button type="button" onClick={exportCurrentChat} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <Download size={16} className="inline mr-1" /> Export
          </button>
          <button type="button" onClick={clearCurrentChat} className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 size={16} className="inline mr-1" /> Clear
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden min-h-[24rem]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
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
        <div className="p-4 sm:p-6 border-t border-slate-100">
          <div className="relative flex items-center gap-3 sm:gap-4">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'business' ? "Ask about business growth..." : "Ask about health & wellness..."}
              className="flex-1 glass px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button 
              onClick={handleSend}
              loading={loading}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl p-0 flex items-center justify-center"
            >
              <Send size={24} />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(mode === 'business' ? [
              "Namaste",
              "Explain all features",
              "Who made this website?",
              "Open voice feature details",
              "Give 30-day business growth plan",
              "How to improve recurring revenue"
            ] : [
              "Hello",
              "Daily wellness routine",
              "Mood tracker feature",
              "Who made this website?",
              "Stress management tips",
              "Healthy schedule for busy founders"
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

export default AIAssistant;
