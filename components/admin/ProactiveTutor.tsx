import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { KNOWLEDGE_BASE } from '../../knowledgeBase';
import { KnowledgeRecord } from '../../types';

interface ProactiveTutorProps {
    onGenerated: (generatedCode: string) => void;
}

const ProactiveTutor: React.FC<ProactiveTutorProps> = ({ onGenerated }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');
    const [information, setInformation] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || !information.trim()) {
            setStatusMessage('Please fill in both fields.');
            return;
        }
        setIsGenerating(true);
        setStatusMessage('Generating structured knowledge...');

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
            
            const prompt = `You are an expert data curator for a university student club's chatbot knowledge base. An admin has provided a topic/question and raw information. Transform this into a high-quality, structured KnowledgeRecord JSON object.
            1.  **Synthesize Content:** Rewrite the raw information into a clear, concise, and helpful response in Turkish, suitable for a chatbot. Use the topic/question for context.
            2.  **Assign Category:** Choose the most appropriate category from the list.
            3.  **Generate Keywords:** Create 5-10 relevant keywords in both English and Turkish.
            4.  **Output Format:** Respond with a single, valid JSON object adhering to the schema. No extra text or markdown.
            
            [Topic/Question]
            ${topic}
            
            [Raw Information]
            ${information}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: knowledgeRecordSchema }
            });

            const record: Omit<KnowledgeRecord, 'id'> = JSON.parse(response.text.trim());
            const startingId = KNOWLEDGE_BASE.length > 0 ? Math.max(...KNOWLEDGE_BASE.map(k => k.id)) + 1 : 1;
            const content = record.content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
            const keywordsString = record.keywords.map(k => `    '${k.replace(/'/g, "\\'")}'`).join(',\n');
            const codeString = `,\n  {\n    id: ${startingId},\n    category: '${record.category}',\n    content: \`${content}\`,\n    keywords: [\n${keywordsString}\n    ],\n  }`;

            onGenerated(codeString);
            setTopic('');
            setInformation('');
            setStatusMessage('');

        } catch (error) {
            console.error("Error generating proactive knowledge:", error);
            setStatusMessage(`Error: ${error instanceof Error ? error.message : 'Could not generate knowledge.'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const primaryButtonStyles = "w-full px-8 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md relative group disabled:opacity-50 disabled:cursor-not-allowed";
    const inputStyles = "w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="topic" className="block text-sm font-mono text-purple-400 mb-2">Topic or User Question</label>
                <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., How does the mentorship program work?"
                    disabled={isGenerating}
                    className={inputStyles}
                    required
                />
            </div>
            <div>
                <label htmlFor="information" className="block text-sm font-mono text-purple-400 mb-2">Information / Answer</label>
                <textarea
                    id="information"
                    rows={8}
                    value={information}
                    onChange={(e) => setInformation(e.target.value)}
                    placeholder="Provide the detailed answer here..."
                    disabled={isGenerating}
                    className={inputStyles}
                    required
                />
            </div>
            <div className="pt-2">
                <button type="submit" disabled={isGenerating} className={primaryButtonStyles}>
                    {isGenerating ? 'Generating...' : 'Generate Knowledge'}
                </button>
            </div>
            {statusMessage && (
                <p className="text-center font-mono text-sm text-slate-400">{statusMessage}</p>
            )}
        </form>
    );
};

export default ProactiveTutor;
