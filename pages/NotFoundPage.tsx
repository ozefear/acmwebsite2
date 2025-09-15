import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <section 
            id="not-found" 
            className="min-h-screen flex items-center justify-center text-center overflow-hidden px-4"
        >
            <div className="relative z-10 flex flex-col items-center">
                 <h1 
                    className="text-7xl sm:text-8xl md:text-9xl font-bold font-mono tracking-tight leading-tight bg-gradient-to-r from-red-500 via-fuchsia-500 to-purple-500 text-transparent bg-clip-text glitch-hover" 
                    data-text="404"
                >
                    404
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold font-mono mt-4">
                    <span className="glitch-hover" data-text="[CONNECTION_LOST]">
                        [CONNECTION_LOST]
                    </span>
                    <span className="blinking-cursor">_</span>
                </h2>
                <p className="mt-6 max-w-xl text-lg text-slate-400">
                    The page you are looking for has been lost in the data stream or never existed. Check the URL or return to a known sector.
                </p>
                <a 
                    href="/"
                    className="mt-10 px-8 py-3 font-mono font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md relative overflow-hidden group"
                >
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <span className="relative glitch-hover" data-text="[Return_To_Homepage]">
                        [Return_To_Homepage]
                    </span>
                </a>
            </div>
        </section>
    );
};

export default NotFoundPage;
