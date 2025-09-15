import React, { useRef, useEffect, useState } from 'react';
import { useMatrixRain } from '../hooks/useMatrixRain';
import { SpeakerOnIcon } from './icons/SpeakerOnIcon';
import { SpeakerOffIcon } from './icons/SpeakerOffIcon';


// --- START OF AUDIO CONFIGURATION ---

// The target volume when the mouse is over the hero section (0 to 1).
const MAX_VOLUME = 1;

// The average number of "data clicks" per second. Higher is more dense.
const AVERAGE_TICK_RATE_HZ = 80;

// The base pitch of the data clicks in Hertz. Higher is more high-pitched.
const BASE_PITCH_HZ = 8500;

// How much the pitch of each click can randomly vary from the base pitch.
const PITCH_RANDOMNESS_HZ = 2000;

// --- END OF AUDIO CONFIGURATION ---


const Hero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    useMatrixRain(canvasRef);

    const [isMuted, setIsMuted] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mainGainRef = useRef<GainNode | null>(null);
    const pannerNodeRef = useRef<PannerNode | null>(null);
    const isAudioInitialized = useRef(false);
    const tickTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scheduleNextTickRef = useRef<(() => void) | null>(null);


    useEffect(() => {
        const initializeAudio = () => {
            if (isAudioInitialized.current) return;
            isAudioInitialized.current = true;

            try {
                const context = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioContextRef.current = context;

                if (context.state === 'suspended') {
                    context.resume();
                }

                const mainGain = context.createGain();
                mainGain.gain.setValueAtTime(0, context.currentTime);
                mainGain.connect(context.destination);
                mainGainRef.current = mainGain;

                const panner = context.createPanner();
                panner.panningModel = 'HRTF';
                panner.distanceModel = 'inverse';
                panner.positionX.value = 0;
                panner.positionY.value = 0;
                panner.positionZ.value = 0;
                panner.connect(mainGain);
                pannerNodeRef.current = panner;

                const createTick = () => {
                    if (!audioContextRef.current || !pannerNodeRef.current) return;
                    const context = audioContextRef.current;
                    const pannerNode = pannerNodeRef.current;
                    const now = context.currentTime;

                    const tickDuration = 0.05;
                    const env = context.createGain();
                    env.connect(pannerNode);
                    
                    env.gain.setValueAtTime(0, now);
                    env.gain.linearRampToValueAtTime(0.2, now + 0.005);
                    env.gain.exponentialRampToValueAtTime(0.0001, now + tickDuration);

                    const noise = context.createBufferSource();
                    const bufferSize = context.sampleRate * 0.05;
                    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    noise.buffer = buffer;

                    const bandpass = context.createBiquadFilter();
                    bandpass.type = 'bandpass';
                    bandpass.frequency.setValueAtTime(BASE_PITCH_HZ + Math.random() * PITCH_RANDOMNESS_HZ, now);
                    bandpass.Q.value = 20;

                    noise.connect(bandpass);
                    bandpass.connect(env);
                    
                    noise.start(now);
                    noise.stop(now + tickDuration);
                };
                
                const scheduleNextTick = () => {
                    const baseInterval = 1000 / AVERAGE_TICK_RATE_HZ;
                    const randomInterval = baseInterval * (0.8 + Math.random() * 0.4); // Varies between 80% and 120% of base
                    
                    tickTimeoutId.current = setTimeout(() => {
                        createTick();
                        scheduleNextTick();
                    }, randomInterval);
                };
                
                scheduleNextTickRef.current = scheduleNextTick;
                scheduleNextTick();

            } catch (error) {
                console.error("Failed to initialize Web Audio API", error);
            }
        };

        const interactionHandler = () => {
            initializeAudio();
            window.removeEventListener('mousemove', interactionHandler);
            window.removeEventListener('click', interactionHandler);
            window.removeEventListener('keydown', interactionHandler);
            window.removeEventListener('touchstart', interactionHandler);
        };

        window.addEventListener('mousemove', interactionHandler);
        window.addEventListener('click', interactionHandler);
        window.addEventListener('keydown', interactionHandler);
        window.addEventListener('touchstart', interactionHandler);

        return () => {
            window.removeEventListener('mousemove', interactionHandler);
            window.removeEventListener('click', interactionHandler);
            window.removeEventListener('keydown', interactionHandler);
            window.removeEventListener('touchstart', interactionHandler);
            if (tickTimeoutId.current) {
                clearTimeout(tickTimeoutId.current);
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(console.error);
            }
        };
    }, []);

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (newMutedState) {
            // Muting: Stop the sound generation loop entirely.
            if (tickTimeoutId.current) {
                clearTimeout(tickTimeoutId.current);
                tickTimeoutId.current = null;
            }
             // Also ensure volume is ramped down to 0, canceling any scheduled changes.
            if (mainGainRef.current && audioContextRef.current) {
                mainGainRef.current.gain.cancelScheduledValues(audioContextRef.current.currentTime);
                mainGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.01);
            }
        } else {
            // Un-muting: Restart the sound generation loop.
            if (scheduleNextTickRef.current) {
                scheduleNextTickRef.current();
            }
             // And set the volume based on whether the mouse is currently over the hero.
            if (mainGainRef.current && audioContextRef.current) {
                if (heroRef.current && heroRef.current.matches(':hover')) {
                    mainGainRef.current.gain.setTargetAtTime(MAX_VOLUME, audioContextRef.current.currentTime, 0.5);
                } else {
                    // If not hovering, volume remains at 0 until mouse enters.
                    mainGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.01);
                }
            }
        }
    };


    const handleMouseEnter = () => {
        if (mainGainRef.current && audioContextRef.current && !isMuted) {
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
            mainGainRef.current.gain.setTargetAtTime(MAX_VOLUME, audioContextRef.current.currentTime, 0.5);
        }
    };

    const handleMouseLeave = () => {
        // Fix: Added a check for the isMuted state to prevent un-muting on mouse leave.
        if (mainGainRef.current && audioContextRef.current && !isMuted) {
            mainGainRef.current.gain.setTargetAtTime(0.1, audioContextRef.current.currentTime, 0.8);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!pannerNodeRef.current || !audioContextRef.current) return;

        const panner = pannerNodeRef.current;
        const context = audioContextRef.current;
        
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const z = -((e.clientY / window.innerHeight) * 2 - 1); 
        
        const panRange = 4;

        panner.positionX.setTargetAtTime(x * panRange, context.currentTime, 0.05);
        panner.positionZ.setTargetAtTime(z * panRange, context.currentTime, 0.05);
    };

    return (
        <section 
            id="home" 
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <canvas 
                ref={canvasRef}
                className="absolute inset-0 z-0"
            ></canvas>
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0D0D0D] via-transparent to-[#0D0D0D]"></div>

            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-400">
                    Association for Computing Machinery
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-transparent bg-clip-text glitch-hover" data-text="ACM HACETTEPE">
                    ACM HACETTEPE
                </h1>
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-400">
                    ACM Hacettepe’ye hoş geldin! Burası birlikte üreten, paylaşan, öğrenen ve eğlenirken kendini geliştirenlerin adresi.
                </p>
                <a 
                    href="/uyeol"
                    className="mt-10 px-8 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md relative overflow-hidden group"
                >
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <span className="relative ">
                        Bize Katıl
                    </span>
                </a>
            </div>

            <button
                onClick={toggleMute}
                className="absolute bottom-5 left-5 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-slate-400 hover:text-white hover:bg-purple-500/20 transition-all"
                aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
                {isMuted ? <SpeakerOffIcon className="w-6 h-6" /> : <SpeakerOnIcon className="w-6 h-6" />}
            </button>
        </section>
    );
};

export default Hero;
