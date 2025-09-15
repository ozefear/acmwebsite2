import React from 'react';
import Section from './Section';
import { ANNOUNCEMENTS_DATA } from '../constants';
import AnnouncementCard from './AnnouncementCard';

const Announcements: React.FC = () => {
    return (
        <Section id="announcements" title="[Latest_Announcements]">
            <div className="flex overflow-x-auto space-x-8 pb-6 custom-scrollbar">
                {ANNOUNCEMENTS_DATA.map(announcement => (
                    <div key={announcement.id} className="w-[300px] sm:w-[350px] flex-shrink-0">
                        <AnnouncementCard announcement={announcement} />
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Announcements;