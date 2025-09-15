import React, { useState } from 'react';
import Section from '../components/Section';
import GlowPanel from '../components/GlowPanel';
import Modal from '../components/Modal';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { XIcon } from '../components/icons/XIcon';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { DatabaseIcon } from '../components/icons/DatabaseIcon';

// Import the new Admin sub-components
import AiLedTutor from '../components/admin/AiLedTutor';
import ProactiveTutor from '../components/admin/ProactiveTutor';
import KnowledgeExplorer from '../components/admin/KnowledgeExplorer';

type AdminMode = 'idle' | 'ai-led' | 'proactive' | 'explorer';

const AdminPage: React.FC = () => {
    const [mode, setMode] = useState<AdminMode>('idle');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [copyStatus, setCopyStatus] = useState('Copy');

    const handleShowGeneratedCode = (code: string) => {
        setGeneratedCode(code);
        setCopyStatus('Copy');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setGeneratedCode('');
        // Reset the mode to idle after closing the modal from a session end
        if (mode !== 'explorer') {
            setMode('idle');
        }
    };

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
    
    const renderContent = () => {
        switch (mode) {
            case 'ai-led':
                return <AiLedTutor onSessionEnd={handleShowGeneratedCode} />;
            case 'proactive':
                return <ProactiveTutor onGenerated={handleShowGeneratedCode} />;
            case 'explorer':
                return <KnowledgeExplorer onEditGenerated={handleShowGeneratedCode} />;
            case 'idle':
            default:
                return (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <ModeCard
                            icon={<BrainCircuitIcon className="w-12 h-12 mx-auto mb-4" />}
                            title="AI-Led Tutoring"
                            description="Let MorzAI ask you questions to intelligently fill gaps in its knowledge base."
                            onClick={() => setMode('ai-led')}
                        />
                        <ModeCard
                            icon={<PlusCircleIcon className="w-12 h-12 mx-auto mb-4" />}
                            title="Proactive Tutoring"
                            description="Directly teach MorzAI new information by providing a topic and an answer."
                            onClick={() => setMode('proactive')}
                        />
                        <ModeCard
                            icon={<DatabaseIcon className="w-12 h-12 mx-auto mb-4" />}
                            title="Knowledge Explorer"
                            description="View, search, and edit existing entries in the AI's knowledge base."
                            onClick={() => setMode('explorer')}
                        />
                    </div>
                );
        }
    }

    return (
        <Section id="admin-tutor" title="[MorzAI_Control_Panel]">
            <div className="max-w-6xl mx-auto">
                {mode === 'idle' ? (
                     <p className="text-center text-lg text-slate-400 mb-12">
                        Select a tool to manage and expand MorzAI's knowledge.
                    </p>
                ) : (
                    <div className="mb-8">
                        <button
                            onClick={() => setMode('idle')}
                            className="font-mono text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            &lt; Back to Admin Menu
                        </button>
                    </div>
                )}
               
                <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg min-h-[300px]">
                    {renderContent()}
                </GlowPanel>

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Generated Knowledge Code"
                >
                    <div className="space-y-4">
                        <p className="font-mono text-slate-400">
                            Copy the code below and update the <code className="bg-slate-700 text-purple-300 px-1 rounded">KNOWLEDGE_BASE</code> array in the <code className="bg-slate-700 text-purple-300 px-1 rounded">knowledgeBase.ts</code> file. For edits, replace the existing record.
                        </p>
                        <div className="relative">
                            <pre className="bg-slate-900/50 border border-slate-600 rounded-md p-4 text-slate-200 max-h-[60vh] overflow-auto custom-scrollbar">
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
                            Close
                        </button>
                    </div>
                </Modal>
            </div>
        </Section>
    );
};

interface ModeCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const ModeCard: React.FC<ModeCardProps> = ({ icon, title, description, onClick }) => (
    <div 
        onClick={onClick}
        className="group p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
        <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
            {icon}
        </div>
        <h3 className="font-mono font-bold text-xl mt-2 text-slate-200">{title}</h3>
        <p className="text-slate-400 mt-2 text-sm">{description}</p>
    </div>
);


export default AdminPage;
