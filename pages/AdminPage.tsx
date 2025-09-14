import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import Section from '../components/Section';
import GlowPanel from '../components/GlowPanel';
import Modal from '../components/Modal';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { XIcon } from '../components/icons/XIcon';
import { KNOWLEDGE_BASE } from '../knowledgeBase';
import { KnowledgeRecord } from '../types';

interface ConversationTurn {
    role: 'ai' | 'admin' | 'status';
    content: string;
}

const AVATAR_URL = 'https://storage.googleapis.com/aistudio-programmable-ui-project-assets/morzai-avatar.png';

const AdminPage: React.FC = () => {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [adminAnswer, setAdminAnswer] = useState('');
    const [conversation, setConversation] = useState<ConversationTurn[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [copyStatus, setCopyStatus] = useState('Copy');
    const conversationContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationContainerRef.current) {
            const container = conversationContainerRef.current;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [conversation]);

    const addTurn = (turn: ConversationTurn) => {
        setConversation(prev => [...prev, turn]);
    };

    const generateNewQuestion = async () => {
        setIsLoading(true);
        setCurrentQuestion('');
        addTurn({ role: 'status', content: 'MorzAI new question...' });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const knowledgeContext = KNOWLEDGE_BASE.map(
                (item) => `Category: ${item.category}\nContent: ${item.content}`
            ).join('\n\n');
            
            const historyContext = conversation
                .filter(turn => turn.role === 'ai') // Only consider past questions
                .map(turn => `- ${turn.content}`)
                .join('\n');

            const prompt = `You are an AI assistant tasked with expanding a knowledge base for the ACM Hacettepe student chapter. Your goal is to identify gaps in the existing knowledge and ask a clear, concise question in Turkish to an admin to fill that gap.

Analyze the existing knowledge base and the list of previously asked questions. Do not repeat a question that has already been asked in this session. Formulate a new, unique question that explores an area not yet covered or one that needs more detail.

[EXISTING KNOWLEDGE BASE]
${knowledgeContext}
[END EXISTING KNOWLEDGE BASE]

[PREVIOUSLY ASKED QUESTIONS IN THIS SESSION]
${historyContext || 'No questions asked yet.'}
[END PREVIOUSLY ASKED QUESTIONS]

Now, ask your next single question in Turkish.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const newQuestion = response.text.trim();
            setCurrentQuestion(newQuestion);
            addTurn({ role: 'ai', content: newQuestion });

        } catch (error) {
            console.error("Error generating question:", error);
            addTurn({ role: 'status', content: 'Error: Could not generate a new question. Please try again.' });
            setCurrentQuestion('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartSession = () => {
        setSessionStarted(true);
        setConversation([]);
        generateNewQuestion();
    };

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminAnswer.trim() || isLoading || isGenerating) return;

        addTurn({ role: 'admin', content: adminAnswer });
        setAdminAnswer('');
        await generateNewQuestion();
    };

    const handleSkipQuestion = async () => {
        if (isLoading || isGenerating) return;
        addTurn({ role: 'status', content: 'Question skipped.' });
        setAdminAnswer('');
        await generateNewQuestion();
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSessionStarted(false);
        setConversation([]);
        setCurrentQuestion('');
        setAdminAnswer('');
        setGeneratedCode('');
    };

    const handleEndSession = async () => {
        addTurn({ role: 'status', content: 'Analyzing conversation...' });
        
        const qaPairs: { question: string; answer: string }[] = [];
        let activeQuestion: string | null = null;

        conversation.forEach(turn => {
            if (turn.role === 'ai') {
                activeQuestion = turn.content;
            } else if (turn.role === 'admin' && activeQuestion) {
                qaPairs.push({ question: activeQuestion, answer: turn.content });
                activeQuestion = null;
            }
        });
        
        if (qaPairs.length === 0) {
            addTurn({ role: 'status', content: 'No new question/answer pairs found to process.' });
            handleCloseModal();
            return;
        }

        setIsGenerating(true);
        addTurn({ role: 'status', content: `Found ${qaPairs.length} pair(s). Generating structured knowledge... This may take a moment.` });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const knowledgeRecordSchema = {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: "The category of the knowledge. Must be one of: 'Membership', 'Events', 'About', 'Team', 'Contact', 'Technical', 'General'.",
                    },
                    content: {
                        type: Type.STRING,
                        description: "A refined, user-facing answer in Turkish based on the admin's raw response and the AI's original question.",
                    },
                    keywords: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                        },
                        description: "An array of 5-10 relevant keywords in both English and Turkish to aid in searching.",
                    },
                },
                required: ['category', 'content', 'keywords'],
            };

            const generationPromises = qaPairs.map(pair => {
                const prompt = `You are an expert data curator for a university student club's chatbot knowledge base. Your task is to take a question (asked by an AI) and a raw answer (provided by a human admin) and transform them into a high-quality, structured KnowledgeRecord JSON object.

                Follow these rules strictly:
                1.  **Synthesize Content:** Rewrite the raw answer into a clear, concise, and helpful response in Turkish, suitable for a user-facing chatbot. Use the original question to understand the context. The tone should be friendly and informative.
                2.  **Assign Category:** Choose the most appropriate category from this list: 'Membership', 'Events', 'About', 'Team', 'Contact', 'Technical', 'General'.
                3.  **Generate Keywords:** Create a list of 5-10 relevant keywords in both English and Turkish.
                4.  **Output Format:** Your response must be a single, valid JSON object that adheres to the provided schema. Do not include any other text, explanations, or markdown formatting like \`\`\`json.

                [Question]
                ${pair.question}

                [Raw Answer]
                ${pair.answer}`;

                return ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: knowledgeRecordSchema,
                    }
                });
            });

            const responses = await Promise.all(generationPromises);
            
            const newKnowledgeRecords: Omit<KnowledgeRecord, 'id'>[] = responses.map(response => {
                try {
                    const jsonText = response.text.trim();
                    const parsed = JSON.parse(jsonText);
                    if (parsed.category && parsed.content && Array.isArray(parsed.keywords)) {
                        return parsed;
                    }
                    return null;
                } catch (e) {
                    console.error("Failed to parse JSON from AI response:", response.text, e);
                    return null;
                }
            }).filter((record): record is Omit<KnowledgeRecord, 'id'> => record !== null);


            if (newKnowledgeRecords.length === 0) {
                addTurn({ role: 'status', content: 'Could not generate valid knowledge records. Please review the session and try again.' });
                setIsGenerating(false);
                return;
            }

            const startingId = KNOWLEDGE_BASE.length > 0 ? Math.max(...KNOWLEDGE_BASE.map(k => k.id)) + 1 : 1;

            const codeString = newKnowledgeRecords.map((record, index) => {
                const id = startingId + index;
                const content = record.content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
                const keywordsString = record.keywords.map(k => `    '${k.replace(/'/g, "\\'")}'`).join(',\n');
                
                return `  {
    id: ${id},
    category: '${record.category}',
    content: \`${content}\`,
    keywords: [\n${keywordsString}\n    ],
  }`;
            }).join(',\n\n');

            setGeneratedCode(codeString);
            setCopyStatus('Copy');
            setIsModalOpen(true);

        } catch (error) {
            console.error("Error during knowledge generation process:", error);
            addTurn({ role: 'status', content: 'A critical error occurred while generating knowledge. Please check the console.' });
        } finally {
            setIsGenerating(false);
        }
    };

    // Fix: Implement the handleCopyToClipboard function.
    const handleCopyToClipboard = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setCopyStatus('Error');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        });
    };

    const primaryButtonStyles = "w-full px-8 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
    const secondaryButtonStyles = "w-full px-8 py-3 font-mono font-bold text-lg text-purple-400 bg-transparent border border-purple-500 rounded-md relative group disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/10 transition-colors";

    return (
        <Section id="admin-tutor" title="[AI_Tutor]">
            <div className="max-w-4xl mx-auto">
                <p className="text-center text-lg text-slate-400 mb-12">
                    Expand MorzAI's knowledge base by teaching it new information. When you start a session, the AI will ask you questions to fill in the gaps.
                </p>
                <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg">
                    {!sessionStarted ? (
                        <div className="text-center">
                            <button onClick={handleStartSession} className={primaryButtonStyles}>
                                <span className="glitch-hover" data-text="Start Tutoring Session">
                                    Start Tutoring Session
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div ref={conversationContainerRef} className="space-y-4 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                                {conversation.map((turn, index) => (
                                    <div key={index} className={`flex items-start gap-3 animate-fade-in-up ${
                                        turn.role === 'admin' ? 'justify-end' : ''
                                    } ${
                                        turn.role === 'status' ? 'justify-center' : ''
                                    }`}>
                                        {turn.role === 'ai' && <img src={AVATAR_URL} alt="AI Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                                        
                                        <div className={`max-w-[85%] rounded-lg px-4 py-2 font-mono break-words ${
                                            turn.role === 'ai' ? 'bg-slate-800 text-slate-300 rounded-bl-none' : ''
                                        } ${
                                            turn.role === 'admin' ? 'bg-purple-600 text-white rounded-br-none' : ''
                                        } ${
                                            turn.role === 'status' ? 'bg-slate-700/50 text-slate-400 italic text-sm' : ''
                                        }`}>
                                            {turn.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSubmitAnswer} className="space-y-4 pt-6 border-t border-slate-700">
                                 <label htmlFor="adminAnswer" className="block text-sm font-mono text-purple-400 mb-2">
                                     Your Answer:
                                 </label>
                                <textarea
                                    id="adminAnswer"
                                    rows={5}
                                    value={adminAnswer}
                                    onChange={(e) => setAdminAnswer(e.target.value)}
                                    placeholder={isLoading ? 'AI is thinking...' : 'Enter your answer here...'}
                                    disabled={isLoading || !currentQuestion || isGenerating}
                                    className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                                    required
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleSkipQuestion}
                                        disabled={isLoading || !currentQuestion || isGenerating}
                                        className={secondaryButtonStyles}
                                    >
                                        <span className="relative glitch-hover" data-text="Skip Question">
                                            Skip Question
                                        </span>
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || !adminAnswer.trim() || isGenerating} 
                                        className={primaryButtonStyles}
                                    >
                                        <span className="relative glitch-hover" data-text="Teach This Answer">
                                            Teach This Answer
                                        </span>
                                    </button>
                                </div>
                            </form>
                             <div className="mt-6 pt-6 border-t border-slate-700">
                                <button
                                    onClick={handleEndSession}
                                    disabled={isGenerating}
                                    className="w-full px-8 py-3 font-mono font-bold text-lg text-red-400 bg-transparent border border-red-500 rounded-md relative group disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500/10 transition-colors"
                                >
                                    {isGenerating ? 'Generating...' : 'End Session & Generate Knowledge'}
                                </button>
                            </div>
                        </div>
                    )}
                </GlowPanel>
                 <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Generated Knowledge Code"
                >
                    <div className="space-y-4">
                        <p className="font-mono text-slate-400">
                            Copy the code below and add it to the <code className="bg-slate-700 text-purple-300 px-1 rounded">KNOWLEDGE_BASE</code> array in the <code className="bg-slate-700 text-purple-300 px-1 rounded">knowledgeBase.ts</code> file.
                        </p>
                        <div className="relative">
                            <pre className="bg-slate-900/50 border border-slate-600 rounded-md p-4 text-slate-200 max-h-80 overflow-auto custom-scrollbar">
                                <code className="font-mono text-sm whitespace-pre-wrap">{generatedCode}</code>
                            </pre>
                            <button
                                onClick={handleCopyToClipboard}
                                className="absolute top-2 right-2 p-2 bg-slate-700/50 rounded-md hover:bg-purple-500/20 text-slate-300 hover:text-white transition-colors"
                                aria-label="Copy code to clipboard"
                            >
                                {copyStatus === 'Copy' && <ClipboardIcon className="w-5 h-5" />}
                                {copyStatus === 'Copied!' && <CheckIcon className="w-5 h-5 text-green-400" />}
                                {copyStatus === 'Error' && <XIcon className="w-5 h-5 text-red-400" />}
                            </button>
                        </div>
                        <button
                            onClick={handleCloseModal}
                            className="w-full mt-4 px-8 py-2 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md"
                        >
                            Close & Reset Session
                        </button>
                    </div>
                </Modal>
            </div>
        </Section>
    );
};

export default AdminPage;