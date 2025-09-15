import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-md' : 'bg-transparent'}`}>
            <div className="relative">
                 <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <a href="/" className="flex items-center group" aria-label="ACM Hacettepe Home">
                        <div 
                            className="image-glitch-hover"
                            style={{ '--glitch-image-url': 'url(/logo.svg)' } as React.CSSProperties}
                        >
                            <img src="/logo.svg" alt="ACM Hacettepe Logo" className="h-14 w-auto transition-opacity duration-300" />
                        </div>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map(link => (
                            <a key={link.name} href={link.href} className="font-mono text-slate-300 hover:text-purple-400 transition-colors">
                                {link.name}
                            </a>
                        ))}
                        <a href="/uyeol" className="px-5 py-2 font-mono font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_15px_theme(colors.purple.500)]">
                            Üye Ol
                        </a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} aria-label="Toggle menu">
                            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900/90 backdrop-blur-lg absolute top-full left-0 w-full animate-fade-in-down">
                     <nav className="flex flex-col items-center space-y-6 py-8">
                        {NAV_LINKS.map(link => (
                            <a key={link.name} href={link.href} onClick={toggleMenu} className="font-mono text-xl text-slate-300 hover:text-purple-400 transition-colors">
                                {link.name}
                            </a>
                        ))}
                        <a href="/uyeol" onClick={toggleMenu} className="mt-4 px-6 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_15px_theme(colors.purple.500)]">
                            Üye Ol
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
