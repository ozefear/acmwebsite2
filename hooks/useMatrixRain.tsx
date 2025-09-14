import React, { useEffect, useRef } from 'react';
import { useMousePosition } from './useMousePosition';

// --- START OF CONFIGURABLE PARAMETERS ---

// Adjust the range of falling speeds for the rain streams.
const MIN_SPEED = 0.5;
const MAX_SPEED = 2;

// Adjust the range for the length of each character trail.
const MIN_TRAIL_LENGTH = 30;
const MAX_TRAIL_LENGTH = 50;

// A value between 0 and 1. Higher means more frequent character changes.
// A lower value (e.g., 0.01) creates a calmer, more stable data stream effect.
const CHARACTER_CHANGE_CHANCE = 0.08;

// --- END OF CONFIGURABLE PARAMETERS ---


const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const characters = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`{|}~" + katakana;
const fontSize = 16;
const revealRadius = 250; // The radius of the circle around the mouse

class RainStream {
    x: number;
    y: number; // Head of the stream
    speed: number;
    characters: string[] = [];
    totalChars: number;
    canvasHeight: number;

    constructor(x: number, canvasHeight: number) {
        this.x = x;
        this.canvasHeight = canvasHeight;
        this.y = Math.random() * -canvasHeight; // Start above screen
        
        this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.totalChars = Math.floor(Math.random() * (MAX_TRAIL_LENGTH - MIN_TRAIL_LENGTH) + MIN_TRAIL_LENGTH);
        
        this.generateCharacters();
    }

    generateCharacters() {
        this.characters = [];
        for(let i = 0; i < this.totalChars; i++) {
            this.characters.push(characters.charAt(Math.floor(Math.random() * characters.length)));
        }
    }

    reset() {
        this.y = Math.random() * -this.canvasHeight;
        this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
        this.generateCharacters();
    }
    
    updateAndDraw(ctx: CanvasRenderingContext2D) {
        this.y += this.speed;
        
        // If the tail of the stream is off screen, reset
        if (this.y - (this.totalChars * fontSize) > this.canvasHeight) {
            this.reset();
        }

        // Draw the characters
        this.characters.forEach((char, index) => {
             if (Math.random() < CHARACTER_CHANGE_CHANCE) { 
                this.characters[index] = characters.charAt(Math.floor(Math.random() * characters.length));
             }

             const yPos = this.y - (index * fontSize);
             if (yPos > 0 && yPos < this.canvasHeight) {
                 if (index === 0) {
                     ctx.fillStyle = '#e9d5ff'; // Brighter lead character (purple-200)
                 } else {
                     const opacity = 1 - (index / this.characters.length);
                     ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`; // Primary purple with fade
                 }
                 ctx.fillText(char, this.x, yPos);
             }
        });
    }
}


export const useMatrixRain = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    const mousePosition = useMousePosition();
    const mousePosRef = useRef({ x: -1000, y: -1000 });
    const animationFrameId = useRef<number | null>(null);
    const streams = useRef<RainStream[]>([]);

    useEffect(() => {
        mousePosRef.current = mousePosition;
    }, [mousePosition]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const initializeStreams = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            streams.current = [];
            const columnCount = Math.floor(canvas.width / fontSize);
            for (let i = 0; i < columnCount; i++) {
                streams.current.push(new RainStream(i * fontSize, canvas.height));
            }
        };

        window.addEventListener('resize', initializeStreams);
        initializeStreams();

        const animate = () => {
            ctx.fillStyle = 'rgba(13, 13, 13, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = `${fontSize}px monospace`;
            streams.current.forEach(stream => stream.updateAndDraw(ctx));
            
            const { x, y } = mousePosRef.current;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, revealRadius);
            gradient.addColorStop(0, 'rgba(13, 13, 13, 0)');
            gradient.addColorStop(0.8, 'rgba(13, 13, 13, 0.7)');
            gradient.addColorStop(1, 'rgba(13, 13, 13, 0.85)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            window.removeEventListener('resize', initializeStreams);
        };
    }, [canvasRef]);
};