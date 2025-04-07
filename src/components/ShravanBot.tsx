
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, X, BrainCircuit, Moon, Sun } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/context/UserContext';

interface Message {
  content: string;
  sender: 'user' | 'bot';
}

interface BotPersonality {
  name: string;
  greeting: string;
  avatar: string;
  colorClass: string;
  responses: string[];
}

export default function ShravanBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [personality, setPersonality] = useState<BotPersonality>({
    name: 'SHRAVAN',
    greeting: "Hello! I'm SHRAVAN, your health companion. How can I help you today?",
    avatar: '🤖',
    colorClass: 'bg-shravan-mint',
    responses: [
      "I'd recommend checking your vitals if you're feeling unwell.",
      "Remember to stay hydrated and take your medications on time.",
      "The Community section has helpful tips from other users like you!",
      "Would you like to try a simple exercise from our Physio Assistant?",
      "Your health readings look normal! Keep up the good work.",
      "It's important to get regular check-ups with your doctor.",
      "Have you taken your blood pressure reading today?",
      "Remember to log your symptoms so we can track patterns together.",
      "I'm here to help you navigate your health journey!"
    ]
  });
  const { toast } = useToast();
  const { themeMode, toggleTheme } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial bot message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          content: personality.greeting,
          sender: 'bot'
        }
      ]);
    }
  }, [messages.length, personality.greeting]);

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
    
    // Simulate thinking with typing indicator
    setTimeout(() => {
      // Select a random response from the personality responses
      const randomResponse = personality.responses[Math.floor(Math.random() * personality.responses.length)];
      
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

  const changePersonality = () => {
    const personalities: BotPersonality[] = [
      {
        name: 'SHRAVAN',
        greeting: "Hello! I'm SHRAVAN, your health companion. How can I help you today?",
        avatar: '🤖',
        colorClass: 'bg-shravan-mint',
        responses: personality.responses
      },
      {
        name: 'Dr. Mittal',
        greeting: "Namaste! I'm Dr. Mittal, your virtual health advisor. What can I assist you with today?",
        avatar: '👩‍⚕️',
        colorClass: 'bg-shravan-blue',
        responses: personality.responses
      },
      {
        name: 'Buddy',
        greeting: "Hi there! I'm Buddy, your friendly health pal! How are you feeling today?",
        avatar: '🐶',
        colorClass: 'bg-shravan-peach',
        responses: personality.responses
      }
    ];
    
    // Find current personality index and get the next one
    const currentIndex = personalities.findIndex(p => p.name === personality.name);
    const nextIndex = (currentIndex + 1) % personalities.length;
    
    setPersonality(personalities[nextIndex]);
    
    // Add a message from the new personality
    setMessages(prev => [
      ...prev,
      { 
        content: personalities[nextIndex].greeting, 
        sender: 'bot' 
      }
    ]);
  };

  return (
    <>
      {/* Bot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full ${personality.colorClass} flex items-center justify-center shadow-lg hover:opacity-90 transition-all z-10 ${
          isAnimating ? 'animate-wave' : ''
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white dark:bg-card flex items-center justify-center">
          <span className="text-2xl">{personality.avatar}</span>
        </div>
      </button>

      {/* Bot Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white dark:bg-card rounded-2xl shadow-xl z-20 overflow-hidden border border-border animate-fade-in">
          <div className={`flex items-center justify-between p-4 ${personality.colorClass} dark:bg-opacity-80`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-card flex items-center justify-center">
                <span className="text-xl">{personality.avatar}</span>
              </div>
              <h3 className="font-bold text-lg text-primary-foreground dark:text-white">{personality.name}</h3>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-primary-foreground hover:bg-shravan-darkMint/20 dark:text-white"
              >
                {themeMode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={changePersonality}
                className="text-primary-foreground hover:bg-shravan-darkMint/20 dark:text-white"
              >
                <BrainCircuit className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-shravan-darkMint/20 dark:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
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
                      ? 'bg-shravan-blue text-foreground dark:bg-shravan-darkBlue dark:text-white'
                      : `${personality.colorClass} text-primary-foreground dark:bg-opacity-80 dark:text-white`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-border">
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
                className={`shrink-0 ${personality.colorClass} text-primary-foreground hover:opacity-90 dark:bg-opacity-80 dark:text-white`}
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
