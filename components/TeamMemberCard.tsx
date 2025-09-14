
import React from 'react';
import { TeamMember } from '../types';
import GlowPanel from './GlowPanel';
import { LinkedinIcon, InstagramIcon, TwitterIcon } from './icons/SocialIcons';

interface TeamMemberCardProps {
    member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
    return (
        <GlowPanel className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <div className="relative overflow-hidden rounded-t-lg">
                <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-auto aspect-square object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 group-hover:opacity-0"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold font-mono text-slate-100 glitch-hover" data-text={member.name}>{member.name}</h3>
                    <p className="text-purple-400 font-mono mt-1">{member.role}</p>
                </div>
                <div className="flex space-x-4 mt-4 pt-4 border-t border-slate-800">
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`} className="text-slate-400 hover:text-purple-500 transition-colors">
                        <LinkedinIcon className="h-6 w-6" />
                    </a>
                    <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Instagram`} className="text-slate-400 hover:text-purple-500 transition-colors">
                        <InstagramIcon className="h-6 w-6" />
                    </a>
                    {member.social.twitter && (
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`} className="text-slate-400 hover:text-purple-500 transition-colors">
                            <TwitterIcon className="h-6 w-6" />
                        </a>
                    )}
                </div>
            </div>
        </GlowPanel>
    );
};

export default TeamMemberCard;
