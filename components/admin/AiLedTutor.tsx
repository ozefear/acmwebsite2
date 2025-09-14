import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { KNOWLEDGE_BASE } from '../../knowledgeBase';
import { KnowledgeRecord } from '../../types';

interface ConversationTurn {
    role: 'ai' | 'admin' | 'status';
    content: string;
}

interface AiLedTutorProps {
    onSessionEnd: (generatedCode: string) => void;
}

const AVATAR_URL = 'https://storage.googleapis.com/aistudio-programmable-ui-project-assets/morzai-avatar.png';

const AiLedTutor: React.FC<AiLedTutorProps> = ({ onSessionEnd }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [adminAnswer, setAdminAnswer] = useState('');
    const [conversation, setConversation] = useState<ConversationTurn[]>([]);
    const conversationContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        generateNewQuestion();
    }, []);

    useEffect(() => {
        if (conversationContainerRef.current) {
            const container = conversationContainerRef.current;
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }, [conversation]);

    const addTurn = (turn: ConversationTurn) => setConversation(prev => [...prev, turn]);

    const generateNewQuestion = async () => {
        setIsLoading(true);
        setCurrentQuestion('');
        addTurn({ role: 'status', content: 'MorzAI new question...' });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const knowledgeContext = KNOWLEDGE_BASE.map(item => `Category: ${item.category}\nContent: ${item.content}`).join('\n\n');
            const historyContext = conversation.filter(turn => turn.role === 'ai').map(turn => `- ${turn.content}`).join('\n');

            const prompt = `You are an AI assistant tasked with expanding a knowledge base for the ACM Hacettepe student chapter. Your goal is to identify gaps in the existing knowledge and ask a clear, concise question in Turkish to an admin to fill that gap. Analyze the existing knowledge base and the list of previously asked questions. Do not repeat a question that has already been asked in this session. Formulate a new, unique question that explores an area not yet covered or one that needs more detail.

[EXISTING KNOWLEDGE BASE]
${knowledgeContext}
[END EXISTING KNOWLEDGE BASE]

[PREVIOUSLY ASKED QUESTIONS IN THIS SESSION]
${historyContext || 'No questions asked yet.'}
[END PREVIOUSLY ASKED QUESTIONS]

Now, ask your next single question in Turkish.`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
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

    const handleEndSession = async () => {
        addTurn({ role: 'status', content: 'Analyzing conversation...' });
        
        const qaPairs: { question: string; answer: string }[] = [];
        let activeQuestion: string | null = null;

        conversation.forEach(turn => {
            if (turn.role === 'ai') activeQuestion = turn.content;
            else if (turn.role === 'admin' && activeQuestion) {
                qaPairs.push({ question: activeQuestion, answer: turn.content });
                activeQuestion = null;
            }
        });
        
        if (qaPairs.length === 0) {
            onSessionEnd(''); // No new code to generate
            return;
        }

        setIsGenerating(true);
        addTurn({ role: 'status', content: `Found ${qaPairs.length} pair(s). Generating structured knowledge...` });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const knowledgeRecordSchema = {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, description: "One of: 'Membership', 'Events', 'About', 'Team', 'Contact', 'Technical', 'General'." },
                    content: { type: Type.STRING, description: "A refined, user-facing answer in Turkish." },
                    keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5-10 relevant keywords in both English and Turkish." },
                },
                required: ['category', 'content', 'keywords'],
            };

            const generationPromises = qaPairs.map(pair => {
                const prompt = `Take a question (asked by an AI) and a raw answer (from a human admin) and transform them into a high-quality, structured KnowledgeRecord JSON object.
                1.  **Synthesize Content:** Rewrite the raw answer into a clear, concise, and helpful response in Turkish.
                2.  **Assign Category:** Choose the most appropriate category from the list.
                3.  **Generate Keywords:** Create 5-10 relevant keywords in both English and Turkish.
                4.  **Output Format:** Respond with a single, valid JSON object adhering to the schema. No extra text or markdown.
                [Question]
                ${pair.question}
                [Raw Answer]
                ${pair.answer}`;
                return ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: "application/json", responseSchema: knowledgeRecordSchema }
                });
            });

            const responses = await Promise.all(generationPromises);
            const newKnowledgeRecords: Omit<KnowledgeRecord, 'id'>[] = responses
                .map(response => {
                    try { return JSON.parse(response.text.trim()); } catch (e) { return null; }
                })
                .filter((r): r is Omit<KnowledgeRecord, 'id'> => r !== null);

            if (newKnowledgeRecords.length === 0) {
                onSessionEnd('// No valid knowledge records were generated.');
                return;
            }

            const startingId = KNOWLEDGE_BASE.length > 0 ? Math.max(...KNOWLEDGE_BASE.map(k => k.id)) + 1 : 1;
            const codeString = newKnowledgeRecords.map((record, index) => {
                const id = startingId + index;
                const content = record.content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
                const keywordsString = record.keywords.map(k => `    '${k.replace(/'/g, "\\'")}'`).join(',\n');
                return `,\n  {\n    id: ${id},\n    category: '${record.category}',\n    content: \`${content}\`,\n    keywords: [\n${keywordsString}\n    ],\n  }`;
            }).join('');

            onSessionEnd(codeString);

        } catch (error) {
            console.error("Error during knowledge generation:", error);
            onSessionEnd(`// An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const primaryButtonStyles = "w-full px-8 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md relative group disabled:opacity-50 disabled:cursor-not-allowed";
    const secondaryButtonStyles = "w-full px-8 py-3 font-mono font-bold text-lg text-purple-400 bg-transparent border border-purple-500 rounded-md relative group disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500/10 transition-colors";

    return (
        <div className="space-y-6">
            <div ref={conversationContainerRef} className="space-y-4 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                {conversation.map((turn, index) => (
                    <div key={index} className={`flex items-start gap-3 animate-fade-in-up ${turn.role === 'admin' ? 'justify-end' : ''} ${turn.role === 'status' ? 'justify-center' : ''}`}>
                        {turn.role === 'ai' && <img src={AVATAR_URL} alt="AI Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                        <div className={`max-w-[85%] rounded-lg px-4 py-2 font-mono break-words ${turn.role === 'ai' ? 'bg-slate-800 text-slate-300 rounded-bl-none' : ''} ${turn.role === 'admin' ? 'bg-purple-600 text-white rounded-br-none' : ''} ${turn.role === 'status' ? 'bg-slate-700/50 text-slate-400 italic text-sm' : ''}`}>
                            {turn.content}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmitAnswer} className="space-y-4 pt-6 border-t border-slate-700">
                <label htmlFor="adminAnswer" className="block text-sm font-mono text-purple-400 mb-2">Your Answer:</label>
                <textarea id="adminAnswer" rows={5} value={adminAnswer} onChange={(e) => setAdminAnswer(e.target.value)} placeholder={isLoading ? 'AI is thinking...' : 'Enter your answer here...'} disabled={isLoading || !currentQuestion || isGenerating} className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button type="button" onClick={handleSkipQuestion} disabled={isLoading || !currentQuestion || isGenerating} className={secondaryButtonStyles}>Skip Question</button>
                    <button type="submit" disabled={isLoading || !adminAnswer.trim() || isGenerating} className={primaryButtonStyles}>Teach This Answer</button>
                </div>
            </form>
            <div className="mt-6 pt-6 border-t border-slate-700">
                <button onClick={handleEndSession} disabled={isGenerating} className="w-full px-8 py-3 font-mono font-bold text-lg text-red-400 bg-transparent border border-red-500 rounded-md relative group disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500/10 transition-colors">
                    {isGenerating ? 'Generating...' : 'End Session & Generate Knowledge'}
                </button>
            </div>
        </div>
    );
};

export default AiLedTutor;
