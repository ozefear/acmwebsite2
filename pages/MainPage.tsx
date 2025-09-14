import React from 'react';
import Hero from '../components/Hero';
import Announcements from '../components/Announcements';
import YouTubeSection from '../components/YouTubeSection';

const MainPage: React.FC = () => {
    return (
        <>
            <Hero />
            <Announcements />
            <YouTubeSection />
        </>
    );
};

export default MainPage;
