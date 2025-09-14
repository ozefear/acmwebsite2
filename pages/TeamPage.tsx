import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import Section from '../components/Section';
import { TEAM_DATA } from '../constants';
import TeamMemberCard from '../components/TeamMemberCard';
import { TeamMember } from '../types';

const desktopLayoutPattern = [2, 1, 3, 2, 1, 2, 3, 3, 2];

const TeamPage: React.FC = () => {
    // State to force re-render on mount (fixes mobile visibility issues)
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    // useMemo ensures this complex calculation is not re-run on every render.
    // This logic is also more robust and handles any number of team members.
    const desktopRows = useMemo(() => {
        const rows: TeamMember[][] = [];
        let currentIndex = 0;

        // Create rows based on the predefined layout pattern for a unique look
        desktopLayoutPattern.forEach(numInRow => {
            const members = TEAM_DATA.slice(currentIndex, currentIndex + numInRow);
            if (members.length > 0) {
                rows.push(members);
            }
            currentIndex += numInRow;
        });
        
        // Handle any remaining members not covered by the pattern
        const remaining = TEAM_DATA.slice(currentIndex);
        if (remaining.length > 0) {
            // Group remaining members into a standard 3-column grid layout
            for (let i = 0; i < remaining.length; i += 3) {
                rows.push(remaining.slice(i, i + 3));
            }
        }
        return rows;
    }, []); // TEAM_DATA is a constant, so the dependency array is empty.

    return (
    <Section id="team" title="[Ekibimiz]" className="min-h-screen w-full">
            {/* Mobile & Tablet Layout: A responsive grid that adapts to screen size. */}
            {mounted && (
                <div className="grid grid-cols-1 gap-8 lg:hidden min-h-screen py-8">
                    {TEAM_DATA.map(member => (
                        <TeamMemberCard key={member.id} member={member} />
                    ))}
                </div>
            )}

            {/* Desktop Layout: The custom, asymmetrical layout for larger screens. */}
            <div className="hidden lg:flex flex-col items-center gap-8 w-full max-w-7xl mx-auto">
                {desktopRows.map((rowMembers, rowIndex) => (
                    <div key={rowIndex} className="flex flex-row flex-wrap justify-center items-stretch gap-8 w-full">
                        {rowMembers.map(member => (
                            <div key={member.id} className="basis-96 grow-0 shrink-0 flex">
                                <TeamMemberCard member={member} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default TeamPage;