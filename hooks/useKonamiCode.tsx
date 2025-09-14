import { useEffect, useState, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

export const useKonamiCode = (callback: () => void) => {
  const [sequence, setSequence] = useState<string[]>([]);

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const newSequence = [...sequence, event.key];
    
    // Check if the current sequence matches the start of the Konami code
    const isMatching = KONAMI_CODE.slice(0, newSequence.length).every(
      (key, index) => key === newSequence[index]
    );

    if (isMatching) {
      if (newSequence.length === KONAMI_CODE.length) {
        // Full code entered
        callback();
        setSequence([]); // Reset for next time
      } else {
        // Partial match, keep listening
        setSequence(newSequence);
      }
    } else {
      // Mismatch, reset sequence
      setSequence([]);
    }
  }, [sequence, callback]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};
