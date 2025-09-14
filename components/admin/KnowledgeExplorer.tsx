import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { KNOWLEDGE_BASE } from '../../knowledgeBase';
import { KnowledgeRecord } from '../../types';
import Modal from '../Modal';
import { PencilIcon } from '../icons/PencilIcon';

interface KnowledgeExplorerProps {
    onEditGenerated: (generatedCode: string) => void;
}

const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({ onEditGenerated }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentItem, setCurrentItem] = useState<KnowledgeRecord | null>(null);

    const filteredKnowledge = useMemo(() => {
        if (!searchTerm) return KNOWLEDGE_BASE;
        const lowercasedTerm = searchTerm.toLowerCase();
        return KNOWLEDGE_BASE.filter(item =>
            item.category.toLowerCase().includes(lowercasedTerm) ||
            item.content.toLowerCase().includes(lowercasedTerm) ||
            item.keywords.some(k => k.toLowerCase().includes(lowercasedTerm))
        );
    }, [searchTerm]);

    const handleEditClick = (item: KnowledgeRecord) => {
        setCurrentItem(JSON.parse(JSON.stringify(item))); // Deep copy to avoid mutating original
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = async () => {
        if (!currentItem) return;
        setIsGenerating(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const keywordSchema = {
                type: Type.ARRAY,
                items: { type: Type.STRING },
            };

            const prompt = `Based on the following updated information for a chatbot, generate a new list of 5-10 highly relevant keywords in both English and Turkish.
            [Category]: ${currentItem.category}
            [Content]: ${currentItem.content}
            Respond ONLY with a valid JSON array of strings. Do not include any other text or markdown.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: keywordSchema }
            });
            
            const newKeywords: string[] = JSON.parse(response.text.trim());
            
            const updatedItem = { ...currentItem, keywords: newKeywords };
            
            const content = updatedItem.content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
            const keywordsString = updatedItem.keywords.map(k => `    '${k.replace(/'/g, "\\'")}'`).join(',\n');
            const codeString = `{\n    id: ${updatedItem.id},\n    category: '${updatedItem.category}',\n    content: \`${content}\`,\n    keywords: [\n${keywordsString}\n    ],\n  }`;
            
            onEditGenerated(codeString);
            setIsEditModalOpen(false);

        } catch (error) {
            console.error("Error updating knowledge record:", error);
            // Optionally show an error to the user
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by category, content, or keyword..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {filteredKnowledge.map(item => (
                    <div key={item.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex justify-between items-start gap-4">
                        <div className="flex-grow">
                            <span className="text-xs font-mono bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{item.category}</span>
                            <p className="mt-3 text-slate-300 font-mono text-sm">{item.content}</p>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {item.keywords.slice(0, 5).map(k => <span key={k} className="text-xs font-mono bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{k}</span>)}
                                {item.keywords.length > 5 && <span className="text-xs font-mono text-slate-500">...</span>}
                            </div>
                        </div>
                        <button onClick={() => handleEditClick(item)} className="p-2 text-slate-400 hover:text-purple-400 transition-colors flex-shrink-0">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
            
            {currentItem && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Record #${currentItem.id}`}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-mono text-purple-400 mb-2">Category</label>
                            <input type="text" value={currentItem.category} onChange={(e) => setCurrentItem(prev => prev ? {...prev, category: e.target.value} : null)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-mono text-purple-400 mb-2">Content</label>
                            <textarea rows={8} value={currentItem.content} onChange={(e) => setCurrentItem(prev => prev ? {...prev, content: e.target.value} : null)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 custom-scrollbar" />
                        </div>
                        <p className="text-sm text-slate-500 font-mono">Keywords will be re-generated by the AI upon saving.</p>
                        <button onClick={handleSaveChanges} disabled={isGenerating} className="w-full mt-4 px-8 py-2 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md disabled:opacity-50">
                            {isGenerating ? 'Generating...' : 'Save & Generate Code'}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default KnowledgeExplorer;
