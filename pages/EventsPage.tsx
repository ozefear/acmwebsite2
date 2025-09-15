import React from 'react';
import { EVENT_SHOWCASE_DATA } from '../constants';
import EventShowcaseDisplay from '../components/EventShowcaseDisplay';

const EventsPage: React.FC = () => {
    const title = "[Etkinliklerimiz]";

    return (
        <section id="events" className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-[clamp(1.5rem,calc(1rem+2.5vw),3rem)] font-bold font-mono mb-12 md:mb-16">
                    <span className="glitch-hover inline-block relative" data-text={title}>
                        {title}
                    </span>
                    <span className="blinking-cursor">_</span>
                </h2>
                <div className="space-y-20 md:space-y-28">
                    {EVENT_SHOWCASE_DATA.map((event, index) => (
                        <EventShowcaseDisplay 
                            key={event.id} 
                            event={event} 
                            isReversed={index % 2 === 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventsPage;