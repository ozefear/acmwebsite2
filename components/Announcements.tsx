import React from 'react';
import Section from './Section';
import { ANNOUNCEMENTS_DATA } from '../constants';
import AnnouncementCard from './AnnouncementCard';

const Announcements: React.FC = () => {
    return (
        <Section id="announcements" title="[Latest_Announcements]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ANNOUNCEMENTS_DATA.map(announcement => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
            </div>
        </Section>
    );
};

export default Announcements;
