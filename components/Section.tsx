import React, { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface SectionProps {
    id: string;
    title: string;
    children: ReactNode;
    className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = '' }) => {
    const { ref, animationClasses } = useScrollAnimation<HTMLDivElement>();

    return (
        <section id={id} className={`py-20 md:py-28 ${className}`}>
            <div ref={ref} className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${animationClasses}`}>
                <h2 className="text-[clamp(1.5rem,calc(1rem+2.5vw),3rem)] font-bold font-mono mb-12 md:mb-16">
                    <span className="glitch-hover inline-block relative" data-text={title}>
                        {title}
                    </span>
                    <span className="blinking-cursor">_</span>
                </h2>
                {children}
            </div>
        </section>
    );
};

export default Section;