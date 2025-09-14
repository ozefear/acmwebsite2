import { useState, useEffect, useRef } from 'react';

/**
 * A hook that tracks the visibility of an element as it scrolls into the viewport.
 * It uses the IntersectionObserver API to provide a smooth progress value (0 to 1).
 * @returns A ref to attach to the target element and the visibility progress.
 */
export const useScrollProgressAnimation = <T extends HTMLElement>() => {
    const ref = useRef<T>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Generate an array of 101 numbers from 0.0 to 1.0 to act as thresholds.
        // This ensures the observer callback fires frequently as the element scrolls,
        // providing a smooth progress value.
        const threshold = Array.from(Array(101).keys()).map(i => i / 100);

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update the progress state with the current intersection ratio.
                setProgress(entry.intersectionRatio);
            },
            {
                threshold,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return { ref, progress };
};
