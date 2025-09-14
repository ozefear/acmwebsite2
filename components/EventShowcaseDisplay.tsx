import React, { useState, useEffect, useRef } from 'react';
import { EventShowcase } from '../types';
import GlowPanel from './GlowPanel';
import Lightbox from './Lightbox';
import { ArrowLeftIcon, ArrowRightIcon } from './icons/ArrowIcons';
import { useScrollProgressAnimation } from '../hooks/useScrollProgressAnimation';

const ZoomIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
    </svg>
);

interface EventShowcaseDisplayProps {
    event: EventShowcase;
    isReversed?: boolean;
}

const EventShowcaseDisplay: React.FC<EventShowcaseDisplayProps> = ({ event, isReversed = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // The hook provides a ref for the observer and the progress value.
    const { ref: textObserverRef, progress: textProgress } = useScrollProgressAnimation<HTMLDivElement>();
    const { ref: imageObserverRef, progress: imageProgress } = useScrollProgressAnimation<HTMLDivElement>();

    // The style object applies the progress to the CSS custom property.
    const textStyle = { '--scroll-progress': textProgress } as React.CSSProperties;
    const imageStyle = { '--scroll-progress': imageProgress } as React.CSSProperties;

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const advanceImage = (direction: 'next' | 'prev') => {
        const totalImages = event.images.length;
        setCurrentImageIndex(prev => {
            if (direction === 'next') return (prev + 1) % totalImages;
            return (prev - 1 + totalImages) % totalImages;
        });
    };

    useEffect(() => {
        if (isLightboxOpen || event.images.length <= 1) {
            resetTimeout();
            return;
        }
        resetTimeout();
        timeoutRef.current = setTimeout(() => advanceImage('next'), 5000);
        return () => resetTimeout();
    }, [currentImageIndex, isLightboxOpen, event.images.length]);

    const openLightbox = () => setIsLightboxOpen(true);
    const closeLightbox = () => setIsLightboxOpen(false);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Column: An outer div acts as the observer target, while the inner div handles the animation. */}
                <div ref={textObserverRef} className={`${isReversed ? 'lg:order-last' : ''}`}>
                    <div style={textStyle} className="scroll-reveal-y">
                        <GlowPanel className="p-8 bg-slate-900/40 backdrop-blur-sm border border-slate-700 rounded-lg h-full">
                            <h3 className="text-[clamp(1.5rem,5vw,1.875rem)] font-bold font-mono text-purple-400 mb-4 glitch-hover" data-text={event.title}>{event.title}</h3>
                            <p className="font-mono text-slate-300">{event.description}</p>
                        </GlowPanel>
                    </div>
                </div>

                {/* Image Carousel Column: Same observer wrapper pattern. */}
                <div ref={imageObserverRef}>
                    <div style={imageStyle} className="scroll-reveal-x relative group aspect-video rounded-lg overflow-hidden">
                        {/* Main Image Container */}
                        <div className="w-full h-full">
                            {event.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${event.title} event photo ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                />
                            ))}
                        </div>

                         {/* Clickable overlay to open lightbox */}
                        <button 
                            onClick={openLightbox} 
                            className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            aria-label={`View images for ${event.title} in a lightbox`}
                        >
                            <ZoomIcon className="w-16 h-16 text-white" />
                        </button>

                        {/* Navigation Arrows */}
                        {event.images.length > 1 && (
                            <>
                                <button onClick={() => advanceImage('prev')} className="absolute top-1/2 left-3 -translate-y-1/2 z-20 p-2 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500/50" aria-label="Previous image">
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </button>
                                <button onClick={() => advanceImage('next')} className="absolute top-1/2 right-3 -translate-y-1/2 z-20 p-2 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500/50" aria-label="Next image">
                                    <ArrowRightIcon className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        {/* Indicator Dots */}
                        {event.images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                                {event.images.map((_, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setCurrentImageIndex(index)} 
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentImageIndex ? 'bg-purple-500' : 'bg-slate-500/60 hover:bg-slate-400'}`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {isLightboxOpen && (
                <Lightbox
                    images={event.images}
                    currentIndex={currentImageIndex}
                    onClose={closeLightbox}
                    onNext={() => advanceImage('next')}
                    onPrev={() => advanceImage('prev')}
                />
            )}
        </>
    );
};

export default EventShowcaseDisplay;