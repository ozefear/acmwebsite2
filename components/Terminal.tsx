import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import AsciiLogo from './AsciiLogo';
import SysInfo from './SysInfo';

interface TerminalProps {
    onClose: () => void;
    onAuthSuccess: () => void;
}

type Output = {
    type: 'input' | 'output' | 'component' | 'error';
    content: string | React.ReactNode;
    isMatrix?: boolean;
};

const WELCOME_MESSAGE = 'ACM Hacettepe Mainframe. Type "help" for a list of commands.';

const HELP_TEXT = `Available commands:
  help          - Show this help message.
  whois         - Display information about ACM Hacettepe.
  sysinfo       - Show mainframe system information.
  matrix        - Initiate data stream visualization.
  cowsay        - Display a message from our AI mascot.
  socials       - List official social media links.
  contact       - Show contact information.
  date          - Display the current system time.
  theme set ... - Change terminal theme (purple, hacker, ice, fire).
  banner        - Display the welcome banner.
  clear         - Clear the terminal screen.
  exit          - Close the terminal.`;
  
const SOCIALS_TEXT = `Follow us on our social channels:
  GitHub:   https://github.com/acmhacettepe
  Twitter:  https://twitter.com/acmhacettepe
  LinkedIn: https://linkedin.com/company/acmhacettepe
  Insta:    https://instagram.com/acmhacettepe`;

const COWSAY_QUOTES = [
    "The best way to predict the future is to invent it.",
    "Talk is cheap. Show me the code.",
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
    "The computer was born to solve problems that did not exist before.",
    "It's not a bug, it's an undocumented feature."
];

const ROBOT_ART = [
"      \\   ^__^",
"       \\  (oo)\\_______",
"          (__)\\       )\\/\\",
"              ||----w |",
"              ||     ||"
];

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const PASSCODE = 'morzai-admin-access';

const Terminal: React.FC<TerminalProps> = ({ onClose, onAuthSuccess }) => {
    const [history, setHistory] = useState<Output[]>([
        { type: 'output', content: WELCOME_MESSAGE }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [theme, setTheme] = useState('purple');
    const [isMatrixRunning, setIsMatrixRunning] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (containerRef.current && !isMatrixRunning) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history, isMatrixRunning]);
    
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runMatrix = async () => {
        setIsMatrixRunning(true);
        setInputValue(''); // Clear input during matrix
        
        const lines = Array(15).fill('');
        for (let i = 0; i < 50; i++) {
            const newLine = Array.from({ length: 50 }, () => MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length))).join('');
            lines.shift();
            lines.push(newLine);
            setHistory(prev => [...prev.slice(0, -lines.length), ...lines.map(l => ({ type: 'output', content: l, isMatrix: true } as Output))]);
            await sleep(50);
        }

        setIsMatrixRunning(false);
        setHistory(prev => [...prev, { type: 'output', content: 'Data stream visualization complete.' }]);
    };
    
    // Fix: Add explicit return type to prevent type widening on the returned object.
    const runCowsay = (): Output => {
        const quote = COWSAY_QUOTES[Math.floor(Math.random() * COWSAY_QUOTES.length)];
        const bubble = [
            ` ${'_'.repeat(quote.length + 2)} `,
            `< ${quote} >`,
            ` ${'-'.repeat(quote.length + 2)} `
        ];
        const art = [...bubble, ...ROBOT_ART].join('\n');
        return { type: 'output', content: art };
    }

    const handleCommand = (commandStr: string) => {
        const [command, ...args] = commandStr.trim().toLowerCase().split(' ').filter(Boolean);
        const newHistory: Output[] = [...history, { type: 'input', content: commandStr }];

        switch (command) {
            case 'help':
                newHistory.push({ type: 'output', content: HELP_TEXT });
                break;
            case 'whois':
                newHistory.push({ type: 'component', content: <AsciiLogo /> });
                newHistory.push({ type: 'output', content: 'Association for Computing Machinery - Hacettepe University Student Chapter. A community of creators, innovators, and problem-solvers.' });
                break;
            case 'sysinfo':
                newHistory.push({ type: 'component', content: <SysInfo /> });
                break;
            case 'matrix':
                newHistory.push({ type: 'output', content: 'Initiating data stream visualization...' });
                setHistory(newHistory);
                runMatrix();
                return;
            case 'cowsay':
                newHistory.push(runCowsay());
                break;
            case 'socials':
                newHistory.push({ type: 'output', content: SOCIALS_TEXT });
                break;
            case 'contact':
                newHistory.push({ type: 'output', content: 'You can reach us at: contact@acmhacettepe.org' });
                break;
            case 'date':
                newHistory.push({ type: 'output', content: new Date().toLocaleString() });
                break;
            case 'theme':
                if (args[0] === 'set' && ['purple', 'hacker', 'ice', 'fire'].includes(args[1])) {
                    setTheme(args[1]);
                    newHistory.push({ type: 'output', content: `Theme set to: ${args[1]}` });
                } else {
                    newHistory.push({ type: 'error', content: `Usage: theme set <purple|hacker|ice|fire>` });
                }
                break;
            case 'banner':
                setHistory([{ type: 'output', content: WELCOME_MESSAGE }]);
                return;
            case 'clear':
                setHistory([]);
                return;
            case 'exit':
                onClose();
                return;
            case 'sudo':
                if (args[0] === PASSCODE) {
                    newHistory.push({ type: 'output', content: 'Authentication successful. Accessing admin mainframe...' });
                    setHistory(newHistory);
                    setTimeout(onAuthSuccess, 1000);
                    return;
                } else {
                    newHistory.push({ type: 'error', content: 'sudo: incorrect password' });
                }
                break;
            case '':
                break;
            default:
                newHistory.push({ type: 'error', content: `command not found: ${command}` });
                break;
        }
        setHistory(newHistory);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isMatrixRunning) return;
        handleCommand(inputValue);
        setInputValue('');
    };

    return createPortal(
        <div
            className={`terminal-container fixed inset-0 bg-black/90 backdrop-blur-sm z-50 p-4 font-mono text-sm overflow-y-auto custom-scrollbar theme-${theme}`}
            ref={containerRef}
            onClick={() => inputRef.current?.focus()}
        >
            <div className="w-full max-w-4xl mx-auto">
                {history.map((item, index) => (
                    <div key={index} className="whitespace-pre-wrap break-words">
                        {item.type === 'input' && (
                            <div className="flex items-center">
                                <span className="text-[var(--terminal-primary)] mr-2">{'>'}</span>
                                <span>{item.content}</span>
                            </div>
                        )}
                        {item.type === 'output' && <div className={item.isMatrix ? `text-[var(--terminal-secondary)]` : ''}>{item.content}</div>}
                        {item.type === 'error' && <div className="text-[var(--terminal-error)]">{item.content}</div>}
                        {item.type === 'component' && <div>{item.content}</div>}
                    </div>
                ))}
                {!isMatrixRunning && (
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center mt-2">
                            <span className="text-[var(--terminal-primary)] mr-2">{'>'}</span>
                            <span className="whitespace-pre">{inputValue}</span>
                            <span className="blinking-cursor">_</span>
                        </div>
                        <input
                            id="terminal-input"
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="opacity-0 w-0 h-0 p-0 m-0 border-0 absolute"
                            autoComplete="off"
                            spellCheck="false"
                            autoFocus
                        />
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Terminal;
