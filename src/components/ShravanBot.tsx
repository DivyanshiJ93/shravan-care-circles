
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

export default function ShravanBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial bot message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          content: "Hello! I'm SHRAVAN, your health companion. How can I help you today?",
          sender: 'bot'
        }
      ]);
    }
  }, [messages.length]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Wave animation for the bot avatar
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMessages = [
      ...messages,
      { content: input, sender: 'user' as const }
    ];
    
    setMessages(newMessages);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'd recommend checking your vitals if you're feeling unwell.",
        "Remember to stay hydrated and take your medications on time.",
        "The Community section has helpful tips from other users like you!",
        "Would you like to try a simple exercise from our Physio Assistant?",
        "Your health readings look normal! Keep up the good work."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      setMessages(prev => [
        ...prev,
        { content: randomResponse, sender: 'bot' }
      ]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice Input",
      description: "Voice recognition is coming soon!",
    });
  };

  return (
    <>
      {/* Bot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-shravan-mint flex items-center justify-center shadow-lg hover:bg-shravan-darkMint transition-all z-10 ${
          isAnimating ? 'animate-wave' : ''
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
      </button>

      {/* Bot Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-2xl shadow-xl z-20 overflow-hidden border border-border animate-fade-in">
          <div className="flex items-center justify-between p-4 bg-shravan-mint">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="font-bold text-lg text-primary-foreground">SHRAVAN</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-shravan-darkMint/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-shravan-blue text-foreground'
                      : 'bg-shravan-mint text-primary-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceInput}
                className="shrink-0"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="input-shravan"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSendMessage}
                className="shrink-0 bg-shravan-mint text-primary-foreground hover:bg-shravan-darkMint"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
