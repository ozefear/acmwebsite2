import React, { useState, useEffect } from 'react';

const LOGO = [
"      :::::::::      ",
"     :+:    :+:     ",
"    +:+    +:+      ",
"   +#++:++#+       ",
"  +#+    +#+       ",
" #+#    #+#        ",
"#########         "
];

const startTime = Date.now();

const SysInfo: React.FC = () => {
    const [uptime, setUptime] = useState('');

    useEffect(() => {
        const updateUptime = () => {
            const now = Date.now();
            const diffSeconds = Math.floor((now - startTime) / 1000);
            const hours = Math.floor(diffSeconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((diffSeconds % 3600) / 60).toString().padStart(2, '0');
            const seconds = (diffSeconds % 60).toString().padStart(2, '0');
            setUptime(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateUptime();
        const interval = setInterval(updateUptime, 1000);

        return () => clearInterval(interval);
    }, []);

    const specs = [
        { label: 'OS', value: 'ACM Mainframe OS v3.1.4' },
        { label: 'Host', value: 'Hacettepe University Student Chapter' },
        { label: 'Kernel', value: '5.4.0-acm-generic' },
        { label: 'Uptime', value: uptime },
        { label: 'Shell', value: 'term.sh' },
        { label: 'CPU', value: 'Quantum Core @ 42 THz' },
        { label: 'GPU', value: 'Neural Matrix Renderer' },
        { label: 'Memory', value: '1024 PB / 8192 PB' },
    ];

    const maxLogoHeight = LOGO.length;
    const maxSpecHeight = specs.length;
    const displayRows = Math.max(maxLogoHeight, maxSpecHeight);

    return (
        <div className="flex gap-4">
            <pre className="text-[var(--terminal-primary)] leading-tight">{LOGO.join('\n')}</pre>
            <div>
                <div className="font-bold text-[var(--terminal-primary)]">
                    root@acm-hacettepe
                </div>
                <div className="w-full h-px my-1 bg-[var(--terminal-primary)]"></div>
                {specs.map(spec => (
                    <div key={spec.label} className="flex leading-tight">
                        <span className="font-bold w-20 text-[var(--terminal-primary)]">{spec.label}</span>
                        <span>{spec.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SysInfo;
