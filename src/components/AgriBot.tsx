import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Mic } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

// Polyfill definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  ts: Date;
}

const STARTERS = [
  '🌾 Current Wheat price',
  '🌽 Maize storage tips',
  '🍚 Rice prices near me',
  '🏪 Find nearest mandi',
];

const STARTERS_HI = [
  '🌾 गेहूं का आज का भाव',
  '🌽 मक्का भंडारण सुझाव',
  '🏪 नजदीकी मंडी खोजें',
];

export default function AgriBot() {
  const { t, language, setLanguage: setGlobalLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `🙏 Hello! I'm **${t('AgriMandiBot')}**. ${t('Chat in Hindi or English')}`,
      isUser: false,
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, text, isUser: true, ts: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages,
          language: language === 'kn' ? 'hi' : language // Backend chat only supports 'en' or 'hi' currently
        })
      });
      
      const data = await res.json();
      
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        text: data.text || "Sorry, I couldn't understand that.",
        isUser: false,
        ts: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: `b-${Date.now()}`,
        text: "Sorry, the AI service is currently unavailable.",
        isUser: false,
        ts: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const toggleListen = () => {
    if (isListening) return; // Prevent multiple instances
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const formatText = (text: string) => {
    // Simple markdown-like formatting
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={i} style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>
              {line.slice(2, -2)}
            </div>
          );
        }
        // Handle inline bold
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <div key={i} style={{ marginBottom: 2 }}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} style={{ color: '#0ea5e9' }}>
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </div>
        );
      });
  };

  const starters = language === 'hi' ? STARTERS_HI : STARTERS;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="animate-pulse-green"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          boxShadow: '0 6px 30px rgba(14, 165, 233, 0.4)',
          transition: 'all 0.3s ease',
          transform: open ? 'scale(0.95)' : 'scale(1)',
        }}
        title="Chat with AgriMandiBot"
        id="agribot-trigger"
      >
        {open ? (
          <X size={24} color="white" />
        ) : (
          <MessageCircle size={26} color="white" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 28,
            width: 360,
            maxHeight: 540,
            background: 'var(--color-surface)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: 20,
            zIndex: 998,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            animation: 'fadeInUp 0.3s ease',
            overflow: 'hidden',
          }}
          id="agribot-chat"
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={20} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f0fdf4' }}>{t('AgriMandiBot')}</div>
              <div style={{ fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#4ade80',
                    display: 'inline-block',
                  }}
                />
                Online · Multilingual AI
              </div>
            </div>
            {/* Language toggle */}
            <button
              onClick={() => setGlobalLanguage(language === 'en' ? 'hi' : language === 'hi' ? 'kn' : 'en')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: 8,
                color: 'white',
                fontSize: 12,
                fontWeight: 600,
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              {language.toUpperCase()}
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  className={msg.isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}
                  style={{ lineHeight: 1.6 }}
                >
                  {formatText(msg.text)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div className="chat-bubble-bot" style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '12px 16px' }}>
                  <div className="chat-typing-dot" />
                  <div className="chat-typing-dot" />
                  <div className="chat-typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Starters */}
          {messages.length <= 2 && (
            <div
              style={{
                padding: '8px 12px',
                borderTop: '1px solid rgba(34, 197, 94, 0.08)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{
                    background: 'rgba(14, 165, 233, 0.08)',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                    borderRadius: 20,
                    color: '#0284c7',
                    fontSize: 12,
                    padding: '5px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(34, 197, 94, 0.12)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <input
              id="agribot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder={t('Type your message...')}
              className="input-field"
              style={{ fontSize: 13, padding: '9px 13px' }}
            />
            <button
              onClick={toggleListen}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: isListening ? '#f43f5e' : 'rgba(14, 165, 233, 0.1)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
                animation: isListening ? 'pulse-red 1.5s infinite' : 'none',
              }}
              title="Voice Input"
            >
              <Mic size={18} color={isListening ? 'white' : '#0ea5e9'} />
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: input.trim() ? 'linear-gradient(135deg, #10b981, #0ea5e9)' : 'var(--color-surface2)',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              id="agribot-send"
            >
              <Send size={16} color={input.trim() ? 'white' : '#4b5563'} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 480px) {
          #agribot-chat {
            right: 12px !important;
            width: calc(100vw - 24px) !important;
            bottom: 90px !important;
          }
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(248, 113, 113, 0); }
          100% { box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
        }
      `}</style>
    </>
  );
}
