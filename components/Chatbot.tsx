
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { KNOWLEDGE_BASE } from '../knowledgeBase';
import { TEAM_DATA, ANNOUNCEMENTS_DATA, EVENT_SHOWCASE_DATA } from '../constants';
import { ChatIcon } from './icons/ChatIcon';
import { XIcon } from './icons/XIcon';
import { SendIcon } from './icons/SendIcon';

interface Message {
    id: number;
    sender: 'user' | 'bot';
    text: string;
    sources?: { uri: string; title: string }[];
}

const AVATAR_URL = 'https://storage.googleapis.com/aistudio-programmable-ui-project-assets/morzai-avatar.png';

const INITIAL_SUGGESTIONS = [
    "ACM Hacettepe'ye nasıl katılabilirim?",
    "Ne tür etkinlikler düzenliyorsunuz?",
    "ACM nedir?",
    "Ekibinizde kimler var?",
    "Sizinle nasıl iletişime geçebilirim?",
];

const pageLinks = [
    { href: '/team', keywords: ['team page', 'ekip sayfası', 'takım sayfası'] },
    { href: '/events', keywords: ['events page', 'etkinlikler sayfamızdaki', 'etkinlikler sayfası', 'etkinlikler sayfasında'] },
    { href: '/contact', keywords: ['contact page', 'iletişim sayfasında', 'iletişim sayfası'] },
    { href: '/signup', keywords: ['sign up', 'kayıt formu', 'kayıt sayfası', 'sign up page'] },
    { href: '/about', keywords: ['about page', 'hakkında sayfası', 'hakkımızda sayfası'] },
    { href: '/', keywords: ['home page', 'ana sayfa'] },
];

const renderTextWithLinks = (text: string, keyPrefix: string, renderedLinks: Set<string>): React.ReactNode => {
    if (!text) return null;
    // Escape regex special characters in keywords and sort by length to match longer phrases first
    const allKeywords = pageLinks.flatMap(link => link.keywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))).sort((a, b) => b.length - a.length);
    if (allKeywords.length === 0) return text;
    
    const regex = new RegExp(`(${allKeywords.join('|')})`, 'gi');
    const parts = text.split(regex).filter(Boolean);

    return parts.map((part, index) => {
        const key = `${keyPrefix}-${index}`;
        const lowerPart = part.toLowerCase().trim();
        const matchedLink = pageLinks.find(link => link.keywords.some(k => k.toLowerCase() === lowerPart));

        if (matchedLink) {
             if (renderedLinks.has(matchedLink.href)) {
                // Link already rendered in this message, just return the plain text
                return <React.Fragment key={key}>{part}</React.Fragment>;
            } else {
                // First time rendering this link in this message, add to set and return the link
                renderedLinks.add(matchedLink.href);
                return (
                    <a href={matchedLink.href} key={key} className="text-purple-400 underline hover:text-purple-300 transition-colors">
                        {part}
                    </a>
                );
            }
        }
        return <React.Fragment key={key}>{part}</React.Fragment>;
    });
};


// Component to render formatted text (bold, italic, headings)
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
    // Create a new set for each message to track links rendered within it.
    const renderedLinks = new Set<string>();

    // This helper function renders inline formatting for a piece of text.
    const renderInline = (content: string, keyPrefix: string) => {
        // Split by formatting patterns while keeping the delimiters. Filter out empty strings.
        const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|".*?")/g).filter(Boolean);
        return parts.map((part, index) => {
            const key = `${keyPrefix}-${index}`;
            if (part.startsWith('**') && part.endsWith('**')) {
                const innerText = part.slice(2, -2);
                return <strong key={key}><em>{renderTextWithLinks(innerText, `link-${key}`, renderedLinks)}</em></strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                const innerText = part.slice(1, -1);
                return <strong key={key}>{renderTextWithLinks(innerText, `link-${key}`, renderedLinks)}</strong>;
            }
            if (part.startsWith('"') && part.endsWith('"')) {
                const innerText = part.slice(1, -1);
                return <strong key={key}>{renderTextWithLinks(innerText, `link-${key}`, renderedLinks)}</strong>;
            }
            return renderTextWithLinks(part, `link-${key}`, renderedLinks);
        });
    };

    // Split the entire text into lines to process headings and regular text.
    const lines = text.split('\n');

    return (
        <>
            {lines.map((line, index) => {
                const key = `line-${index}`;
                // Check if the line is a heading
                if (line.trim().startsWith('###')) {
                    const content = line.replace(/^###\s*/, '');
                    return (
                        // Render heading as a block element with distinct styling
                        <div key={key} className="block text-xl font-bold text-purple-300 mt-5 mb-3">
                           {renderInline(content, `heading-${index}`)}
                        </div>
                    );
                }

                // If not a heading, it's regular text. We render it and add a newline character
                // back, so the parent `whitespace-pre-wrap` can handle it correctly.
                return (
                    <React.Fragment key={key}>
                        {renderInline(line, `text-${index}`)}
                        {index < lines.length - 1 && '\n'}
                    </React.Fragment>
                );
            })}
        </>
    );
};


// Function to split a long message into smaller, readable chunks
const splitLongMessage = (text: string): string[] => {
    const lines = text.split('\n');
    if (text.length < 500 && !lines.some(l => l.trim().startsWith('###'))) {
        return [text];
    }

    const messages: string[] = [];
    let currentMessage = "";
    const MAX_LENGTH = 500;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if adding the new line would exceed the max length
        if (currentMessage.length > 0 && (currentMessage.length + line.length + 1) > MAX_LENGTH) {
            const messageLines = currentMessage.trim().split('\n');
            const lastMessageLine = messageLines[messageLines.length - 1];

            // If the message has more than one line and its last line is a heading...
            if (messageLines.length > 1 && lastMessageLine.trim().startsWith('###')) {
                messageLines.pop(); // ...remove the heading from the current message...
                messages.push(messageLines.join('\n')); // ...push the rest of the message...
                // ...and start the new message with the heading plus the current line.
                currentMessage = `${lastMessageLine}\n${line}`;
            } else {
                // Otherwise, just push the completed message and start a new one.
                messages.push(currentMessage.trim());
                currentMessage = line;
            }
        } else {
            // Add the line to the current message
            currentMessage = currentMessage ? `${currentMessage}\n${line}` : line;
        }
    }

    // Add the last remaining message chunk
    if (currentMessage.trim().length > 0) {
        messages.push(currentMessage.trim());
    }

    return messages.filter(m => m.length > 0);
};


const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: Date.now(), sender: 'bot', text: "Merhaba! Ben MorzAI. Size ACM Hacettepe hakkında nasıl yardımcı olabilirim?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
    const [showInvitation, setShowInvitation] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const suggestionsContainerRef = useRef<HTMLDivElement>(null);
    const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const INACTIVITY_TIMEOUT = 45000; // 45 seconds
    const INACTIVITY_MESSAGES = [
        "Başka bir konuda yardımcı olabilir miyim?",
        "Eğer başka sorun varsa çekinme, buradayım!",
        "Hala burada mısın? Aklına takılan başka bir şey olursa sorabilirsin.",
        "Daha fazla sorun varsa, ben buradayım."
    ];

    const userSentMessages = messages
        .filter(msg => msg.sender === 'user')
        .map(msg => msg.text);

    const availableSuggestions = suggestions.filter(
        suggestion => !userSentMessages.includes(suggestion)
    );
    
    const showSuggestions = !isLoading && availableSuggestions.length > 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    // Prevent main page scroll when chatbot UI is scrolled
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            // This prevents the main page from scrolling when the user's mouse is over the chat.
            if (!container.contains(e.target as Node)) return;
            e.stopPropagation();

            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtTop = scrollTop === 0;
            const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1;
            
            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                // Only prevent if scrolling past the top/bottom of the chat history
                e.preventDefault();
            }
        };

        const parent = window;
        parent.addEventListener('wheel', handleWheel, { passive: false });

        return () => parent.removeEventListener('wheel', handleWheel);
    }, [isOpen]);

    // Handle horizontal scrolling in suggestions container with vertical mouse wheel
    useEffect(() => {
        const container = suggestionsContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY === 0 || container.scrollWidth <= container.clientWidth) return;
            e.preventDefault();
            e.stopPropagation();
            container.scrollLeft += e.deltaY;
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => container.removeEventListener('wheel', handleWheel);
    }, [showSuggestions]);

    const sendInactivityMessage = () => {
        if (!isOpen || isLoading) return;

        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot' && INACTIVITY_MESSAGES.includes(lastMessage.text)) {
            return;
        }

        const randomMessage = INACTIVITY_MESSAGES[Math.floor(Math.random() * INACTIVITY_MESSAGES.length)];
        const botMessage: Message = {
            id: Date.now(),
            sender: 'bot',
            text: randomMessage,
        };
        setMessages(prev => [...prev, botMessage]);
    };

    useEffect(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        if (!isOpen || isLoading) {
            return;
        }

        inactivityTimerRef.current = setTimeout(sendInactivityMessage, INACTIVITY_TIMEOUT);

        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [messages, isLoading, isOpen]);
    
    // Effect for showing the initial invitation message
    useEffect(() => {
        // Don't run this timer if a conversation has already started
        if (messages.some(m => m.sender === 'user')) {
            setShowInvitation(false);
            return;
        }

        const invitationTimer = setTimeout(() => {
            if (!isOpen) {
                setShowInvitation(true);
            }
        }, 15000); // Show invitation after 15 seconds of inactivity

        return () => clearTimeout(invitationTimer);
    }, [isOpen, messages]);

    const handleToggle = () => {
        setShowInvitation(false); // Hide invitation on any interaction
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        if (newIsOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    };
    
    const generateSuggestions = async (lastUserMessage: string, lastBotResponse: string) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `Kullanıcının son sorgusu ve botun cevabı göz önüne alındığında, 3 ila 5 adet yüksek derecede alakalı Türkçe takip sorusu oluştur. Bu sorular, kullanıcının konuyu daha fazla keşfetmesine veya ilgili ayrıntıları sormasına yardımcı olmalıdır. Amaç, kullanıcının bir sonraki mantıksal sorusunu tahmin etmektir. SADECE bir JSON dizesi dizisi döndür. Başka metin veya markdown ekleme. Örneğin: ["Bir sonraki etkinlik ne zaman?", "Üyelik ücretli mi?", "SIGAI nedir?"]

Son Konuşma:
Kullanıcı: "${lastUserMessage}"
Bot: "${lastBotResponse}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            let jsonString = response.text.trim();
            if (jsonString.startsWith('```json')) {
                jsonString = jsonString.substring(7, jsonString.length - 3).trim();
            } else if (jsonString.startsWith('```')) {
                jsonString = jsonString.substring(3, jsonString.length - 3).trim();
            }
            
            const newSuggestions = JSON.parse(jsonString);
            if (Array.isArray(newSuggestions) && newSuggestions.every(item => typeof item === 'string')) {
                setSuggestions(newSuggestions);
            }
        } catch (error) {
            console.error("Failed to generate or parse suggestions:", error);
            setSuggestions(INITIAL_SUGGESTIONS);
        }
    };

    const processAndDisplayBotResponse = (text: string, sources?: any[]) => {
        const messageParts = splitLongMessage(text);
        
        if (messageParts.length === 0) {
            setIsLoading(false);
            inputRef.current?.focus();
            return;
        }

        messageParts.forEach((part, index) => {
            setTimeout(() => {
                const isLastPart = index === messageParts.length - 1;
                const botMessage: Message = {
                    id: Date.now() + 1 + index,
                    sender: 'bot',
                    text: part,
                    sources: isLastPart && sources && sources.length > 0 ? sources : undefined,
                };
                setMessages(prev => [...prev, botMessage]);

                if (isLastPart) {
                    setIsLoading(false);
                    inputRef.current?.focus();
                }
            }, 800 * index); // Stagger message appearance
        });
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;
        setShowInvitation(false);

        if (messages.filter(m => m.sender === 'user').length === 0 && messageText.trim() === '/adminacmhacettepe') {
            setIsAdminMode(true);
            const adminWelcome: Message = {
                id: Date.now(),
                sender: 'bot',
                text: "🔑 **Admin Mode Activated**\n\nI will now explain my reasoning and provide the data source for each answer."
            };
            setMessages(prev => [...prev, adminWelcome]);
            setInputValue('');
            return;
        }
    
        const userMessage: Message = { id: Date.now(), sender: 'user', text: messageText };
        
        const conversationHistory = messages
            .slice(-4)
            .map(msg => `${msg.sender === 'user' ? 'Kullanıcı' : 'MorzAI'}: ${msg.text}`)
            .join('\n');
            
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        inputRef.current?.focus();
    
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const internalKnowledge = `
[STATIC KNOWLEDGE BASE]
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}
[/STATIC KNOWLEDGE BASE]

[TEAM DATA]
${JSON.stringify(TEAM_DATA.map(({ name, role }) => ({ name, role })), null, 2)}
[/TEAM DATA]

[ANNOUNCEMENTS]
${JSON.stringify(ANNOUNCEMENTS_DATA, null, 2)}
[/ANNOUNCEMENTS]

[PAST EVENTS]
${JSON.stringify(EVENT_SHOWCASE_DATA, null, 2)}
[/PAST EVENTS]
            `;

            const systemInstruction = `Sen ACM Hacettepe öğrenci topluluğu için yardımsever ve arkadaş canlısı bir asistansın. Adın MorzAI.
- Asla kendini yeniden tanıtma veya "Merhaba" gibi selamlamalarla başlama. Doğrudan kullanıcının sorusuna cevap ver.
- Kullanıcı Türkçe konuşuyor ve yazım hataları veya argo kelimeler kullanabilir (örneğin 'nbaer' aslında 'naber' olabilir), bu yüzden kullanıcının niyetini anlamaya odaklan.
- Cevapların hem eksiksiz hem de öz olmalı. İlgili tüm bilgileri ver, ancak bunu anlaşılır ve doğrudan bir şekilde yap. Uzun paragraflardan kaçın; bilgiyi organize etmek için listeler kullan.
- Tonun her zaman samimi ve yardımsever olmalı.`;

            const prompt = `Kullanıcının sorusunu analiz et ve sağlanan [INTERNAL KNOWLEDGE] ve [CONVERSATION HISTORY] bilgilerini kullanarak Türkçe olarak yardımsever, doğal ve sohbet havasında bir cevap oluştur.

Görevin:
1.  **ÖNCELİKLE** cevabı [INTERNAL KNOWLEDGE] içinde bulmaya çalış. Bu, web sitesinin kendi verisidir ve her zaman ilk başvurulacak kaynaktır.
2.  Eğer cevap [INTERNAL KNOWLEDGE] içinde kesinlikle bulunamıyorsa, **SADECE o zaman** genel bir cevap için Google Search kullan.
3.  Kullanıcının sorusunun bir önceki konuşmaya devam niteliğinde olup olmadığını anlamak için [CONVERSATION HISTORY] bölümünü kullan.
4.  JSON verilerini yorumla ve kullanıcıya arkadaşça, anlaşılır bir şekilde sun. JSON'u olduğu gibi tekrarlama.
5.  **Kapsamlı ama Öz Ol:** Dahili bilgiden ilgili tüm ayrıntıları sağla. Cevaplarını kolayca anlaşılacak şekilde yapılandır. Birden fazla öğe için listeler kullan. Amacın, aşırıya kaçmadan tam bilgilendirici olmaktır.
6.  Biçimlendirme için markdown kullan: vurgu için *kelime* veya "kelime" kullan ve başlıklar için satır başına '###' koy.
7.  Sitenin diğer sayfalarına (ekip sayfası, etkinlikler sayfası, iletişim sayfası veya kayıt sayfası gibi) atıfta bulunurken, otomatik bağlantı sağlamak için 'ekip sayfası', 'etkinlikler sayfası' gibi ifadeler kullan.

[INTERNAL KNOWLEDGE]
${internalKnowledge}
[/INTERNAL KNOWLEDGE]

[CONVERSATION HISTORY]
${conversationHistory}
[/CONVERSATION HISTORY]

Kullanıcının Sorusu: "${messageText}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    tools: [{ googleSearch: {} }],
                },
            });
    
            let fullResponseText = response.text;
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const sources = groundingChunks
                ?.map((chunk: any) => chunk.web)
                .filter((web: any): web is { uri: string, title: string } => !!(web?.uri && web?.title));

            let sourceInfo = '';
            if (sources && sources.length > 0) {
                sourceInfo = "🌐 **Source:** Google Search\n\n";
            } else {
                sourceInfo = "🧠 **Source:** Internal Website Data\n\n";
            }
    
            if (isAdminMode) {
                fullResponseText = sourceInfo + fullResponseText;
            }

            processAndDisplayBotResponse(fullResponseText, sources);
            generateSuggestions(userMessage.text, fullResponseText);
            
        } catch (error) {
            console.error("Error generating content:", error);
            const errorMessage = "Üzgünüm, şu anda beynime bağlanmakta sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.";
            processAndDisplayBotResponse(errorMessage);
            generateSuggestions(userMessage.text, errorMessage);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const handleSuggestionClick = (question: string) => {
        sendMessage(question);
    };

    const cyberGridStyle: React.CSSProperties = {
        backgroundImage: `
            linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '2rem 2rem',
    };

    return (
        <>
            {/* Chat Window */}
            <div 
                className={`fixed bottom-24 right-5 z-40 w-[calc(100vw-40px)] max-w-xl h-[70vh] max-h-[700px] rounded-lg border border-slate-700 bg-slate-900/80 backdrop-blur-lg shadow-2xl shadow-purple-900/50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                style={{transformOrigin: 'bottom right'}}
                aria-hidden={!isOpen}
            >
                <div className="absolute inset-0 -z-10" style={cyberGridStyle}></div>

                {/* Header */}
                <div className="relative flex-shrink-0 flex items-center justify-between p-4 bg-slate-900/50">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                             <img src={AVATAR_URL} alt="MorzAI Avatar" className="w-10 h-10 rounded-full border-2 border-purple-500" />
                             <div className="absolute inset-0 rounded-full border-2 border-purple-500 animate-pulse"></div>
                        </div>
                        <h3 className="font-mono font-bold text-purple-400">MorzAI {isAdminMode && <span className="text-red-500">[ADMIN]</span>}</h3>
                    </div>
                    <button onClick={handleToggle} aria-label="Close chat"><XIcon className="w-6 h-6 text-slate-400 hover:text-white transition-colors" /></button>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-2.5 animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && (
                                <img src={AVATAR_URL} alt="MorzAI Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                            )}
                            <div className={`flex flex-col gap-1 w-full max-w-[90%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`w-fit max-w-full rounded-lg px-3.5 py-2 font-mono break-words shadow-md whitespace-pre-wrap leading-relaxed text-xs ${
                                    msg.sender === 'user' 
                                    ? 'bg-gradient-to-br from-purple-600 to-cyan-600 text-white rounded-br-none' 
                                    : 'bg-slate-800 text-slate-300 rounded-bl-none'
                                }`}>
                                    {msg.sender === 'bot' ? <FormattedMessage text={msg.text} /> : msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-2.5 justify-start animate-fade-in-up">
                            <img src={AVATAR_URL} alt="MorzAI Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                            <div className="rounded-lg px-3 py-2 bg-slate-800 text-slate-300 rounded-bl-none">
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.3s]" style={{filter: 'drop-shadow(0 0 2px #a855f7)'}}></span>
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:-0.15s]" style={{filter: 'drop-shadow(0 0 2px #a855f7)'}}></span>
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{filter: 'drop-shadow(0 0 2px #a855f7)'}}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Suggestions */}
                {showSuggestions && (
                    <div className="flex-shrink-0 px-4 pt-2 pb-2 border-t border-slate-700/50">
                        <div ref={suggestionsContainerRef} className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                            {availableSuggestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestionClick(q)}
                                    className="flex-shrink-0 font-mono text-xs text-purple-300 border border-purple-500/50 rounded-full px-3 py-1 hover:bg-purple-500/20 transition-colors whitespace-nowrap"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {/* Input */}
                <div className={`relative flex-shrink-0 p-4 bg-slate-900/50 ${!showSuggestions ? 'border-t border-slate-700' : ''} transition-shadow duration-300 ${isInputFocused ? 'shadow-[0_0_20px_theme(colors.purple.700)]' : ''}`}>
                     <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-opacity duration-300 ${isInputFocused ? 'opacity-100' : 'opacity-50'}`}></div>
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            placeholder="Bir soru sor..."
                            className="w-full bg-slate-800 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono transition-colors"
                        />
                        <button type="submit" aria-label="Send message" className="p-2 bg-purple-600 rounded-full text-white disabled:opacity-50 transition-all duration-300 hover:bg-purple-500 hover:shadow-[0_0_10px_theme(colors.purple.500)]" disabled={isLoading || !inputValue.trim()}>
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Invitation Bubble */}
            {showInvitation && (
                <div 
                    className="fixed bottom-[5.75rem] right-5 z-40 w-full max-w-[280px] rounded-lg border border-purple-500 bg-slate-800 shadow-xl shadow-purple-900/50 flex flex-col items-center p-4 animate-fade-in-up"
                    style={{transformOrigin: 'bottom right'}}
                >
                    <button
                        onClick={() => setShowInvitation(false)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
                        aria-label="Dismiss invitation"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                         <img src={AVATAR_URL} alt="MorzAI Avatar" className="w-8 h-8 rounded-full" />
                         <p className="font-mono text-slate-300">"Selam, benimle tanıştın mı?"</p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={handleToggle}
                aria-label={isOpen ? 'Sohbeti kapat' : 'Sohbeti aç'}
                className={`fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_theme(colors.purple.500)] ${!isOpen ? 'animate-pulse-ring' : ''}`}
            >
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 transform scale-50 rotate-45' : 'opacity-100 transform scale-100 rotate-0'}`}>
                        <ChatIcon className="w-8 h-8" />
                    </div>
                    <div className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 transform scale-100 rotate-0' : 'opacity-0 transform scale-50 -rotate-45'}`}>
                        <XIcon className="w-8 h-8" />
                    </div>
                </div>
            </button>
        </>
    );
};

export default Chatbot;