import React, { useState, useEffect, useRef } from 'react';

// Corrected logo to display "ACM"
const FINAL_LOGO_LINES = [
    "    _    ____ __  __ ",
    "   / \\  / ___|  \\/  |",
    "  / _ \\| |   | |\\/| |",
    " / ___ \\ |___| |  | |",
    "/_/   \\_\\____|_|  |_|",
];

const GLITCH_CHARS = '█▓▒░<>/?!@#$%^&*()_-+=[]{}|;:,.~';
const ANIMATION_DURATION = 1200; // Total duration in ms
const FRAME_INTERVAL = 50; // Update every 50ms

const getRandomChar = () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

const AsciiLogo: React.FC = () => {
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const startTimeRef = useRef<number>(Date.now());

    useEffect(() => {
        // Initial state: blank
        setDisplayedLines(FINAL_LOGO_LINES.map(line => ' '.repeat(line.length)));
        startTimeRef.current = Date.now();

        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTimeRef.current;
            const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

            if (progress >= 1) {
                clearInterval(interval);
                setDisplayedLines(FINAL_LOGO_LINES);
                return;
            }

            const nextLines = FINAL_LOGO_LINES.map((finalLine) => {
                return finalLine.split('').map((finalChar) => {
                    if (finalChar === ' ') {
                        return ' ';
                    }
                    // The chance to reveal the correct character increases over time
                    if (Math.random() < progress * 1.5) { 
                        return finalChar;
                    }
                    return getRandomChar();
                }).join('');
            });

            setDisplayedLines(nextLines);

        }, FRAME_INTERVAL);

        return () => clearInterval(interval);
    }, []); // Run only once on mount

    return (
        <pre className="text-purple-400" style={{ lineHeight: '1.1' }}>
            {displayedLines.join('\n')}
        </pre>
    );
};

export default AsciiLogo;