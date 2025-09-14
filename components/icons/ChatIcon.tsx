import React from 'react';

export const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        {/* Main 4-pointed star, centered */}
        <path d="M12 3L14.3 9.7L21 12L14.3 14.3L12 21L9.7 14.3L3 12L9.7 9.7Z" />
        {/* Smaller 8-pointed star in top right */}
        <path d="M20 2L21 3L22 4L21 5L20 6L19 5L18 4L19 3Z" />
    </svg>
);
