import React, { useState, useEffect } from 'react';

type BootItem = 
    | { text: string; delay: number; isProgress?: boolean; type: 'text' }
    | { type: 'pause'; duration: number };

const bootSequence: BootItem[] = [
    { type: 'text', text: '> INITIATING BOOT SEQUENCE...', delay: 25 },
    { type: 'text', text: '> ACCESSING NEURAL INTERFACE...', delay: 25 },
    { type: 'text', text: '> LOADING CORE MODULES: ', isProgress: true, delay: 25 },
    { type: 'text', text: '> DECRYPTING DATA STREAMS...', delay: 25 },
    { type: 'text', text: '> CONNECTION ESTABLISHED: ACM_HACETTEPE_MAINFRM', delay: 25 },
    { type: 'text', text: '> RENDERING CYBERSPACE...', delay: 25 },
    { type: 'pause', duration: 300 },
    { type: 'text', text: '> LAUNCHING...', delay: 25 },
];

const typingSpeed = 10; // ms per character
const progressBarWidth = 20;

interface LoaderProps {
    onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
    const textItems = bootSequence.filter(item => item.type === 'text');
    const [lines, setLines] = useState<string[]>(Array(textItems.length).fill(''));
    const [completedLines, setCompletedLines] = useState<boolean[]>(Array(textItems.length).fill(false));
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [textItemIndex, setTextItemIndex] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        if (sequenceIndex >= bootSequence.length) {
            // Sequence is done, wait a bit, then fade out and call onComplete
            setTimeout(() => {
                setIsFadingOut(true);
            }, 150); // Pause after "LAUNCHING..."
            
            setTimeout(() => {
                onComplete();
            }, 150 + 500); // 150ms pause + 500ms fade duration
            return;
        }

        const currentBootItem = bootSequence[sequenceIndex];

        if (currentBootItem.type === 'pause') {
            const timer = setTimeout(() => {
                setSequenceIndex(prev => prev + 1);
            }, currentBootItem.duration);
            return () => clearTimeout(timer);
        }
        
        const { text, isProgress, delay } = currentBootItem;
        const currentTextIndex = textItemIndex; 

        const timer = setTimeout(() => {
            let charIndex = 0;

            const typingInterval = setInterval(() => {
                if (charIndex < text.length) {
                    setLines(prev => {
                        const newLines = [...prev];
                        newLines[currentTextIndex] = text.substring(0, charIndex + 1);
                        return newLines;
                    });
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    if (isProgress) {
                        let progress = 0;
                        const progressInterval = setInterval(() => {
                            if (progress <= 100) {
                                const filledChars = Math.floor((progress / 100) * progressBarWidth);
                                const emptyChars = progressBarWidth - filledChars;
                                const bar = `[${'▓'.repeat(filledChars)}${' '.repeat(emptyChars)}] ${progress}%`;
                                setLines(prev => {
                                    const newLines = [...prev];
                                    newLines[currentTextIndex] = text + bar;
                                    return newLines;
                                });
                                progress += 10;
                            } else {
                                clearInterval(progressInterval);
                                setCompletedLines(prev => { const newCompleted = [...prev]; newCompleted[currentTextIndex] = true; return newCompleted; });
                                setSequenceIndex(prev => prev + 1);
                                setTextItemIndex(prev => prev + 1);
                            }
                        }, 10); // Sped up progress bar
                    } else {
                        setCompletedLines(prev => { const newCompleted = [...prev]; newCompleted[currentTextIndex] = true; return newCompleted; });
                        setSequenceIndex(prev => prev + 1);
                        setTextItemIndex(prev => prev + 1);
                    }
                }
            }, typingSpeed);
        }, delay);

        return () => clearTimeout(timer);
    }, [sequenceIndex, textItemIndex, onComplete]);

    return (
        <div className={`fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-50 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-full max-w-2xl p-4 font-mono text-purple-500">
                {lines.map((line, index) => (
                    <p key={index} className="text-sm md:text-base whitespace-pre h-6">
                        {line}
                        {!completedLines[index] && <span className="blinking-cursor">_</span>}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Loader;