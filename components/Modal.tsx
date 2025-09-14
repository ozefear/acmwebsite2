import React, { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from './icons/XIcon';
import GlowPanel from './GlowPanel';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <GlowPanel
                className="w-full max-w-2xl bg-slate-900/80 border border-slate-700 rounded-lg shadow-2xl shadow-purple-900/50 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative flex-shrink-0 flex items-center justify-between p-4 bg-slate-900/50">
                    <h3 className="font-mono font-bold text-purple-400 text-lg glitch-hover" data-text={title}>{title}</h3>
                    <button onClick={onClose} aria-label="Close modal">
                        <XIcon className="w-6 h-6 text-slate-400 hover:text-white transition-colors" />
                    </button>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </GlowPanel>
        </div>,
        document.body
    );
};

export default Modal;
