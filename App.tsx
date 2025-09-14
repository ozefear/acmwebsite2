// Fix: Correctly import useState and useEffect hooks from React.
import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Terminal from './components/Terminal';
import { useKonamiCode } from './hooks/useKonamiCode';

// Import Page Components
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import TeamPage from './pages/TeamPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import SignUpPage from './pages/SignUpPage';
import AdminPage from './pages/AdminPage';

// --- Shared Audio Context Manager ---
let audioContext: AudioContext | null = null;
let isInitialized = false;

const initializeAudio = () => {
    if (isInitialized || typeof window === 'undefined') return;
    isInitialized = true;

    try {
        const Context = window.AudioContext || (window as any).webkitAudioContext;
        if (!Context) {
            console.warn("Web Audio API is not supported in this browser.");
            return;
        }
        audioContext = new Context();

        const resumeContext = () => {
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            // Once resumed, remove the listeners
            window.removeEventListener('click', resumeContext);
            window.removeEventListener('keydown', resumeContext);
            window.removeEventListener('touchstart', resumeContext);
        };
        
        // If the context starts suspended, set up listeners to resume on first user interaction.
        if (audioContext.state === 'suspended') {
            window.addEventListener('click', resumeContext, { once: true });
            window.addEventListener('keydown', resumeContext, { once: true });
            window.addEventListener('touchstart', resumeContext, { once: true });
        }
    } catch (e) {
        console.error("Failed to initialize Web Audio API.", e);
    }
};

/**
 * Returns the singleton AudioContext instance for the application.
 * Initializes the context on first call.
 */
export const getAudioContext = (): AudioContext | null => {
    if (!isInitialized) {
        initializeAudio();
    }
    return audioContext;
};
// --- End Shared Audio Context Manager ---

const playKonamiSuccessSound = () => {
    const audioContext = getAudioContext();
    if (!audioContext || audioContext.state !== 'running') return;

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);

    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
    oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6

    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
};


const routes: { [key: string]: React.ComponentType } = {
    '/': MainPage,
    '/about': AboutPage,
    '/team': TeamPage,
    '/events': EventsPage,
    '/contact': ContactPage,
    '/signup': SignUpPage,
    '/admin': AdminPage,
};

const App: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [isCrtMode, setIsCrtMode] = useState(false);
    const [isTerminalVisible, setIsTerminalVisible] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    // Easter Egg: Konami Code
    useKonamiCode(() => {
        setIsCrtMode(prev => {
            const newMode = !prev;
            if (newMode) {
                playKonamiSuccessSound();
            }
            return newMode;
        });
    });

    const handleAuthSuccess = () => {
        setIsAdminAuthenticated(true);
        setIsTerminalVisible(false);
        window.history.pushState({}, '', '/admin');
        setCurrentPath('/admin');
    };

    useEffect(() => {
        const rootHtml = document.documentElement;
        if (isCrtMode) {
            rootHtml.classList.add('crt-mode');
        } else {
            rootHtml.classList.remove('crt-mode');
        }
        // Cleanup function to remove the class if the component unmounts
        return () => {
            rootHtml.classList.remove('crt-mode');
        };
    }, [isCrtMode]);

    useEffect(() => {
        getAudioContext();

        const checkAndHandlePath = (path: string): string => {
            if (path === '/admin' && !isAdminAuthenticated) {
                window.history.replaceState({}, '', '/');
                return '/';
            }
            return path;
        };
        
        const handleLocationChange = () => {
            const newPath = checkAndHandlePath(window.location.pathname);
            setCurrentPath(newPath);
            window.scrollTo(0, 0);
        };
        
        // Check initial path on mount.
        const initialPath = checkAndHandlePath(window.location.pathname);
        if (initialPath !== currentPath) {
             setCurrentPath(initialPath);
        }

        window.addEventListener('popstate', handleLocationChange);
        
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');
            
            if (
                anchor &&
                anchor.href &&
                anchor.origin === window.location.origin &&
                anchor.target !== '_blank' &&
                !e.metaKey && !e.ctrlKey
            ) {
                e.preventDefault();
                const targetPath = anchor.pathname;
                
                // Although no direct links to /admin exist, this is a safeguard.
                if (targetPath === '/admin' && !isAdminAuthenticated) return;

                if (targetPath !== window.location.pathname) {
                    window.history.pushState({}, '', targetPath);
                    setCurrentPath(targetPath);
                    window.scrollTo(0, 0);
                }
            }
        };
        
        document.addEventListener('click', handleLinkClick);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTerminalVisible && e.key === 'Escape') {
                setIsTerminalVisible(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            document.removeEventListener('click', handleLinkClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isTerminalVisible, isAdminAuthenticated, currentPath]);
    
    const handleLoadingComplete = () => {
        setLoading(false);
    };

    if (loading) {
        return <Loader onComplete={handleLoadingComplete} />;
    }

    const CurrentPage = routes[currentPath] || MainPage;

    return (
        <div className="bg-[#0D0D0D] text-slate-300 overflow-x-hidden">
            {/* Scanlines Overlay */}
            <div 
                className="fixed inset-0 z-0 pointer-events-none" 
                style={{
                    backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
                    backgroundSize: '100% 3px'
                }}
            ></div>
            
            <Header />

            <div className="relative z-10 flex flex-col min-h-screen">
                <main className="flex-grow">
                    <CurrentPage />
                </main>
                <Footer onTriggerTerminal={() => setIsTerminalVisible(true)} />
            </div>

            <Chatbot />

            {isTerminalVisible && <Terminal onClose={() => setIsTerminalVisible(false)} onAuthSuccess={handleAuthSuccess} />}
        </div>
    );
};

export default App;
