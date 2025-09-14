import React, { useState, useRef } from 'react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from './icons/SocialIcons';

const socialLinks = [
    { name: 'GitHub', href: '#', icon: GithubIcon },
    { name: 'Twitter', href: '#', icon: TwitterIcon },
    { name: 'LinkedIn', href: '#', icon: LinkedinIcon },
];

interface FooterProps {
    onTriggerTerminal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onTriggerTerminal }) => {
    const [clickCount, setClickCount] = useState(0);
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleTerminalTriggerClick = () => {
        // If a timer is already running, clear it.
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
        }

        const newClickCount = clickCount + 1;

        if (newClickCount >= 5) {
            onTriggerTerminal();
            setClickCount(0); // Reset after triggering
        } else {
            setClickCount(newClickCount);
            // Set a timer to reset the count if clicks are too far apart (e.g., 2 seconds)
            clickTimer.current = setTimeout(() => {
                setClickCount(0);
            }, 2000);
        }
    };

    return (
        <footer className="bg-black/30 backdrop-blur-sm border-t border-slate-800">
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                    <div>
                        <h3 className="text-[clamp(1.25rem,5vw,1.5rem)] font-bold font-mono glitch-hover" data-text="ACM Hacettepe">ACM Hacettepe</h3>
                        <p className="text-slate-400 mt-2">Geleceğe yön verenler.</p>
                        <a href="mailto:iletisim@acmhacettepe.com" className="text-purple-400 font-mono text-sm mt-1">iletisim@acmhacettepe.com</a>
                    </div>
                    <div className="flex space-x-6">
                        {socialLinks.map((item) => (
                            <a key={item.name} href={item.href} className="text-slate-400 hover:text-purple-500 transform hover:scale-110 transition-transform duration-300">
                                <span className="sr-only">{item.name}</span>
                                <item.icon className="h-6 w-6" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 text-center font-mono text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} ACM Hacettepe Öğrenci Topluluğu. Tüm hakları saklıdır.</p>
                    <p 
                        className="mt-1 text-purple-500/50 cursor-pointer hover:text-purple-400/80 transition-colors"
                        onClick={handleTerminalTriggerClick}
                        title="Buna bi'kaç kez tıklasam nolur ki?"
                    >
                        {'>'} exit(0)
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;