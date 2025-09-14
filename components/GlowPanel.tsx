import React, { useRef, useState, useEffect, ReactNode } from 'react';

// Fix: Update props to accept standard HTML attributes like onClick.
interface GlowPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

const GlowPanel: React.FC<GlowPanelProps> = ({ children, className = '', ...props }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (divRef.current) {
                const rect = divRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        const currentDiv = divRef.current;
        currentDiv?.addEventListener('mousemove', handleMouseMove);
        
        const handleMouseLeave = () => {
             setMousePosition({ x: -200, y: -200 });
        }
        currentDiv?.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            currentDiv?.removeEventListener('mousemove', handleMouseMove);
            currentDiv?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={divRef} className={`relative overflow-hidden ${className}`} {...props}>
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                    background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15), transparent 80%)`,
                }}
            ></div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default GlowPanel;