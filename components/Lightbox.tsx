import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from './icons/XIcon';
import { ArrowLeftIcon, ArrowRightIcon } from './icons/ArrowIcons';

interface LightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNext, onPrev }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, onNext, onPrev]);

    return createPortal(
        <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            {/* Close Button */}
            <button 
                className="absolute top-5 right-5 text-slate-300 hover:text-purple-500 transition-colors z-50"
                onClick={onClose}
                aria-label="Close gallery"
            >
                <XIcon className="w-10 h-10" />
            </button>

            {/* Prev Button */}
            <button
                className="absolute left-5 text-slate-300 hover:text-purple-500 transition-colors z-50 p-2 bg-black/30 rounded-full"
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                aria-label="Previous image"
            >
                <ArrowLeftIcon className="w-8 h-8" />
            </button>

            {/* Image Container */}
            <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <img 
                    src={images[currentIndex]} 
                    alt={`Event gallery image ${currentIndex + 1}`} 
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-purple-500/20"
                />
            </div>
            
            {/* Next Button */}
            <button
                className="absolute right-5 text-slate-300 hover:text-purple-500 transition-colors z-50 p-2 bg-black/30 rounded-full"
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                aria-label="Next image"
            >
                <ArrowRightIcon className="w-8 h-8" />
            </button>

             {/* Counter */}
             <div className="absolute bottom-5 text-slate-300 font-mono bg-black/50 px-3 py-1 rounded-md">
                {currentIndex + 1} / {images.length}
             </div>
        </div>,
        document.body
    );
};

export default Lightbox;