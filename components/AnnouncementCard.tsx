import React from 'react';
import { Announcement } from '../types';
import GlowPanel from './GlowPanel';

interface AnnouncementCardProps {
    announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
    return (
        <GlowPanel className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-lg transition-all duration-300 hover:-translate-y-2">
            <div className="relative overflow-hidden rounded-t-lg">
                <img src={announcement.image} alt={announcement.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold font-mono mb-2 text-slate-100 glitch-hover" data-text={announcement.title}>{announcement.title}</h3>
                <p className="text-slate-400">{announcement.description}</p>
            </div>
        </GlowPanel>
    );
};

export default AnnouncementCard;
