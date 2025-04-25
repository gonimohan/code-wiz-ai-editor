import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { APIKeyManager } from './APIKeyManager';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { toast } = useToast();
  
  const getAvailableProviders = () => {
    const savedKeys = localStorage.getItem('api_keys');
    if (!savedKeys) return [];
    return JSON.parse(savedKeys).map((key: any) => key.provider);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsThinking(true);

    const providers = getAvailableProviders();
    
    if (providers.length === 0) {
      toast({
        title: "No API Keys Found",
        description: "Please add at least one API key to use the chat functionality",
      });
      setIsThinking(false);
      return;
    }
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Using ${providers[0]} API. Based on your input, I'll help create a professional solution. Let me know if you need any clarification.`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
      
      toast({
        title: "Message received",
        description: "The AI assistant has responded to your message",
      });
    }, 2000);
  };
  
  return (
    <div className="flex flex-col bg-[#252526] border-l border-black h-full">
      <div className="flex items-center justify-between p-4 border-b border-black bg-[#333333]">
        <div className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-[#858585]" />
          <span className="text-sm font-medium text-[#d4d4d4]">AI Assistant</span>
        </div>
        <APIKeyManager />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser
                  ? 'bg-[#0e639c] text-white'
                  : 'bg-[#37373d] text-[#d4d4d4]'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center text-[#858585] text-sm">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-black">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can I help you today?"
            className="flex-1 bg-[#3c3c3c] text-[#d4d4d4] text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#0e639c]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-[#0e639c] text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1177bb] transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
