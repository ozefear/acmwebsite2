import React, { useState, useEffect } from 'react';
import Section from './Section';
import GlowPanel from './GlowPanel';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelImage: string;
  link: string;
}

const API_KEY = process.env.YOUTUBE_API_KEY || '';
const CHANNEL_ID = 'UCj9lz6_BSlGaiiq1IySGo_A';
const MAX_RESULTS = 8;

const YouTubeSection: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Responsive screen detection
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 1023);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch videos from YouTube
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${MAX_RESULTS}&type=video&key=${API_KEY}`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?&id=${videoIds}&part=contentDetails,snippet&key=${API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        const nonShorts = detailsData.items.filter((video: any) => {
          const duration = video.contentDetails.duration;
          const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
          const minutes = parseInt(match?.[1] || '0');
          const seconds = parseInt(match?.[2] || '0');
          return minutes * 60 + seconds > 60; // ignore Shorts
        });

        const formattedVideos: Video[] = nonShorts.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          channelImage: item.snippet.thumbnails.default.url,
          link: `https://www.youtube.com/watch?v=${item.id}`,
        }));

        setVideos(formattedVideos);
      } catch (error) {
        console.error('Failed to fetch YouTube videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const displayedVideos = isSmallScreen ? videos.slice(0, 2) : videos.slice(0, 4);

  return (
    <div className="bg-black/20">
      <Section id="youtube" title="[Son_Videolarımız]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedVideos.map((video) => (
            console.log(video.thumbnail),
            <GlowPanel key={video.id} className="group rounded-lg bg-slate-900/40 backdrop-blur-sm border border-slate-800 transition-all duration-300 hover:-translate-y-2">
                             <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                <div className="relative overflow-hidden rounded-t-lg aspect-video">
                                    <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
