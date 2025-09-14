import React from 'react';
import Section from './Section';
import { YOUTUBE_VIDEOS_DATA } from '../constants';
import GlowPanel from './GlowPanel';

const YouTubeSection: React.FC = () => {
    return (
        <div className="bg-black/20">
            <Section id="youtube" title="[Son_Videolarımız]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {YOUTUBE_VIDEOS_DATA.map(video => (
                        <GlowPanel key={video.id} className="group rounded-lg bg-slate-900/40 backdrop-blur-sm border border-slate-800 transition-all duration-300 hover:-translate-y-2">
                             <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                <div className="relative overflow-hidden rounded-t-lg">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-mono text-slate-200 group-hover:text-purple-400 transition-colors">{video.title}</h3>
                                </div>
                            </a>
                        </GlowPanel>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default YouTubeSection;
